import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      // No SSR (server) window/sessionStorage não existe — proteja o acesso
      if (typeof window === 'undefined' || !window.sessionStorage) {
        return next.handle(req);
      }

      const token = sessionStorage.getItem('token');

        let authReq = req;
        if (token) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }

      return next.handle(authReq);
    } catch (e) {
      // Em caso de qualquer erro ao acessar sessionStorage, siga sem header
      return next.handle(req);
    }
  }
}
