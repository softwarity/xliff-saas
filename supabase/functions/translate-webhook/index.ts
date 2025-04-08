import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { JobDao } from '../lib/job-dao.ts';
import { TransactionDao } from '../lib/transaction-dao.ts';
import { Job } from "../entities/job.ts";
import { cancelRun } from '../lib/git-service.ts';
import { EstimationDoneMessage, ProgressMessage, ErrorMessage } from '../models/webhook-message.ts';
import { UserService } from '../lib/user-service.ts';
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
  const userService = new UserService(supabaseClient);
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
    const {type} = body;
    if (type === 'start') {
      await jobDao.updateById(jobId, {status: 'estimating', details: {}, transUnitFound: 0, runId});
    } else if (type === 'estimation-done') {
      const {toTranslate}: EstimationDoneMessage = body;
      const balance = await userService.getBalance(userId);
      const credits = Math.max(balance - toTranslate, 0);
      const {id: transactionId} = await transactionDao.insert({"userId": userId, credits, status: 'pending', message: '', details: {}});
      await jobDao.updateById(jobId, {status: 'translating', transactionId, transUnitDone:0, transUnitFound: toTranslate});
    } else if (type === 'progress') {
      const {toTranslate, completed, errors}: ProgressMessage = body;
      await jobDao.updateById(jobId, {status: 'translating', transUnitDone: completed, transUnitFound: toTranslate, transUnitFailed: errors});
    } else if (type === 'error') {
      const {toTranslate, completed, errors, errorCause}: ErrorMessage = body;
      const {transactionId} = await jobDao.updateById(jobId, {status: 'failed', transUnitDone: completed, transUnitFound: toTranslate, transUnitFailed: errors});
      if (transactionId) {
        await transactionDao.updateById(transactionId, {status: 'failed', message: errorCause});
      }
    } else if (type === 'done') {
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