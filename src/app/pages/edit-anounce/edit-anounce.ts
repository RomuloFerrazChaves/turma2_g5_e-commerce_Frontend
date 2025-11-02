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
import { LoadingDirective } from '../../shared/loading.directive';


@Component({
  selector: 'app-edit-anounce',
  imports: [
    MatChipsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingDirective,
  ],
  templateUrl: './edit-anounce.html',
  styleUrl: './edit-anounce.scss',
})
export class EditAnounce {
  public anuncio: any;
  public comments: any[] = [];
  public formAnuncio!: FormGroup;
  public userId: string | null = null;
  public titulo: any;
  public autor: any;
  public editora: any;
  public isbn: any;
  public descricao: any;
  public condicao: any;
  public generos: any;
  public preco: any;
  public tipo: any;
  public ano: any;
  public ativo: boolean = true;
  public editarAtivo: boolean = false;
  public isEditingAnuncio: boolean = false;
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
    this.formInitComment();
  }

  formInitComment() {
    this.formAnuncio = this.formBuilder.group({
      titulo: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      autor: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      editora: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      isbn: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      descricao: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      condicao: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      generos: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      preco: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      ano: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      tipo: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    });
  }

  populaAnuncio(AnuncioId: string) {
    this.SiteService.getAnuncioById(AnuncioId).subscribe({
      error: (error) => {
        console.log('erro: ', error);
      },
      next: (rs: any) => {
        console.log('anuncio: ', rs);
        if((this.userId != null && rs.usuarioId !== null) && (this.userId != rs.usuarioId)) {
            alert('Você não tem permissão para editar este anúncio.');
            this.Router.navigateByUrl('/home');
        } else {
          this.anuncio = rs;
          this.titulo = rs.titulo;
          this.autor = rs.autor;
          this.editora = rs.editora;
          this.descricao = rs.descricao;
          this.condicao = rs.condicao;
          this.generos = rs.genero;
          this.isbn = rs.isbn;
          this.preco = rs.preco;
          this.tipo = rs.tipo;
          this.ano = rs.ano;
          this.ativo = rs.ativo;
          this.formAnuncio.patchValue({
          titulo: this.titulo,
          autor: this.autor,
          editora: this.editora,
          descricao: this.descricao,
          condicao: this.condicao,
          generos: this.generos,
          preco: this.preco,
          isbn: this.isbn,
          tipo: this.tipo,
          ano: this.ano,
        });
        }
      },
    });
  }

  editaAnuncio() {
    const AnuncioId = this.activatedRoute.snapshot.params['id'];
    const anuncioData = {
      titulo: this.formAnuncio.get('titulo')?.value,
      autor: this.formAnuncio.get('autor')?.value,
      editora: this.formAnuncio.get('editora')?.value,
      descricao: this.formAnuncio.get('descricao')?.value,
      condicao: this.formAnuncio.get('condicao')?.value,
      genero: this.formAnuncio.get('generos')?.value,
      preco: this.formAnuncio.get('preco')?.value,
      isbn: this.formAnuncio.get('isbn')?.value,
      tipo: this.formAnuncio.get('tipo')?.value,
      ano: this.formAnuncio.get('ano')?.value,
      ativo: this.ativo,
    };
    this.isEditingAnuncio = true;
    this.SiteService.editaAnuncio(AnuncioId, anuncioData).subscribe({
        error: (error: any) => {
          alert('Erro ao editar anuncio. Chame um administrador.');
          this.isEditingAnuncio = false;
        },
        next: () => {
          alert('Anúncio editado com sucesso');
          this.populaAnuncio(AnuncioId);
          this.isEditingAnuncio = false;
        }
      });
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
          alert('Erro ao deletar anuncio. Chame um administrador.');
          this.isDeletingAnuncio = false;
        },
      });
    }
  }

  redirectEditAnouncement(id: string) {
    this.Router.navigate([`/edit-anounce/${id}`]);
  }

  ativarEditar() {
    if (this.formAnuncio.get('titulo')?.value !== this.titulo ||
    this.formAnuncio.get('autor')?.value !== this.autor ||
    this.formAnuncio.get('editora')?.value !== this.editora ||this.formAnuncio.get('descricao')?.value !== this.descricao ||
    this.formAnuncio.get('condicao')?.value !== this.condicao || this.formAnuncio.get('preco')?.value !== this.preco || this.formAnuncio.get('isbn')?.value !== this.isbn || this.formAnuncio.get('tipo')?.value !== this.tipo || this.formAnuncio.get('ativo')?.value !== this.ativo || this.formAnuncio.get('ano')?.value !== this.ano) {

      this.editarAtivo = true;
    } else {
      this.editarAtivo = false;
    }
  }
}
