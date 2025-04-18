import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { delay, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    delay(100), // Attendre 100ms pour laisser le temps à Supabase de s'initialiser
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/auth/login']);
    })
  );
};