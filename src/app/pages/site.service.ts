import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlDev } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SiteService {

  constructor(private http: HttpClient,) { }


  signUp(user: any) {
    return this.http.post(`${urlDev}/auth/register`, user);
  }

  signIn(user: any) {
    return this.http.post(`${urlDev}/auth/login`, user);
  }
}
