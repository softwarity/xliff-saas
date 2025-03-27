import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { getGitToken } from '../lib/git-token.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { JobDao } from '../lib/job-dao.ts';
import { UserService } from '../lib/user-service.ts';
import { CORS_HEADERS } from '../const.ts';
import { Job } from '../entities/job.ts';
import { launchTranslateRunner } from '../lib/git-service.ts';
import { GhTranslateInputs } from '../models/gh-action-inputs.ts';
const request: 'estimation' | 'translation' = 'translation';

const DRY_RUN = 'true';
const CREDITS = 1000;

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
        const userId = await userService.getUserId(req);


        const { namespace, name, branch, ext: EXT_XLIFF, transUnitState: STATE, procedeedTransUnitState: PROCEEDED_STATE } = await req.json();
        const WEBHOOK_URL = `${Deno.env.get('HOST_WEBHOOK')}/functions/v1/webhook/${request}/${userId}/${provider}/${namespace}/${name}/${branch}`;

        if (await jobDao.existsAndNotCompleted(request, userId, provider, namespace, name)) {
            console.log('Translation already launch for this repository and is not completed');
            throw new Error('Translation already launch for this repository and is not completed');
        }
        console.log('Translation not exists or completed, start...');
        const payload: Omit<Job, 'request' | 'userId' | 'provider' | 'namespace' | 'repository'> = {
            branch, ext: EXT_XLIFF, transUnitState: STATE, status: 'estimation_pending', transUnitFound: 0, details: {}
        };
        if (await jobDao.exists(request, userId, provider, namespace, name)) {
            await jobDao.update(request, userId, provider, namespace, name, payload);
        } else {
            const job: Job = { request, userId, provider, namespace, repository: name, ...payload };
            await jobDao.insert(job);
        }
        
        const TOKEN = await getGitToken(req, provider);
        const WEBHOOK_JWT = Deno.env.get('SUPABASE_ANON_KEY')!;
        const REPOSITORY_INFO = `${namespace}/${name}@${branch}`;
        const inputs: GhTranslateInputs = { 
            TOKEN, REPOSITORY_INFO, 
            GIT_PROVIDER: provider, EXT_XLIFF, 
            STATE, PROCEEDED_STATE, 
            WEBHOOK_URL, WEBHOOK_JWT, 
            CREDITS: ''+CREDITS,
            DRY_RUN
        };
        await launchTranslateRunner(inputs);
        console.log('Translation launched for ', `${namespace}/${name}@${branch} by ${userId}`);
        return new Response(JSON.stringify({ message: 'Translation triggered successfully!' }), { headers: {
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
