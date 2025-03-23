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
    path: 'git-providers',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/git-providers/git-providers.component').then(m => m.GitProvidersComponent)
  },
  {
    path: 'repositories/:provider',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/repositories/repositories.component').then(m => m.RepositoriesComponent)
  },
  {
    path: 'stripe-test',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/stripe-test/stripe-test.component').then(m => m.StripeTestComponent)
  }
];