import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from '../const.ts';
import { Job } from '../entities/job.ts';
import { launchEstimateRunner } from '../lib/git-service.ts';
import { JobDao } from '../lib/job-dao.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { GhEstimateInputs } from '../models/gh-action-inputs.ts';

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }
    if (req.method !== 'POST') {
        return new Response(null, { headers: CORS_HEADERS, status: 405 });
    }
    
    const url = new URL(req.url);
    const pathname = url.pathname;
    const provider = pathname.split('/').pop() as 'github' | 'gitlab' | 'bitbucket';
    let jobId: string | undefined;
    const supabaseClient = getSupabaseClient();
    const jobDao = new JobDao(supabaseClient);
    const userService = new UserService(supabaseClient);
    try {
        const user = await userService.getUser(req);
        const userId = user.id;
        
        const { namespace, name, branch, ext: EXT_XLIFF, transUnitState: STATE } = await req.json();
        console.log('Estimation request received', namespace, name, branch, EXT_XLIFF, STATE);
        
        if (await jobDao.existsAndNotCompleted('estimation', userId, provider, namespace, name)) {
            throw new Error('Estimation already launch for this repository and is not completed');
        }
        console.log('Estimation not exists or completed, start new estimation...');
        const payload: Omit<Job, 'request' | 'userId' | 'provider' | 'namespace' | 'repository' | 'id'> = {
            branch, ext: EXT_XLIFF, transUnitState: STATE, status: 'pending', transUnitFound: 0, details: {}
        };
        const toInsert: Omit<Job, 'id'> = { request: 'estimation', userId, provider, namespace, repository: name, ...payload };
        const job = await jobDao.insert(toInsert);
        jobId = job.id;
        const TOKEN = user.user_metadata[provider];
        const WEBHOOK_URL = `${Deno.env.get('HOST_WEBHOOK')}/functions/v1/estimate-webhook/${job.id}`;
        const WEBHOOK_JWT = Deno.env.get('SUPABASE_ANON_KEY')!;
        const REPOSITORY_INFO = `${namespace}/${name}@${branch}`;
        const inputs: GhEstimateInputs = { 
            TOKEN, REPOSITORY_INFO, 
            GIT_PROVIDER: provider, EXT_XLIFF, 
            STATE, 
            WEBHOOK_URL, WEBHOOK_JWT 
        };
        console.log('Estimation launching for ', `${namespace}/${name}@${branch} by ${user.email}. JobId: ${job.id}`);
        await launchEstimateRunner(inputs);
        console.log('Estimation launched for ', `${namespace}/${name}@${branch} by ${user.email}. JobId: ${job.id}`);
        return new Response(JSON.stringify({ message: 'Estimate triggered successfully!', job }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
        }, status: 200 });
    } catch(error: any) {
        console.error('Error launching estimation', error);
        if (jobId) {
            await jobDao.updateById(jobId, { status: 'failed', details: { error: error.message } });
        }
        return new Response(JSON.stringify({ error: error.message }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json'
        }, status: 500 });
    }
});