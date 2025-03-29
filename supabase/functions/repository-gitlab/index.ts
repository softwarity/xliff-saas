import { firstValueFrom, from, map, Observable, switchMap } from 'https://esm.sh/rxjs@7.5.7';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Repository } from '../models/repository.ts';
import { CORS_HEADERS } from '../const.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: CORS_HEADERS});
    }
    if (req.method !== 'GET') {
        return new Response('Method not allowed', {headers: CORS_HEADERS, status: 405});
    }
    try {
        const supabaseClient = getSupabaseClient();
        const userService = new UserService(supabaseClient);
        const userId = await userService.getUserId(req);
        const token = await userService.getGitToken(userId, 'gitlab');
        const repositories: Repository[] = await firstValueFrom(getGitlabRepositories(token));
        return new Response(JSON.stringify(repositories), {
            headers: { 
                ...CORS_HEADERS,
                'Content-Type': 'application/json',
            } ,status: 200
        });
    } catch(error: any) {
        return new Response(JSON.stringify({error: error.message}), {
            headers: { 
                ...CORS_HEADERS,
                'Content-Type': 'application/json',
            } ,status: 401
        });
    }
});
 
function getGitlabRepositories(token: string | null): Observable<Repository[]> {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    return from(fetch('https://gitlab.com/api/v4/projects?owned=true&per_page=100&order_by=updated_at', { headers })).pipe(
      switchMap((response: Response) => response.json()),
      map((repos: any) => transformGitlabRepos(repos))
    )
  }

function transformGitlabRepos(repos: any[]): Repository[] {
    return repos.map(repo => ({
        id: repo.id.toString(),
        provider: 'gitlab',
        name: repo.name,
        description: repo.description,
        language: repo.language,
        visibility: repo.visibility,
        stars: repo.star_count,
        forks: repo.forks_count,
        updated_at: repo.last_activity_at,
        htmlUrl: repo.web_url,
        url: repo._links?.self,
        namespace: repo.namespace?.path,
        defaultBranch: repo.default_branch
    }))
}

