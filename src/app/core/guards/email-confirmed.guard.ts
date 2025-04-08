import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const emailConfirmedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isEmailConfirmed()) {
    return true;
  }
  const email = authService.getCurrentUserEmail();
  if (email) {
    return router.createUrlTree(['/auth/email-confirmation'], { 
      queryParams: { email } 
    });
  }
  return router.createUrlTree(['/auth/login']);
}; 