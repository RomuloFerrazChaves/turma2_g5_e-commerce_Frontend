import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnuncioService {
    private apiUrl = 'http://localhost:3333/api/anuncios';

    constructor(private http: HttpClient) { }

    createAnuncio(anuncioData: any): Observable<any> {
        const token = sessionStorage.getItem('token'); // 👈 ou sessionStorage, conforme seu login salva

        if (!token) {
            throw new Error('Usuário não está logado ou token não encontrado.');
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 👈 envia o token
        });

        return this.http.post(this.apiUrl, anuncioData, {
            headers,
            withCredentials: true, // 👈 só se o backend precisar
        });
    }
}
