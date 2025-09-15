import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlDev } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(private http: HttpClient,) { }


  getMe() {
    return this.http.get(`${urlDev}/me`);
  }

}
