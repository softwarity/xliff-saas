import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { JobDao } from '../lib/job-dao.ts';
import { Job } from "../entities/job.ts";

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(null, {status: 405});
  }
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const [,,jobId, runId] = pathname.split('/');
    const body = await req.json(); 
    const supabaseClient = getSupabaseClient();
    const jobDao = new JobDao(supabaseClient);
    const {request, userId, provider, namespace, repository, branch}: Job = await jobDao.getById(jobId);
    console.log('Received estimate-webhook', request, userId, provider, namespace, repository, branch, runId, body);
    if (body.type === 'start') {
      await jobDao.updateById(jobId, {status: 'estimation_running', details: [], transUnitFound: 0, runId});
    } else if (body.type === 'estimation-done') {
      await jobDao.updateById(jobId, {status: 'completed', details: body.inputFiles, transUnitFound: body.transUnits});
    } else if (body.type === 'done') {
      // await jobDao.updateById(jobId, {status: 'completed'});
    }
    return new Response(null, {status: 200});
  } catch (error) {
    console.error('Error processing estimate-webhook:', error);
    return new Response(null, {status: 400});
  }
});