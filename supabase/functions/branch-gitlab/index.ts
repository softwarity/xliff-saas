import { firstValueFrom, from, map, Observable, switchMap } from 'https://esm.sh/rxjs@7.5.7';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { headers: corsHeaders, status: 405 });
  }
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);

  // Récupérer le paramètre 'url'
  const encodedUrl = params.get('url');
  if (!encodedUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }
  const baseUrl = decodeURIComponent(encodedUrl);
  try {
    const supabaseClient = getSupabaseClient();
    const userService = new UserService(supabaseClient);
    const userId = await userService.getUserId(req);
    const token = await userService.getGitToken(userId, 'gitlab');
    const branches: string[] = await firstValueFrom(getGitlabBranches(token, baseUrl));
    return new Response(JSON.stringify(branches), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }, status: 200
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }, status: 401
    });
  }

});

function getGitlabBranches(token: string | null, baseUrl: string): Observable<string[]> {
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  return from(fetch(`${baseUrl}/repository/branches`, { headers })).pipe(
    switchMap((response: Response) => response.json()),
    map((data: any) => data.map((branch: any) => branch.name))
  ); 
}