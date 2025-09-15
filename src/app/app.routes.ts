import { Routes } from '@angular/router';
import { Home } from '../app/pages/home/home';
import { BookPage } from '../app/pages/book-page/book-page';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    redirectTo: 'home',
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
    path:'book-page',
    component: BookPage,
  }
];
