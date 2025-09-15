import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";

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

  public books: any[] = [
      { Title: 'Ficção', Author: 'Autor 1', Description: 'Descrição do Livro' },
      { Title: 'Não-ficção', Author: 'Autor 2', Description: 'Descrição do Livro' },
      { Title: 'Fantasia', Author: 'Autor 3', Description: 'Descrição do Livro' },
      { Title: 'Romance', Author: 'Autor 4', Description: 'Descrição do Livro' },
      { Title: 'Mistério', Author: 'Autor 5', Description: 'Descrição do Livro' },
      { Title: 'Terror', Author: 'Autor 6', Description: 'Descrição do Livro' },
      { Title: 'Aventura', Author: 'Autor 7', Description: 'Descrição do Livro' },

      { Title: 'Ficção', Author: 'Autor 1', Description: 'Descrição do Livro' },
      { Title: 'Não-ficção', Author: 'Autor 2', Description: 'Descrição do Livro' },
      { Title: 'Fantasia', Author: 'Autor 3', Description: 'Descrição do Livro' },
      { Title: 'Romance', Author: 'Autor 4', Description: 'Descrição do Livro' },
      { Title: 'Mistério', Author: 'Autor 5', Description: 'Descrição do Livro' },
  ];

  constructor(
    private router: Router,
  ) {}


  RedirectToBookPage() {
      this.router.navigateByUrl('/book-page');
  }
}
