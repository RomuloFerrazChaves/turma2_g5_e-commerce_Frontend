import { Routes } from '@angular/router';
import { Home } from '../app/pages/home/home';
import { BookPage } from '../app/pages/book-page/book-page';

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
    path:'book-page',
    component: BookPage,
  }
];
