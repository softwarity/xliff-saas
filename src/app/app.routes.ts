import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { emailConfirmedGuard } from './core/guards/email-confirmed.guard';
import { DOCUMENTATION_ROUTES } from './pages/documentation/documentation.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./pages/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
  },
  {
    path: 'documentation',
    loadComponent: () => import('./pages/documentation/documentation.component').then(m => m.DocumentationComponent),
    loadChildren: () => import('./pages/documentation/documentation.routes').then(m => DOCUMENTATION_ROUTES)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing.component').then(m => m.PricingComponent)
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
    path: 'support',
    canActivate: [authGuard, emailConfirmedGuard],
    loadComponent: () => import('./features/support/support.component').then(m => m.SupportComponent)
  },
  {
    path: 'support/create',
    canActivate: [authGuard, emailConfirmedGuard],
    loadComponent: () => import('./features/support/create-issue.component').then(m => m.CreateIssueComponent)
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
    path: 'contact',
    loadComponent: () => import('./features/support/contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'support/:id',
    loadComponent: () => import('./features/support/issue-detail.component').then(c => c.IssueDetailComponent),
    canActivate: [authGuard],
    data: { title: $localize`:@@ISSUE_DETAILS:Issue Details` }
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.component').then(m => m.NotFoundComponent)
  }
];