import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnuncioService } from '../../services/anuncio.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-anuncio-page',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-anuncio-page.html',
  styleUrl: './create-anuncio-page.scss'
})
export class CreateAnuncioPage {
  anuncio = {
    titulo: '',
    autor: '',
    descricao: '',
    isbn: '',
    editora: '',
    ano: null,
    genero: '',
    preco: null,
    condicao: '',
    tipo: ''
  };

  constructor(private anuncioService: AnuncioService, private router: Router) { }

  onSubmit() {
    this.anuncioService.createAnuncio(this.anuncio).subscribe({
      next: (res) => {
        alert('Anúncio criado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar o anúncio.');
      }
    });
  }
}
