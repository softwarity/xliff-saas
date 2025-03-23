import { firstValueFrom, from, map, Observable, switchMap } from 'https://esm.sh/rxjs@7.5.7';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getGitToken } from '../lib/git-token.ts';

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
    const token = await getGitToken(req, 'bitbucket');
    const branches: string[] = await firstValueFrom(getBitbucketBranches(token, baseUrl));
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

function getBitbucketBranches(token: string, baseUrl: string): Observable<string[]> {
  const headers = {
    'Authorization': `Basic ${btoa(token)}`,
    'Accept': 'application/json'
  }
  return from(fetch(`${baseUrl}/refs/branches`, { headers })).pipe(
    switchMap((response: Response) => response.json()),
    map((data: any) => {
      return data.values.map((branch: any) => branch.name);
    })
  );
}
