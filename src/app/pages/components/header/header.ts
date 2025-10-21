import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  constructor (
    private router: Router,
  ) {}

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  redirectProfile() {
    const user = sessionStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    this.router.navigateByUrl(`/profile-page/${userId}`);
  }

  redirectLogin() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    this.router.navigateByUrl('/login');
  }
}
