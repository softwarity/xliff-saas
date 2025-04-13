import { Routes } from '@angular/router';

export const DOCUMENTATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'usage',
    pathMatch: 'full'
  },
  {
    path: 'usage',
    loadComponent: () => import('./usage.component').then(m => m.UsageComponent)
  },
  {
    path: 'custom',
    loadComponent: () => import('./custom.component').then(m => m.CustomComponent)
  },
  {
    path: 'setup',
    loadComponent: () => import('./setup.component').then(m => m.SetupComponent)
  }
]; 