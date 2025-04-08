import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { VerifyEmailComponent } from './verify-email.component';
import { NotFoundComponent } from '../not-found/not-found.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'email-confirmation',
    component: EmailConfirmationComponent
  },
  {
    path: 'verify',
    component: VerifyEmailComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
]; 