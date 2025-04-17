import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from '../const.ts';
import { Job } from '../entities/job.ts';
import { launchTranslateRunner } from '../lib/git-service.ts';
import { JobDao } from '../lib/job-dao.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { GhInputs, GhTranslateOptions } from '../models/gh-action-inputs.ts';

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
        const balance = await userService.getBalance(userId);
        if (balance <= 0) {
            throw new Error('Not enough credits');
        }
        const { namespace, name, branch, ext: EXT_XLIFF, transUnitState: STATE, procedeedTransUnitState: PROCEEDED_STATE } = await req.json();
        console.log('Translation request received', namespace, name, branch, EXT_XLIFF, STATE, PROCEEDED_STATE);

        if (await jobDao.existsAndNotCompleted('translation', userId, provider, namespace, name)) {
            throw new Error('Translation already launch for this repository and is not completed');
        }
        console.log('Translation not exists or completed, start new translation...');
        const payload: Omit<Job, 'request' | 'userId' | 'provider' | 'namespace' | 'repository' | 'id'> = {
            branch, ext: EXT_XLIFF, transUnitState: STATE, status: 'pending', transUnitFound: 0, details: {}
        };
        const toInsert: Omit<Job, 'id'> = { request: 'translation', userId, provider, namespace, repository: name, ...payload };
        const job = await jobDao.insert(toInsert);
        
        const GIT_TOKEN = user.user_metadata[provider];
        const WEBHOOK_URL = `${Deno.env.get('HOST_WEBHOOK')}/functions/v1/translate-webhook/${job.id}`;
        const WEBHOOK_JWT = Deno.env.get('SUPABASE_ANON_KEY')!;
        const options: GhTranslateOptions = {
            NAMESPACE: namespace,
            REPOSITORY: name,
            BRANCH: branch,
            GIT_TOKEN,
            EXT_XLIFF, 
            STATE, PROCEEDED_STATE,
            CREDITS: balance || 0,
            MEMBERSHIP_LEVEL: 'DIAMOND',
            DRY_RUN: Deno.env.get('DRY_RUN') === 'true' ? 'true' : 'false',
            MODEL: 'gpt-4o-mini'
        };
        const OPTIONS = JSON.stringify(options);
        const inputs: GhInputs = { 
            GIT_PROVIDER: provider, 
            WEBHOOK_URL, WEBHOOK_JWT, 
            OPTIONS, 
        };
        console.log('Translation launching for ', `${namespace}/${name}@${branch} by ${user.email}. JobId: ${job.id}`);
        await launchTranslateRunner(inputs);
        console.log('Translation launched for ', `${namespace}/${name}@${branch} by ${user.email}. JobId: ${job.id}`);
        return new Response(JSON.stringify({ message: 'Translation triggered successfully!', job }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
        }, status: 200 });
    } catch(error: any) {
        console.error('Error launching translation', error);
        if (jobId) {
            await jobDao.updateById(jobId, { status: 'failed', details: { error: error.message } });
        }
        return new Response(JSON.stringify({ error: error.message }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json'
        }, status: 500 });
    }
});
