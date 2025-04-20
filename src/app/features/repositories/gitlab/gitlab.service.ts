import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import { Repository } from "../../../shared/models/repository.model";
import { TokenService } from "../../../core/services/token.service";
import { ToastService } from "../../../core/services/toast.service";

@Injectable()
export class GitlabService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private toastService = inject(ToastService);

 getRepositories(): Observable<Repository[]> {
    return this.tokenService.getToken('gitlab').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          this.toastService.error($localize`:@@GITLAB_TOKEN_NOT_FOUND:GitLab token not found. Please connect your GitLab account.`);
          return of([]);
        }
        const headers = {
          'Authorization': `Bearer ${token}`
        }
        return this.http.get<GitlabRepository[]>('https://gitlab.com/api/v4/projects?owned=true&per_page=100&order_by=updated_at', { headers }).pipe(
          map((repos: GitlabRepository[]) => this.transformGitlabRepos(repos)),
          catchError((error: Error) => {
            this.toastService.error($localize`:@@FAILED_TO_LOAD_REPOSITORIES_TRY_AGAIN:Failed to load repositories. Please check your token permissions and try again.`);
            return of([]);
          })
        )
      })
    );
  }

  transformGitlabRepos(repos: GitlabRepository[]): Repository[] {
    return repos.map(repo => ({
      id: repo.id.toString(),
      provider: 'gitlab',
      name: repo.name,
      description: repo.description,
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
}

interface GitlabRepository {
  id: number;
  description: string | null;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  default_branch: string;
  tag_list: string[];
  topics: string[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  forks_count: number;
  avatar_url: string | null;
  star_count: number;
  last_activity_at: string;
  namespace: {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    parent_id: number | null;
    avatar_url: string | null;
    web_url: string;
  },
  container_registry_image_prefix: string;
  _links: {
    self: string;
    issues: string;
    merge_requests: string;
    repo_branches: string;
    labels: string;
    events: string;
    members: string;
    cluster_agents: string;
  },
  packages_enabled: boolean;
  empty_repo: boolean;
  archived: boolean;
  visibility: 'public' | 'private';
  resolve_outdated_diff_discussions: boolean;
  container_expiration_policy: {
    cadence: string;
    enabled: boolean;
    keep_n: number;
    older_than: string;
    name_regex: string;
    name_regex_keep: string | null;
    next_run_at: string;
  },
  repository_object_format: string;
  issues_enabled: boolean;
  merge_requests_enabled: boolean;
  wiki_enabled: boolean;
  jobs_enabled: boolean;
  snippets_enabled: boolean;
  container_registry_enabled: boolean;
  service_desk_enabled: boolean;
  service_desk_address: string;
  can_create_merge_request_in: boolean;
  issues_access_level: string;
  repository_access_level: string;
  merge_requests_access_level: string;
  forking_access_level: string;
  wiki_access_level: string;
  builds_access_level: string;
  snippets_access_level: string;
  pages_access_level: string;
  analytics_access_level: string;
  container_registry_access_level: string;
  security_and_compliance_access_level: string;
  releases_access_level: string;
  environments_access_level: string;
  feature_flags_access_level: string;
  infrastructure_access_level: string;
  monitor_access_level: string;
  model_experiments_access_level: string;
  model_registry_access_level: string;
  emails_disabled: boolean;
  emails_enabled: boolean;
  shared_runners_enabled: boolean;
  lfs_enabled: boolean;
  creator_id: number;
  import_url: string | null;
  import_type: string | null;
  import_status: string;
  open_issues_count: number;
  description_html: string;
  updated_at: string;
  ci_default_git_depth: number;
  ci_delete_pipelines_in_seconds: number | null;
  ci_forward_deployment_enabled: boolean;
  ci_forward_deployment_rollback_allowed: boolean;
  ci_job_token_scope_enabled: boolean;
  ci_separated_caches: boolean;
  ci_allow_fork_pipelines_to_run_in_parent_project: boolean;
  ci_id_token_sub_claim_components: string[];
  build_git_strategy: string;
  keep_latest_artifact: boolean;
  restrict_user_defined_variables: boolean;
  ci_pipeline_variables_minimum_override_role: string;
  runners_token: string | null;
  runner_token_expiration_interval: number | null;
  group_runners_enabled: boolean;
  auto_cancel_pending_pipelines: string;
  build_timeout: number;
  auto_devops_enabled: boolean;
  auto_devops_deploy_strategy: string;
  ci_push_repository_for_job_token_allowed: boolean;
  ci_config_path: string;
  public_jobs: boolean;
  shared_with_groups: string[];
  only_allow_merge_if_pipeline_succeeds: boolean;
  allow_merge_on_skipped_pipeline: boolean | null;
  request_access_enabled: boolean;
  only_allow_merge_if_all_discussions_are_resolved: boolean;
  remove_source_branch_after_merge: boolean;
  printing_merge_request_link_enabled: boolean;
  merge_method: string;
  squash_option: string;
  enforce_auth_checks_on_uploads: boolean;
  suggestion_commit_message: string | null;
  merge_commit_template: string | null;
  squash_commit_template: string | null;
  issue_branch_template: string | null;
  warn_about_potentially_unwanted_characters: boolean;
  autoclose_referenced_issues: boolean;
  max_artifacts_size: number | null;
  external_authorization_classification_label: string;
  requirements_enabled: boolean;
  requirements_access_level: string;
  security_and_compliance_enabled: boolean;
  compliance_frameworks: string[];
  permissions: {
    project_access: string | null;
    group_access: {
      access_level: number;
      notification_level: number;
    }
  }
}