import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GitProviderService } from '../services/git-provider.service';
import { map, switchMap, of, take } from 'rxjs';

export const AuthRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const gitProviderService = inject(GitProviderService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/']);
        return of(false);
      }
      return gitProviderService.hasConfiguredProvider$;
    }),
    map(hasProvider => {
      if (!hasProvider) {
        router.navigate(['/git-providers']);
        return false;
      }
      return true;
    })
  );
};