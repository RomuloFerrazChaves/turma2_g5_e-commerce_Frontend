import { SiteService } from './../site.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import {CommonModule} from '@angular/common';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-page',
  imports: [MatChipsModule, CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, Header, Footer],
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPage {
  public anuncio: any;
  public comments: any[] = [];
  public commentForm!: FormGroup;


  constructor(
    private SiteService: SiteService,
    private Router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const AnuncioId = this.activatedRoute.snapshot.params['id'];
    this.populaAnuncio(AnuncioId);
    this.populaComments(AnuncioId);
    this.formInitComment();
  }

  formInitComment() {
    this.commentForm = this.formBuilder.group({
      texto: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    })
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

  addComment() {
    if (this.commentForm.valid) {
      const user = sessionStorage.getItem('user');
      const AnuncioId = this.activatedRoute.snapshot.params['id'];
      const userId = user ? JSON.parse(user).id : null;
      const comentario = this.commentForm.getRawValue();
      this.SiteService.addComment({
        texto: comentario.texto,
        anuncioId: AnuncioId,
        usuarioIdStr: userId.toString(),
      }).subscribe({
        error: error => {
          console.log('erro: ', error)
        },
        next: (rs: any) => {
          this.populaComments(AnuncioId)
        }
      })
    } else {
      this.commentForm.markAllAsTouched()
      console.log('erro')
    }
  }
}
