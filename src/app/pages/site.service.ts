import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlDev } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private http: HttpClient) {}

  signUp(user: any) {
    return this.http.post(`${urlDev}/auth/register`, user);
  }

  signIn(user: any) {
    return this.http.post(`${urlDev}/auth/login`, user);
  }

  getAnuncios() {
    return this.http.get(`${urlDev}/anuncios/getAllAnuncios`);
  }

  getAnuncioById(AnuncioId: string) {
    return this.http.get(`${urlDev}/anuncios/getAnuncioById/${AnuncioId}`);
  }

  populaComments(AnuncioId: string) {
    return this.http.get(`${urlDev}/comentarios/listByAnuncio/${AnuncioId}`);
  }

  addComment(comment: any) {
    return this.http.post(`${urlDev}/comentarios/createComentario`, comment);
  }

  deleteComment(CommentId: string) {
    return this.http.delete(`http://localhost:3000/comments/${CommentId}`);
  }

  getMe() {
    return this.http.get(`${urlDev}/users/me`);
  }
}
