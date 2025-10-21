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
    this.router.navigateByUrl(`/profile-page`);
  }

  redirectLogin() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    this.router.navigateByUrl('/login');
  }
}
