import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingDirective } from '../../shared/loading.directive';
import { Router } from '@angular/router';
import { SiteService } from '../site.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, HttpClientModule, LoadingDirective],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  hide = true;
  public tempoRestante: number = 5;
  public formCadastro!: FormGroup;
  public isRegistering: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private siteService: SiteService,
  ) {}

  ngOnInit(): void {
    this.formInitCadastro();
  }

  formInitCadastro() {
    this.formCadastro = this.formBuilder.group({
      nome: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      senha: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
  }

  cadastro() {
    const formCadastro = this.formCadastro.getRawValue();

    if (this.formCadastro.valid) {
      this.isRegistering = true;
      this.siteService.signUp({
        nome: formCadastro.nome,
        email: formCadastro.email,
        senha: formCadastro.senha,
      }).subscribe({
        error: error => {
          alert('Erro ao efetuar registro. Chame um administrador.');
          this.isRegistering = false;
        },
        next: (rs: any) => {
          sessionStorage.setItem('user', JSON.stringify(rs.userWithoutPassword));
          sessionStorage.setItem('token', rs.token);
          const interval = setInterval(() => {
            this.tempoRestante--;

            if (this.tempoRestante <= 0) {
              clearInterval(interval);
                this.isRegistering = false;
                this.router.navigate(['/home']);
            }
          }, 1000);
        }
      })
    } else {
      this.formCadastro.markAllAsTouched()
      console.log('erro')
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  redirectLogin() {
    this.router.navigateByUrl('/login');
  }
}
