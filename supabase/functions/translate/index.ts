import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from '../const.ts';
import { Job } from '../entities/job.ts';
import { launchTranslateRunner } from '../lib/git-service.ts';
import { JobDao } from '../lib/job-dao.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { GhTranslateInputs } from '../models/gh-action-inputs.ts';

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
    try {
        const supabaseClient = getSupabaseClient();
        const jobDao = new JobDao(supabaseClient);
        const userService = new UserService(supabaseClient);
        const user = await userService.getUser(req);
        const userId = user.id;
        const balance = await userService.getBalance(userId);
        if (balance <= 0) {
            throw new Error('Not enough credits');
        }
        const { namespace, name, branch, ext: EXT_XLIFF, transUnitState: STATE, procedeedTransUnitState: PROCEEDED_STATE } = await req.json();
        
        if (await jobDao.existsAndNotCompleted('translation', userId, provider, namespace, name)) {
            console.log('Translation already launch for this repository and is not completed');
            throw new Error('Translation already launch for this repository and is not completed');
        }
        console.log('Translation not exists or completed, start...');
        const payload: Omit<Job, 'request' | 'userId' | 'provider' | 'namespace' | 'repository' | 'id'> = {
            branch, ext: EXT_XLIFF, transUnitState: STATE, status: 'pending', transUnitFound: 0, details: {}
        };
        const toInsert: Omit<Job, 'id'> = { request: 'translation', userId, provider, namespace, repository: name, ...payload };
        const job = await jobDao.insert(toInsert);
        
        const TOKEN = await userService.getGitToken(userId, provider);
        const WEBHOOK_URL = `${Deno.env.get('HOST_WEBHOOK')}/functions/v1/translate-webhook/${job.id}`;
        const WEBHOOK_JWT = Deno.env.get('SUPABASE_ANON_KEY')!;
        const REPOSITORY_INFO = `${namespace}/${name}@${branch}`;
        const inputs: GhTranslateInputs = { 
            TOKEN, REPOSITORY_INFO, 
            GIT_PROVIDER: provider, EXT_XLIFF, 
            STATE, PROCEEDED_STATE, 
            WEBHOOK_URL, WEBHOOK_JWT, 
            CREDITS: `${balance}`,
            DRY_RUN
        };
        await launchTranslateRunner(inputs);
        console.log('Translation launched for ', `${namespace}/${name}@${branch} by ${user.email}. JobId: ${job.id}`);
        return new Response(JSON.stringify({ message: 'Translation triggered successfully!', job }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
        }, status: 200 });
    } catch(error: any) {
        return new Response(JSON.stringify({ error: error.message }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json'
        }, status: 500 });
    }
});


const DRY_RUN = 'true';