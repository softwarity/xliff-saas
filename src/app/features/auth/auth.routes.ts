import { Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    component: LoginComponent
  },
  {
    path: 'signup',
    canActivate: [noAuthGuard],
    component: SignupComponent
  },
  {
    path: 'email-confirmation',
    component: EmailConfirmationComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
]; 