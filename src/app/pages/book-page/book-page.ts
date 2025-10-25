import { SiteService } from './../site.service';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-book-page',
  imports: [
    MatChipsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
})
export class BookPage {
  public anuncio: any;
  public comments: any[] = [];
  public commentForm!: FormGroup;
  public userId: string | null = null;

  constructor(
    private SiteService: SiteService,
    private Router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const AnuncioId = this.activatedRoute.snapshot.params['id'];
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem('user');
      this.userId = user ? JSON.parse(user).id : null;
    }
    this.populaAnuncio(AnuncioId);
    this.populaComments(AnuncioId);
    this.formInitComment();
  }

  formInitComment() {
    this.commentForm = this.formBuilder.group({
      texto: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    });
  }

  populaAnuncio(AnuncioId: string) {
    this.SiteService.getAnuncioById(AnuncioId).subscribe({
      error: (error) => {
        console.log('erro: ', error);
      },
      next: (rs: any) => {
        console.log('anuncio: ', rs);
        this.anuncio = rs;
      },
    });
  }

  populaComments(AnuncioId: string) {
    this.SiteService.populaComments(AnuncioId).subscribe({
      error: (error) => {
        console.log('erro: ', error);
      },
      next: (rs: any) => {
        this.comments = rs;
      },
    });
  }

  addComment() {
    if (this.commentForm.valid) {
      const user = sessionStorage.getItem('user');
      const AnuncioId = this.activatedRoute.snapshot.params['id'];
      const userId = user ? JSON.parse(user).id : null;
      if (!userId) {
        console.log('Usuário não autenticado - comentário não será enviado');
        return;
      }
      const comentario = this.commentForm.getRawValue();
      this.SiteService.addComment({
        texto: comentario.texto,
        anuncioId: AnuncioId,
        usuarioIdStr: userId.toString(),
      }).subscribe({
        error: (error) => {
          console.log('erro: ', error);
        },
        next: (rs: any) => {
          this.commentForm.reset();
          this.populaComments(AnuncioId);
        },
      });
    } else {
      this.commentForm.markAllAsTouched();
      console.log('erro');
    }
  }

  deleteComment(CommentId: string) {
    const AnuncioId = this.activatedRoute.snapshot.params['id'];
    if (confirm('Tem certeza que deseja deletar este comentário?')) {
      this.SiteService.deleteComment(CommentId).subscribe({
        next: () => {
          console.log('Comentário deletado com sucesso');
          this.populaComments(AnuncioId);
        },
        error: (error) => {
          console.error('Erro ao deletar comentário:', error);
        },
      });
    }
  }

  deleteAnuncio(AnuncioId: string) {
    if (confirm('Tem certeza que deseja deletar este anúncio?')) {
      this.SiteService.deleteAnuncio(AnuncioId).subscribe({
        next: () => {
          alert('Anúncio deletado com sucesso');
          this.Router.navigateByUrl('/home');
        },
        error: (error) => {
          console.error('Erro ao deletar anúncio:', error);
        },
      });
    }
  }

  redirectEditAnouncement(AnuncioId: string) {
    this.Router.navigate([`/edit-anounce/${AnuncioId}`]);
  }
}
