import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { inject } from '@angular/core';
import { Authservice } from './auth/shared/services/authservice';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth,
  },
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(
        (mod) => mod.DASHBOARD_ROUTES
      ),
    canActivate: [() => inject(Authservice).isLoggedIn],
  },
  {
    path: '**',
    redirectTo: 'credentials',
  },
];
