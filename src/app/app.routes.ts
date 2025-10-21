import { Routes } from '@angular/router';
import { Home } from '../app/pages/home/home';
import { BookPage } from '../app/pages/book-page/book-page';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ProfilePage } from './pages/profile-page/profile-page';

export const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path:'home',
    component: Home,
  },
  {
    path:'login',
    component: Login,
  },
  {
    path:'register',
    component: Register,
  },
  {
    path:'book-page/:id',
    component: BookPage,
  },
  {
    path:'profile-page/:userId',
    component: ProfilePage,
  }
];
