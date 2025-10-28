import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SiteService } from '../site.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingDirective } from '../../shared/loading.directive';

@Component({
  selector: 'app-profile-page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingDirective,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  public formLogin!: FormGroup;
  public editarAtivo: boolean = false;
  public nameForm: string = '';
  public emailForm: string = '';
  public books: any[] = [];
  public isDeletingMe: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formInitLogin();
    this.waitForTokenAndGetMe();
  }

  formInitLogin() {
    this.formLogin = this.formBuilder.group({
      nome: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      email: new FormControl({ value: '', disabled: true }),
      criado: new FormControl({ value: '', disabled: true }),
    });
  }

  waitForTokenAndGetMe() {
    // Protege o acesso quando estiver no SSR
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return;
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      this.getMe();
    } else {
      const check = setInterval(() => {
        const tk = sessionStorage.getItem('token');
        if (tk) {
          clearInterval(check);
          this.getMe();
        }
      }, 200);
    }
  }

  getMe() {
    this.siteService.getMe().subscribe({
      error: (error) => {
        console.log('erro: ', error);
      },
      next: (rs: any) => {
        this.nameForm = rs.nome;
        this.emailForm = rs.email;
        this.formLogin.patchValue({
          nome: this.nameForm,
          email: this.emailForm,
          criado: new Date(rs.criadoEm).toLocaleDateString(),
        });
        this.getAnuncioUser(rs.id);
      },
    });
  }

  ativarEditar() {
    if (
      this.formLogin.get('nome')?.value !== this.nameForm ||
      this.formLogin.get('email')?.value !== this.emailForm
    ) {
      this.editarAtivo = true;
    } else {
      this.editarAtivo = false;
    }
  }

  getAnuncioUser(userId: string) {
    this.siteService.getAnunciosByUser(userId).subscribe({
      error: (error: any) => {
        console.log('erro: ', error);
      },
      next: (rs: any) => {
        this.books = rs;
      },
    });
  }

  editMe() {
    const formProfile = this.formLogin.getRawValue();

    if (this.formLogin.valid) {
      this.siteService.editMe(formProfile.nome).subscribe({
        error: (error: any) => {
          console.log('erro: ', error);
        },
        next: (rs: any) => {
          this.getMe();
          this.editarAtivo = false;
        },
      });
    }
  }

  deleteMe() {
    if (confirm('Tem certeza que deseja deletar este comentário?')) {
      this.isDeletingMe = true;
      this.siteService.deleteMe().subscribe({
        error: (error: any) => {
          console.log('erro: ', error);
          this.isDeletingMe = false;
        },
        next: (rs: any) => {
          alert('Usuário deletado com sucesso');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          this.router.navigateByUrl('/login');
          this.isDeletingMe = false;
        },
      });
    }
  }

  RedirectToBookPage(id: string) {
    this.router.navigate([`/book-page/${id}`]);
  }
}
