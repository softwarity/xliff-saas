import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, of, switchMap } from "rxjs";
import { Repository } from "../../../shared/models/repository.model";
import { TokenService } from "../../../core/services/token.service";
import { ToastService } from "../../../core/services/toast.service";

@Injectable()
export class GithubService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private toastService = inject(ToastService);

  getRepositories(): Observable<Repository[]> {
    return this.tokenService.getToken('github').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          this.toastService.error($localize`:@@GITHUB_TOKEN_NOT_FOUND:GitHub token not found. Please connect your GitHub account.`);
          return of([]);
        }
        const headers = {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        };
        const userRepos$: Observable<Repository[]> = this.http.get<GithubRepo[]>('https://api.github.com/user/repos?per_page=100&sort=updated&type=all', { headers }).pipe(
          map((repos: GithubRepo[]) => this.transformGitHubRepos(repos)),
          catchError((error: Error) => {
            this.toastService.error($localize`:@@FAILED_TO_LOAD_USER_REPOS:Failed to load user repositories. Please check your token permissions.`);
            return of([]);
          })
        );
        const orgs$ = this.http.get<GithubOrg[]>('https://api.github.com/user/orgs', { headers }).pipe(
          switchMap((orgs: GithubOrg[]) => {
            const orgRepos$: Observable<Repository[]>[] = orgs.map((org: GithubOrg) => {
              return this.http.get<GithubRepo[]>(`https://api.github.com/orgs/${org.login}/repos?per_page=100&sort=updated`, { headers }).pipe(
                map((repos: GithubRepo[]) => this.transformGitHubRepos(repos)),
                catchError((error: Error) => {
                  this.toastService.error($localize`:@@FAILED_TO_LOAD_ORG_REPOS:Failed to load repositories for organization ${org.login}. Please check your token permissions.`);
                  return of([]);
                })
              )
            });
            return forkJoin([userRepos$, ...orgRepos$]);
          }),
          map((results: Repository[][]) => results.flat()),
          map((repositories: Repository[]) => {
            return Array.from(new Map(repositories.map(repo => [`${repo.namespace}/${repo.name}`, repo])).values());
          }),
          catchError((error: Error) => {
            this.toastService.error($localize`:@@FAILED_TO_LOAD_ORGS:Failed to load organizations. Please check your token permissions.`);
            return userRepos$; // En cas d'erreur avec les orgs, retourner au moins les dépôts personnels
          })
        );
        return orgs$;
      })
    );
  }

  transformGitHubRepos(repos: GithubRepo[]): Repository[] {
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
}

interface GithubOrg {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string | null;
}

interface GithubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  },
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: string | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  }
}