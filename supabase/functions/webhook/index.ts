import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { EstimateDao } from '../lib/estimate-dao.ts';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(null, {status: 405});
  }
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const [,, action, provider, namespace, name, branch] = pathname.split('/');
    const body = await req.json(); 
    console.log('Received webhook', action, provider, namespace, name, branch);
    if (action === 'estimate') {
      console.log('Received estimate webhook', body);
      let status: 'pending' | 'running' | 'completed' | 'failed' | undefined = 'pending';
      if (body.type === 'start') {
        status = 'running';
      } else if (body.type === 'estimation') {
        status = 'completed';
      }
      const supabaseClient = getSupabaseClient();
      const estimateDao = new EstimateDao(supabaseClient);
      await estimateDao.update(namespace, name, {status, details: body.inputFiles || [], transUnitCount: body.transUnits || 0});
      return new Response(null, {status: 200});
    }
    return new Response(null, {status: 405});
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(null, {status: 400});
  }
});