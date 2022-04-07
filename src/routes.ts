import { RouteDefinition } from 'solid-app-router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./pages/Home')),
  },
  {
    path: '/projects',
    component: lazy(() => import('./pages/Projects')),
  },
  {
    path: '/contact',
    component: lazy(() => import('./pages/Contact')),
  },
  {
    path: '/playground',
    component: lazy(() => import('./pages/Playground')),
  },
  // {
  //   path: '/users/:id',
  //   component: lazy(() => import('./pages/users/[id].js')),
  //   children: [
  //     {path: '/', component: lazy(() => import('./pages/users/[id]/index.js'))},
  //     {path: '/settings', component: lazy(() => import('./pages/users/[id]/settings.js'))},
  //     {path: '*all', component: lazy(() => import('./pages/users/[id]/[...all].js'))},
  //   ],
  // },
];
