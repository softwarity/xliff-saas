import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { catchError, firstValueFrom, forkJoin, from, map, Observable, of, switchMap } from 'https://esm.sh/rxjs@7.5.7';
import { getGitToken } from '../lib/git-token.ts';
import { Repository } from '../models/repository.ts';
import { CORS_HEADERS } from '../const.ts';

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: CORS_HEADERS});
    }
    if (req.method !== 'GET') {
        return new Response('Method not allowed', {headers: CORS_HEADERS, status: 405});
    }
    try {
        const token = await getGitToken(req, 'bitbucket');
        const repositories: Repository[] = await firstValueFrom(getBitbucketRepositories(token));
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
 
function getBitbucketRepositories(token: string): Observable<Repository[]> {
    const headers = {
      'Authorization': `Basic ${btoa(token)}`,
      'Accept': 'application/json'
    };
    return from(fetch('https://api.bitbucket.org/2.0/user/permissions/workspaces', { headers })).pipe(
      switchMap((response: Response) => response.json()),
      switchMap((workspacesData: any) => {
        const workspaces = workspacesData.values || [];
        const workspaceRequests = workspaces.map((workspace: any) => {
          const workspaceSlug = workspace.workspace.slug;
          return from(fetch(
            `https://api.bitbucket.org/2.0/repositories/${workspaceSlug}?pagelen=100&sort=-updated_on`,
            { headers }
          )).pipe(
            switchMap((response: Response) => response.json()),
            map((reposData: any) => transformBitbucketRepos(reposData.values || [])),
            catchError((error: Error) => {
              console.error(`Error fetching repositories for workspace ${workspaceSlug}:`, error);
              return of([]);
            })
          );
        });
        return forkJoin(workspaceRequests).pipe(
          map((results: any) => results.flat()),
          catchError((error: Error) => {
            console.error('Error combining workspace results:', error);
            return of([]);
          })
        );
      }),
      catchError((error: Error) => {
        console.error('Error fetching Bitbucket workspaces:', error);
        return of([]);
      })
    );
}

function transformBitbucketRepos(repos: any[]): Repository[] {
    return repos.map(repo => {
        return {
        id: repo.uuid,
        provider: 'bitbucket',
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        visibility: repo.is_private ? 'private' : 'public',
        updated_at: repo.updated_on,
        htmlUrl: repo.links.html.href,
        url: repo.links.self?.href,
        defaultBranch: repo.mainbranch?.name || 'main',
        namespace: repo.workspace?.slug,
        branches: []
        }
    });
}