import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { JobDao } from '../lib/job-dao.ts';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(null, {status: 405});
  }
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const [,, action, userId, provider, namespace, name, branch, runId] = pathname.split('/');
    const body = await req.json(); 
    console.log('Received webhook', action, userId, provider, namespace, name, branch, runId, body);
    const supabaseClient = getSupabaseClient();
    const jobDao = new JobDao(supabaseClient);
    if (action === 'estimation') {
      if (body.type === 'start') {
        await jobDao.update('estimation', userId, provider, namespace, name, {status: 'estimation_running', details: [], transUnitFound: 0, runId});
      } else if (body.type === 'estimation-done') {
        const job = await jobDao.getByRunId(runId);
        console.log('estimation-done', job);
        await jobDao.updateByRunId(runId, {details: body.inputFiles, transUnitFound: body.transUnits});
      } else if (body.type === 'done') {
        await jobDao.updateByRunId(runId, {status: 'completed'});
      }
      return new Response(null, {status: 200});
    } else if (action === 'translation') {
      if (body.type === 'start') {
        await jobDao.update('translation', userId, provider, namespace, name, {status: 'estimation_running', details: [], transUnitFound: 0, runId});
      } else if (body.type === 'estimation-done') {
        // create transaction
        const transactionId = undefined;
        await jobDao.updateByRunId(runId, {status: 'translation_pending', transactionId, transUnitDone:0, transUnitFound: body.total});
      } else if (body.type === 'progress') {
        const transUnitDone: number = body.completed + body.error;
        await jobDao.updateByRunId(runId, {status: 'translation_running', transUnitDone, transUnitFound: body.total});
      } else if (body.type === 'error') {
        const transUnitDone: number = body.completed + body.error;
        await jobDao.updateByRunId(runId, {status: 'failed', transUnitDone});
      } else if (body.type === 'done') {
        // apply transaction
        const job = await jobDao.getByRunId(runId);
        console.log('job', job);
        await jobDao.updateByRunId(runId, {status: 'completed'});
      }
      return new Response(null, {status: 200});
    }
    return new Response(null, {status: 405});
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(null, {status: 400});
  }
});