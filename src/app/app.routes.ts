import { Routes } from '@angular/router';
import { Users } from './components/users/users';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
    },
    {
        path: 'users',
        component: Users
    },
    {
        path: 'user-view/:id',
        loadComponent: () => import('./components/user-view/user-view').then(m => m.UserView)
    }
];
