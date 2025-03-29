import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { JobDao } from '../lib/job-dao.ts';
import { TransactionDao } from '../lib/transaction-dao.ts';
import { Job } from "../entities/job.ts";
import { cancelRun } from '../lib/git-service.ts';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(null, {status: 405});
  }
  const url = new URL(req.url);
  const pathname = url.pathname;
  const [,, jobId, runId] = pathname.split('/');
  if (!jobId) {
    return new Response(null, {status: 400});
  }
  const supabaseClient = getSupabaseClient();
  const jobDao = new JobDao(supabaseClient);
  const transactionDao = new TransactionDao(supabaseClient);
  try {
    const body = await req.json(); 
    const {request, userId, provider, namespace, repository, branch, status}: Job = await jobDao.getById(jobId);
    console.log('Received translate-webhook', request, userId, provider, namespace, repository, branch, runId, body);
    if (status === 'cancelling') {
      await cancelRun(runId);
      await jobDao.updateById(jobId, {status: 'cancelled'});
      return new Response(null, {status: 200});
    }
    if (status === 'cancelled') {
      return new Response(null, {status: 200});
    }
    if (status === 'failed') {
      return new Response(null, {status: 200});
    }
    if (body.type === 'start') {
      await jobDao.updateById(jobId, {status: 'estimating', details: {}, transUnitFound: 0, runId});
    } else if (body.type === 'estimation-done') {
      const {id: transactionId} = await transactionDao.insert({"userId": userId, credits: -body.transUnits, status: 'pending', message: '', details: {}});
      await jobDao.updateById(jobId, {status: 'translating', transactionId, transUnitDone:0, transUnitFound: body.total});
    } else if (body.type === 'progress') {
      const transUnitDone: number = body.completed + body.error;
      await jobDao.updateById(jobId, {status: 'translating', transUnitDone, transUnitFound: body.total, transUnitFailed: body.error});
    } else if (body.type === 'error') {
      const transUnitDone: number = body.completed + body.error;
      const {transactionId} = await jobDao.updateById(jobId, {status: 'failed', transUnitDone});
      if (transactionId) {
        await transactionDao.updateById(transactionId, {status: 'failed', message: body.error});
      }
    } else if (body.type === 'done') {
      const {transactionId} = await jobDao.updateById(jobId, {status: 'completed'});
      if (transactionId) {
        await transactionDao.updateById(transactionId, {status: 'completed', message: 'Translation completed', details: {}});
      }
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
      const {transactionId} = await jobDao.updateById(jobId, {status: 'failed', details: e});
      if (transactionId) {
        await transactionDao.updateById(transactionId, {status: 'failed', message: 'Translation failed', details: e});
      }
    }
    console.error('Error processing translate-webhook:', error);
    return new Response(null, {status: 400});
  }
});