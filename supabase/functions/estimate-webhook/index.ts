import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { JobDao } from '../lib/job-dao.ts';
import { Job } from "../entities/job.ts";
import { cancelRun } from '../lib/git-service.ts';
import { EstimationDoneMessage } from '../models/webhook-message.ts';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(null, {status: 405});
  }
  const url = new URL(req.url);
  const pathname = url.pathname;
  const [,,jobId, runId] = pathname.split('/');
  const supabaseClient = getSupabaseClient();
  const jobDao = new JobDao(supabaseClient);
  try {
    const body = await req.json(); 
    const {request, userId, provider, namespace, repository, branch, status}: Job = await jobDao.getById(jobId);
    console.log('Received estimate-webhook', request, userId, provider, namespace, repository, branch, runId, body);
    if (status === 'cancelling') {
      await cancelRun(runId);
      await jobDao.updateById(jobId, {status: 'cancelled'});
      return new Response(null, {status: 200});
    }
    if (status === 'cancelled') {
      return new Response(null, {status: 200});
    }
    if (status === 'failed') {
      await jobDao.updateById(jobId, {status: 'failed', details: {error: body.message}});
      return new Response(null, {status: 200});
    }
    const {type} = body;
    if (type === 'start') {
      await jobDao.updateById(jobId, {status: 'estimating', details: {}, transUnitFound: 0, runId});
    } else if (type === 'estimation-done') {
      const {toTranslate, inputFiles}: EstimationDoneMessage = body;
      await jobDao.updateById(jobId, {status: 'completed', details: {...inputFiles}, transUnitFound: toTranslate});
    } else if (type === 'done') {
      // await jobDao.updateById(jobId, {status: 'completed'});
    }
    return new Response(null, {status: 200});
  } catch (error) {
    if (jobId) {
      let e: Record<string, unknown> | undefined;
      if (typeof error === 'string') {
        e = {message: error};
      } else {
        e = error as Record<string, unknown>;
      }
      await jobDao.updateById(jobId, {status: 'failed', details: e});
    }
    console.error('Error processing estimate-webhook:', error);
    return new Response(null, {status: 400});
  }
});