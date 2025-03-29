import { catchError, firstValueFrom, forkJoin, from, map, Observable, switchMap } from 'https://esm.sh/rxjs@7.5.7';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from '../const.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { Repository } from '../models/repository.ts';

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
        const token = await userService.getGitToken(userId, 'github');
        const repositories: Repository[] = await firstValueFrom(getGitHubRepositories(token));
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
 
function getGitHubRepositories(token: string): Observable<Repository[]> {
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    }
    // Récupérer les dépôts personnels
    const userRepos$ = from(fetch('https://api.github.com/user/repos?per_page=100&sort=updated&type=all', { headers })).pipe(
        switchMap((response: Response) => response.json()),
        map((repos: any) => transformGitHubRepos(repos))
    );
    // Récupérer les organisations
    const orgs$ = from(fetch('https://api.github.com/user/orgs', { headers })).pipe(
        switchMap((response: Response) => response.json()),
        switchMap((orgs: any) => {
            // Pour chaque organisation, récupérer ses dépôts
            const orgRepos$ = orgs.map((org: any) => {
                return from(fetch(`https://api.github.com/orgs/${org.login}/repos?per_page=100&sort=updated`, { headers })).pipe(
                    switchMap((response: Response) => response.json()),
                    map((repos: any) => transformGitHubRepos(repos))
                )
            });
            return forkJoin([userRepos$, ...orgRepos$]);
        }),
        map((results: Repository[][]) => results.flat()),
        map((repositories: Repository[]) => {
            return Array.from(new Map(repositories.map(repo => [`${repo.namespace}/${repo.name}`, repo])).values());
        }),
        catchError((error: any) => {
            console.error('Error fetching GitHub repositories:', error);
            return userRepos$; // En cas d'erreur avec les orgs, retourner au moins les dépôts personnels
        })
    );
    return orgs$;
}

function transformGitHubRepos(repos: any[]): Repository[] {
    return repos.map(repo => ({
      id: repo.id.toString(),
      provider: 'github',
      name: repo.name,
      description: repo.description,
      language: repo.language,
      visibility: repo.private ? 'private' : 'public',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      htmlUrl: repo.html_url,
      url: repo.url,
      namespace: repo.owner?.login,
      defaultBranch: repo.default_branch
    }));
  }