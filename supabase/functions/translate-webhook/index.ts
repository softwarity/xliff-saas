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
    const [,, jobId, runId] = pathname.split('/');
    const body = await req.json(); 
    const supabaseClient = getSupabaseClient();
    const jobDao = new JobDao(supabaseClient);
    const {request, userId, provider, namespace, repository, branch}: Job = await jobDao.getById(jobId);
    console.log('Received translate-webhook', request, userId, provider, namespace, repository, branch, runId, body);
    if (body.type === 'start') {
      await jobDao.updateById(jobId, {status: 'estimating', details: [], transUnitFound: 0, runId});
    } else if (body.type === 'estimation-done') {
      // create transaction
      const transactionId = undefined;
      await jobDao.updateById(jobId, {status: 'translating', transactionId, transUnitDone:0, transUnitFound: body.total});
    } else if (body.type === 'progress') {
      const transUnitDone: number = body.completed + body.error;
      await jobDao.updateById(jobId, {status: 'translating', transUnitDone, transUnitFound: body.total, transUnitFailed: body.error});
    } else if (body.type === 'error') {
      const transUnitDone: number = body.completed + body.error;
      await jobDao.updateById(jobId, {status: 'failed', transUnitDone});
    } else if (body.type === 'done') {
      // apply transaction
      await jobDao.updateById(jobId, {status: 'completed'});
    }
    return new Response(null, {status: 200});
  } catch (error) {
    console.error('Error processing translate-webhook:', error);
    return new Response(null, {status: 400});
  }
});