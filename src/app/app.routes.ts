import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
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
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'git-providers',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/git-providers/git-providers.component').then(m => m.GitProvidersComponent)
  },
  {
    path: 'repositories/github',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/repositories/github-repositories.component').then(m => m.GithubRepositoriesComponent)
  },
  {
    path: 'repositories/gitlab',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/repositories/gitlab-repositories.component').then(m => m.GitlabRepositoriesComponent)
  },
  {
    path: 'repositories/bitbucket',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/repositories/bitbucket-repositories.component').then(m => m.BitbucketRepositoriesComponent)
  },
  {
    path: 'stripe-test',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/stripe-test/stripe-test.component').then(m => m.StripeTestComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];