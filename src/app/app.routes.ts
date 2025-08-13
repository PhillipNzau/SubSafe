import { Routes } from '@angular/router';
import { Auth } from './auth/auth';

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
    // canActivate: [() => inject(AuthService).isLoggedIn],
  },
  {
    path: '**',
    redirectTo: 'credentials',
  },
];
