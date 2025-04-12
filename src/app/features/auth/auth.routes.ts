import { Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';

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
    path: '**',
    component: NotFoundComponent
  }
]; 