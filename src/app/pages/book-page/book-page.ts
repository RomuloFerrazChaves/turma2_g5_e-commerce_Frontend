import { SiteService } from './../site.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from "../components/header/header";
import { MatChipsModule } from '@angular/material/chips';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-page',
  imports: [Header, MatChipsModule, CommonModule],
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPage {
  public anuncio: any;
  public comments: any[] = [];

  constructor(
    private SiteService: SiteService,
    private Router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const AnuncioId = this.activatedRoute.snapshot.params['id'];
    this.populaAnuncio(AnuncioId);
    this.populaComments(AnuncioId);
  }


  populaAnuncio(AnuncioId: string) {
    this.SiteService.getAnuncioById(AnuncioId).subscribe({
        error: error => {
          console.log('erro: ', error)
        },
        next: (rs: any) => {
          console.log('rs: ', rs)
          this.anuncio = rs;
        }
      })
  }

  populaComments(AnuncioId: string) {
    this.SiteService.populaComments(AnuncioId).subscribe({
        error: error => {
          console.log('erro: ', error)
        },
        next: (rs: any) => {
          console.log('rs: ', rs)
          this.comments = rs;
        }
      })
  }
}
