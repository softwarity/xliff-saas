import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import { ToastService } from "../../../../core/services/toast.service";
import { TokenService } from "../../../../core/services/token.service";
import { Repository } from "../../../../shared/models/repository.model";

@Injectable()
export class BitbucketService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private toastService = inject(ToastService);

  getBranches(repository: Repository): Observable<string[]> {
    return this.tokenService.getToken('bitbucket').pipe(
      switchMap((token: string | null) => {
        if (!token) {
          this.toastService.error($localize`:@@BITBUCKET_TOKEN_NOT_FOUND:Bitbucket token not found. Please connect your Bitbucket account.`);
          return of([]);
        }
        const headers = {
          'Authorization': `Basic ${btoa(token)}`,
          'Accept': 'application/json'
        }
        return this.http.get<Page<BitbucketBranch>>(`${repository.url}/refs/branches`, { headers }).pipe(
          map((data: Page<BitbucketBranch>) => {
            return data.values.map((branch: BitbucketBranch) => branch.name);
          }),
          catchError((error: Error) => {
            this.toastService.error($localize`:@@FAILED_TO_LOAD_BRANCHES:Failed to load branches. Please check your token permissions.`);
            return of([]);
          })
        );
      })
    );
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