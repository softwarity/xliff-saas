import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, of, switchMap } from "rxjs";
import { Repository } from "../../shared/models/repository.model";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class BitbucketService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  getBranches(repository: Repository): Observable<string[]> {
    return this.tokenService.getToken('bitbucket').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          return of([]);
        }
        const headers = {
          'Authorization': `Basic ${btoa(token)}`,
          'Accept': 'application/json'
        }
        return this.http.get<Page<BitbucketBranch>>(`${repository.url}/refs/branches`, { headers }).pipe(
          map((data: Page<BitbucketBranch>) => {
            return data.values.map((branch: BitbucketBranch) => branch.name);
          })
        );
      })
    );
  }


  getRepositories(): Observable<Repository[]> {
    return this.tokenService.getToken('bitbucket').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          return of([]);
        }
        const headers = {
          'Authorization': `Basic ${btoa(token)}`,
          'Accept': 'application/json'
        };
        return this.http.get<Page<Workspace>>('https://api.bitbucket.org/2.0/user/permissions/workspaces', { headers }).pipe(
          switchMap((workspacesData: Page<Workspace>) => {
            const workspaces: Workspace[] = workspacesData.values || [];
            const workspaceRequests = workspaces.map((workspace: Workspace) => {
              const workspaceSlug = workspace.workspace.slug;
              return this.http.get<Page<BitbucketRepo>>(`https://api.bitbucket.org/2.0/repositories/${workspaceSlug}?pagelen=100&sort=-updated_on`, { headers }).pipe(
                map((reposData: Page<BitbucketRepo>) => this.transformBitbucketRepos(reposData.values || [])),
                catchError((error: Error) => {
                  console.error(`Error fetching repositories for workspace ${workspaceSlug}:`, error);
                  return of([]);
                })
              );
            });
            return forkJoin(workspaceRequests).pipe(
              map((results: Repository[][]) => results.flat()),
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
      })
    )
  }

  transformBitbucketRepos(repos: any[]): Repository[] {
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
}

interface Page<T> {
  values: T[];
  pagelen: number;
  size: number;
  page: number;
}

interface Href {
  href: string;
}

interface BitbucketBranch {
  name: string,
  target: {
      type: string,
      hash: string,
      date: string,
      author: {
          type: string,
          raw: string,
          user: {
              display_name: string,
              links: {
                  self: Href,
                  avatar: Href,
                  html: Href
              },
              type: string,
              uuid: string,
              account_id: string,
              nickname: string
          }
      },
      message: string,
      links: {
          self: Href,
          html: Href,
          diff: Href,
          approve: Href,
          comments: Href,
          statuses: Href,
          patch: Href
      },
      parents: [
          {
              hash: string,
              links: {
                  self: Href,
                  html: Href
              },
              type: string
          }
      ],
      repository: {
          type: string,
          full_name: string,
          links: {
              self: Href,
              html: Href,
              avatar: Href
          },
          name: string,
          uuid: string
      }
  },
  links: {
      self: Href,
      commits: Href,
      html: Href,
      pullrequest_create: Href
  },
  type: string,
  merge_strategies: string[],
  sync_strategies: string[],
  default_merge_strategy: string
}

interface Workspace {
  type: string;
  user: {
    display_name: string;
    links: {
      self: {
        href: string;
      },
      avatar: {
        href: string;
      },
      html: {
        href: string;
      }
    },
    type: string;
    uuid: string;
    account_id: string;
    nickname: string;
  },
  workspace: {
    type: string;
    uuid: string;
    name: string;
    slug: string;
    links: {
      avatar: Href,
      html: Href,
      self: Href
    }
  },
  links: {
    self: Href
  },
  permission: string;
  added_on: string;
  last_accessed: string;
}

interface BitbucketRepo {
  type: string;
  full_name: string;
  links: {
    self: Href;
    html: Href;
    avatar: Href;
    pullrequests: Href;
    commits: Href;
    forks: Href;
    watchers: Href;
    branches: Href;
    tags: Href;
    downloads: Href;
    source: Href;
    clone: (Href & { name: string })[];
    hooks: Href;
  },
  name: string;
  slug: string;
  description: string;
  scm: string;
  website: string | null;
  owner: {
    display_name: string;
    links: {
      self: Href;
      avatar: Href;
      html: Href;
    },
    type: string;
    uuid: string;
    username: string;
  },
  workspace: {
    type: string;
    uuid: string;
    name: string;
    slug: string;
    links: {
      avatar: Href;
      html: Href;
      self: Href;
    }
  },
  is_private: boolean;
  project: {
    type: string;
    key: string;
    uuid: string;
    name: string;
    links: {
      self: Href;
      html: Href;
      avatar: Href;
    }
  },
  fork_policy: string;
  created_on: string;
  updated_on: string;
  size: number;
  language: string;
  uuid: string;
  mainbranch: {
    name: string;
    type: string;
  },
  override_settings: {
    default_merge_strategy: boolean;
    branching_model: boolean;
  },
  parent: null,
  enforced_signed_commits: null,
  has_issues: boolean;
  has_wiki: boolean;
}