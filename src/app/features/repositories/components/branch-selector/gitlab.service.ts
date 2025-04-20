import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import { TokenService } from "../../../../core/services/token.service";
import { ToastService } from "../../../../core/services/toast.service";
import { Repository } from "../../../../shared/models/repository.model";

@Injectable()
export class GitlabService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private toastService = inject(ToastService);

  getBranches(repository: Repository): Observable<string[]> {
    return this.tokenService.getToken('gitlab').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          this.toastService.error($localize`:@@GITLAB_TOKEN_NOT_FOUND:GitLab token not found. Please connect your GitLab account.`);
          return of([]);
        }
        const headers = {
          'Authorization': `Bearer ${token}`
        }
        return this.http.get<GitlabBranch[]>(`${repository.url}/repository/branches`, { headers }).pipe(
          map((data: GitlabBranch[]) => data.map((branch: GitlabBranch) => branch.name)),
          catchError((error: Error) => {
            this.toastService.error($localize`:@@FAILED_TO_LOAD_BRANCHES:Failed to load branches. Please check your token permissions.`);
            return of([]);
          })
        );
      })
    );
  }
}

interface GitlabBranch {
  name: string,
  commit: {
      id: string,
      short_id: string,
      created_at: string,
      parent_ids: string[],
      title: string,
      message: string,
      author_name: string,
      author_email: string,
      authored_date: string,
      committer_name: string,
      committer_email: string,
      committed_date: string,
      trailers: {},
      extended_trailers: {},
      web_url: string
  },
  merged: false,
  protected: false,
  developers_can_push: false,
  developers_can_merge: false,
  can_push: true,
  default: true,
  web_url: string
}

