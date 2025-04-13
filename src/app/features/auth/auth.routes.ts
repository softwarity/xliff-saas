import { Routes } from '@angular/router';
import { NotFoundComponent } from '../../pages/not-found.component';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { noAuthGuard } from '../../core/guards/no-auth.guard';
import { EmailSentComponent } from './email-sent.component';
import { UpdatePasswordComponent } from './update-password.component';

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
    path: 'email-sent',
    component: EmailSentComponent
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
]; 