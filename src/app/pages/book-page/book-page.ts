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
import { LoadingDirective } from '../../shared/loading.directive';
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
    LoadingDirective,
  ],
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
})
export class BookPage {
  public anuncio: any;
  public comments: any[] = [];
  public commentForm!: FormGroup;
  public userId: string | null = null;
  public avaliacaoSelecionada: number | null = null;
  public avaliacaoMedia: number | null = null;
  public isAddingComment: boolean = false;
  public isDeletingCommentId: string | null = null;
  public isDeletingAnuncio: boolean = false;

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
    this.getAvaliacoes(AnuncioId);
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

  getAvaliacoes(AnuncioId: string) {
    // O subscribe() espera (rs: Object) => void, baseado no seu serviço.
    // Usamos 'any' para flexibilidade e fazemos o "cast" (conversão) dentro.
    this.SiteService.listByAnuncio(AnuncioId).subscribe({

      // 1. Mude 'rs: any[]' para 'rs: any' para satisfazer o TypeScript
      next: (rs: any) => {
        // 2. Crie uma nova variável 'avaliacoes' forçando a tipagem para array
        const avaliacoes = rs as any[];

        // 3. Use a nova variável 'avaliacoes' para os cálculos
        if (avaliacoes && avaliacoes.length > 0) {

          const total = avaliacoes.reduce((sum, item) => sum + item.avaliacao, 0);
          this.avaliacaoMedia = total / avaliacoes.length;

        } else {
          this.avaliacaoMedia = 0;
          console.log('Nenhuma avaliação encontrada.');
        }
      },
      error: (error: any) => {
        console.error('Erro ao buscar avaliações:', error);
      },
    });
  }

  addComment() {
    if (this.commentForm.valid) {
      const user = sessionStorage.getItem('user');
      const AnuncioId = this.activatedRoute.snapshot.params['id'];
      const userId = user ? JSON.parse(user).id : null;
      if (!userId) {
        return;
      }
      const comentario = this.commentForm.getRawValue();
      this.isAddingComment = true;
      this.SiteService.addComment({
        texto: comentario.texto,
        anuncioId: AnuncioId,
        usuarioIdStr: userId.toString(),
      }).subscribe({
        error: (error) => {
          console.log('erro: ', error);
          this.isAddingComment = false;
        },
        next: (rs: any) => {
          this.commentForm.reset();
          this.populaComments(AnuncioId);
          this.isAddingComment = false;
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
      this.isDeletingCommentId = CommentId;
      this.SiteService.deleteComment(CommentId).subscribe({
        next: () => {
          this.populaComments(AnuncioId);
          this.isDeletingCommentId = null;
        },
        error: (error) => {
          console.error('Erro ao deletar comentário:', error);
          this.isDeletingCommentId = null;
        },
      });
    }
  }

  deleteAnuncio(AnuncioId: string) {
    if (confirm('Tem certeza que deseja deletar este anúncio?')) {
      this.isDeletingAnuncio = true;
      this.SiteService.deleteAnuncio(AnuncioId).subscribe({
        next: () => {
          alert('Anúncio deletado com sucesso');
          this.Router.navigateByUrl('/home');
          this.isDeletingAnuncio = false;
        },
        error: (error) => {
          console.error('Erro ao deletar anúncio:', error);
          this.isDeletingAnuncio = false;
        },
      });
    }
  }

  redirectEditAnouncement(AnuncioId: string) {
    this.Router.navigate([`/edit-anounce/${AnuncioId}`]);
  }

  onRateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.avaliacaoSelecionada = Number(input.value);
    setTimeout(() => {
      const AnuncioId = this.activatedRoute.snapshot.params['id'];
      this.salvarAvaliacao(AnuncioId);
    }, 500);
  }

  salvarAvaliacao(anuncioId: number) {
    if (!this.avaliacaoSelecionada) return;
    const body: any = {
      avaliacao: this.avaliacaoSelecionada,
      comentario: '',
      anuncioId,
    };
    this.SiteService.salvarAvaliacao(body).subscribe({
      next: (response) => {
        location.reload();
      },
      error: (error) => {
        console.error('Erro ao salvar avaliação:', error);
      }
    });
  }
}
