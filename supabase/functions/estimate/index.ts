import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { getGitToken } from '../lib/git-token.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { EstimateDao } from '../lib/estimate-dao.ts';
import { UserService } from '../lib/user-service.ts';
import { CORS_HEADERS } from '../const.ts';
import { Estimation } from '../entities/estimation.ts';
Deno.serve(async (req) => {
    console.log('estimate');
    
    const workflowId = 'estimate.yml';
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
        const { namespace, name, branch, ext: EXT_XLIFF, transUnitState: STATE } = await req.json();
        const WEBHOOK_URL = `${Deno.env.get('HOST_WEBHOOK')}/functions/v1/webhook/estimate/${provider}/${namespace}/${name}/${branch}`;
        const supabaseClient = getSupabaseClient();
        const estimateDao = new EstimateDao(supabaseClient);

        if (await estimateDao.existsAndNotCompleted(namespace, name)) {
            console.log('Estimation already launch for this repository and is not completed');
            throw new Error('Estimation already launch for this repository and is not completed');
        }
        console.log('Exists and completed, restart estimation');
        const userService = new UserService(supabaseClient);
        const userId = await userService.getUserId(req);
        if (await estimateDao.exists(namespace, name)) {
            await estimateDao.update(namespace, name, {branch, ext: EXT_XLIFF, transUnitState: STATE, status: 'pending', transUnitCount: 0, details: {}});
        } else {
            const estimate: Estimation = { userId, namespace, repository: name, branch, ext: EXT_XLIFF, transUnitState: STATE, status: 'pending', transUnitCount: 0, details: {} };
            await estimateDao.insert(estimate);
        }
        console.log('Estimation launched for this repository');
        
        const TOKEN = await getGitToken(req, provider);
        const WEBHOOK_JWT = Deno.env.get('SUPABASE_ANON_KEY')
        const body = {
            ref: 'main',
            inputs: {
                TOKEN,
                REPOSITORY_INFO: `${namespace}/${name}@${branch}`,
                GIT_PROVIDER: provider,
                EXT_XLIFF,
                STATE,
                WEBHOOK_URL,
                WEBHOOK_JWT
            }
        }
        const response = await fetch(`https://api.github.com/repos/softwarity/xliff-runner/actions/workflows/${workflowId}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return new Response(JSON.stringify({ message: 'Estimate triggered successfully!' }), { headers: {
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