import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ProviderType } from '../../shared/models/provider-type';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private auth = inject(AuthService);

  storeToken(provider: ProviderType, token: string): Observable<boolean> {
    return this.auth.saveGitToken(provider, token);
  }

  getToken(provider: ProviderType): Observable<string | null> {
    return this.auth.getGitToken(provider);
  }

  removeToken(provider: ProviderType): Observable<boolean> {
    return this.auth.removeGitToken(provider);
  }
}