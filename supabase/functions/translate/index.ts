import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { EstimateDao } from '../lib/estimate-dao.ts';

Deno.serve(async (req) => {
    const workflowId = 'estimate.yml';
    const {GIT_TOKEN: TOKEN} = Deno.env.toObject();
    const WEBHOOK_URL = `${Deno.env.get('HOST_WEBHOOK')}/functions/v1/webhook`;
    const WEBHOOK_JWT = Deno.env.get('SUPABASE_ANON_KEY')


    // TODO Extract namespace and name, branch, ext, state from the request
    // TODO get credit from client
    const supabaseClient = getSupabaseClient();
    const estimateDao = new EstimateDao(supabaseClient);
    await estimateDao.update('softwarity', 'archway', {status: 'running'});


    const body = {
        ref: 'main', 
        inputs: {
            TOKEN,
            REPOSITORY_INFO: 'softwarity/archway@oss',
            GIT_PROVIDER: 'github',
            EXT_XLIFF: '.fr.xlf',
            STATE: 'new',
            PROCEEDED_STATE: 'translated',
            CREDITS: '1000',
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
        return new Response(JSON.stringify({ error }), { status: response.status });
    }

    return new Response(JSON.stringify({ message: 'Build triggered successfully!' }), { status: 200 });
});