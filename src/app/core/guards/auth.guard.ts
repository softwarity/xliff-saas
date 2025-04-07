import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getUser().pipe(
    map(user => {
      if (user) {
        return true;
      }
      // Stocker l'URL demandée pour redirection après login
      localStorage.setItem('gh-redirect', state.url);
      return router.createUrlTree(['/auth/login']);
    })
  );
};