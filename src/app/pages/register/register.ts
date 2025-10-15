import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SiteService } from '../site.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  hide = true;
  public tempoRestante: number = 5;
  public formCadastro!: FormGroup;


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
    console.log('cadastro');
    const formCadastro = this.formCadastro.getRawValue();

    if (this.formCadastro.valid) {
      this.siteService.signUp({
        nome: formCadastro.nome,
        email: formCadastro.email,
        senha: formCadastro.senha,
      }).subscribe({
        error: error => {
          console.log('erro: ', error)
        },
        next: (rs: any) => {
          console.log('rs: ', rs)
          const interval = setInterval(() => {
            this.tempoRestante--;

            if (this.tempoRestante <= 0) {
              clearInterval(interval);
              this.router.navigate(['/home']);
            }
          }, 1000);
        }
      })
      console.log('formCadastro: ', formCadastro)
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
