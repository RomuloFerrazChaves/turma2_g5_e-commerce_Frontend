import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from "../components/header/header";
import { MatChipsModule } from '@angular/material/chips';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-book-page',
  imports: [Header, MatChipsModule, CommonModule],
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPage {
   public generos: any[] = [
    { Nome: 'Ficção' },
    { Nome: 'Não-ficção' },
    { Nome: 'Fantasia' },
    { Nome: 'Romance' },
    { Nome: 'Mistério' },
    { Nome: 'Terror' },
    { Nome: 'Aventura' },
    { Nome: 'Biografia' },
    { Nome: 'Comédia' }
  ];
}
