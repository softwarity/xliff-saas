import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import { ToastService } from "../../../../core/services/toast.service";
import { TokenService } from "../../../../core/services/token.service";
import { Repository } from "../../../../shared/models/repository.model";

@Injectable()
export class GithubService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private toastService = inject(ToastService);

  getBranches(repository: Repository): Observable<string[]> {
    return this.tokenService.getToken('github').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          this.toastService.error($localize`:@@GITHUB_TOKEN_NOT_FOUND:GitHub token not found. Please connect your GitHub account.`);
          return of([]);
        }
        const headers = {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
        return this.http.get<GithubBranch[]>(`${repository.url}/branches`, { headers }).pipe(
          map((data: GithubBranch[]) => data.map((branch: GithubBranch) => branch.name)),
          catchError((error: Error) => {
            this.toastService.error($localize`:@@FAILED_TO_LOAD_BRANCHES:Failed to load branches. Please check your token permissions.`);
            return of([]);
          })
        ); 
      })
    );
  }
}

interface GithubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  },
  protected: boolean;
}

