import { Route } from '@angular/router';
import { Dashboard } from './dashboard';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'credentials',
    pathMatch: 'full',
  },

  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: 'credentials',
        // canActivate: [permissionGuard],
        // data: { permission: 'device_view' },
        loadComponent: () =>
          import('./credentials/credentials').then((m) => m.Credentials),
      },
      {
        path: 'credentials/:id',
        loadComponent: () =>
          import(
            './credentials/components/credentials-details/credentials-details'
          ).then((m) => m.CredentialsDetails),
      },
      {
        path: 'subscriptions',
        // canActivate: [permissionGuard],
        // data: { permission: 'device_view' },
        loadComponent: () =>
          import('./subscriptions/subscriptions').then((m) => m.Subscriptions),
      },
      {
        path: 'subscriptions/:id',
        loadComponent: () =>
          import(
            './subscriptions/components/subscriptions-details/subscriptions-details'
          ).then((m) => m.SubscriptionsDetails),
      },
      {
        path: 'settings',
        // canActivate: [permissionGuard],
        // data: { permission: 'device_view' },
        loadComponent: () =>
          import('./settings/settings').then((m) => m.Settings),
      },
      {
        path: 'analytics',
        // canActivate: [permissionGuard],
        // data: { permission: 'device_view' },
        loadComponent: () =>
          import('./analytics/analytics').then((m) => m.Analytics),
      },
      {
        path: '**',
        redirectTo: 'credentials',
      },
    ],
  },
];
