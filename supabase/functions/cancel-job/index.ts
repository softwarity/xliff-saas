import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from '../const.ts';
import { Job } from '../entities/job.ts';
import { cancelRun } from '../lib/git-service.ts';
import { JobDao } from '../lib/job-dao.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }
    if (req.method !== 'GET') {
        return new Response(null, { headers: CORS_HEADERS, status: 405 });
    }

    
    const url = new URL(req.url);
    const pathname = url.pathname;
    const jobId = pathname.split('/').pop() as string;
    console.log('Cancelling job', jobId);
    if (!jobId) {
        return new Response(JSON.stringify({ error: 'Job ID is required' }), { headers: CORS_HEADERS, status: 400 });
    }
    try {
        const supabaseClient = getSupabaseClient();
        const jobDao = new JobDao(supabaseClient);
        const userService = new UserService(supabaseClient);
        const user = await userService.getUser(req);

        const job: Job = await jobDao.getById(jobId);
        if (!job) {
            console.log(`Job not found: ${jobId}`);
            return new Response(JSON.stringify({ error: `Job not found: ${jobId}` }), { headers: CORS_HEADERS, status: 404 });
        }
        console.log('Cancelling run', job.runId);
        await jobDao.updateById(jobId, { status: 'cancelling' });
        if (job.runId) {
            await cancelRun(job.runId!);
            await jobDao.updateById(jobId, { status: 'cancelled' });
        }
        console.log('Job cancelled for ', `${job.namespace}/${job.repository}@${job.branch}. JobId: ${job.id} by ${user.email}`);
        return new Response(JSON.stringify({ message: 'Job cancelled successfully!', job }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
        }, status: 200 });
    } catch(error: any) {
        console.log('Error cancelling job', error);
        return new Response(JSON.stringify({ error: error.message }), { headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json'
        }, status: 500 });
    }
});