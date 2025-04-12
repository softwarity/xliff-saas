import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { emailConfirmedGuard } from './core/guards/email-confirmed.guard';
import { TermsComponent } from './features/legal/terms.component';
import { PrivacyComponent } from './features/legal/privacy.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./features/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
  },
  {
    path: 'documentation',
    loadComponent: () => import('./features/documentation/documentation.component').then(m => m.DocumentationComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, emailConfirmedGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard, emailConfirmedGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'git-providers',
    canActivate: [authGuard, emailConfirmedGuard],
    loadComponent: () => import('./features/git-providers/git-providers.component').then(m => m.GitProvidersComponent)
  },
  {
    path: 'repositories/github',
    canActivate: [authGuard],
    loadComponent: () => import('./features/repositories/github-repositories.component').then(m => m.GithubRepositoriesComponent)
  },
  {
    path: 'repositories/gitlab',
    canActivate: [authGuard],
    loadComponent: () => import('./features/repositories/gitlab-repositories.component').then(m => m.GitlabRepositoriesComponent)
  },
  {
    path: 'repositories/bitbucket',
    canActivate: [authGuard],
    loadComponent: () => import('./features/repositories/bitbucket-repositories.component').then(m => m.BitbucketRepositoriesComponent)
  },
  {
    path: 'stripe-test',
    canActivate: [authGuard],
    loadComponent: () => import('./features/stripe-test/stripe-test.component').then(m => m.StripeTestComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./pages/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];