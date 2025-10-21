import { SiteService } from './../site.service';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {

  public generos: any[] = [
      { Nome: 'Ficção', Imagem: '../../../assets/icons/fiction.svg' },
      { Nome: 'Poesia', Imagem: '../../../assets/icons/poetry.svg' },
      { Nome: 'Fantasia', Imagem: '../../../assets/icons/fantasy.svg' },
      { Nome: 'Romance', Imagem: '../../../assets/icons/romance.svg' },
      { Nome: 'Mistério', Imagem: '../../../assets/icons/mistery.svg' },
      { Nome: 'Terror', Imagem: '../../../assets/icons/terror.svg' },
      { Nome: 'Aventura', Imagem: '../../../assets/icons/adventure.svg' },
      { Nome: 'Biografia', Imagem: '../../../assets/icons/biography.svg' },
      { Nome: 'Comédia', Imagem: '../../../assets/icons/comedy.svg' }
  ];

  public books: any[] = [];

  constructor(
    private router: Router,
    private SiteService: SiteService,
  ) {}

  ngOnInit():void {
    this.PopulaAnuncio();
  }


  PopulaAnuncio() {
     this.SiteService.getAnuncios().subscribe({
        error: error => {
          console.log('erro: ', error)
        },
        next: (rs: any) => {
          this.books = rs;
        }
      })
  }

  RedirectToBookPage(id: string) {
      this.router.navigate([`/book-page/${id}`]);
  }
}
