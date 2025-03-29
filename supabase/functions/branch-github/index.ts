import { firstValueFrom, from, map, Observable, switchMap } from 'https://esm.sh/rxjs@7.5.7';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { CORS_HEADERS } from '../const.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { headers: CORS_HEADERS, status: 405 });
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
    const token = await userService.getGitToken(userId, 'github');
    const branches: string[] = await firstValueFrom(getGitHubBranches(token, baseUrl));
    return new Response(JSON.stringify(branches), {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      }, status: 200
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      }, status: 401
    });
  }

});

function getGitHubBranches(token: string | null, baseUrl: string): Observable<string[]> {
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
  return from(fetch(`${baseUrl}/branches`, { headers })).pipe(
    switchMap((response: Response) => response.json()),
    map((data: any) => data.map((branch: any) => branch.name))
  ); 
}