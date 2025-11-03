import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingDirective } from '../../shared/loading.directive';
import { Router } from '@angular/router';
import { SiteService } from '../site.service';





@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, LoadingDirective],
  providers: [SiteService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  hide = true;
  public formLogin!: FormGroup;
  public isLoggingIn: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private siteService: SiteService,
  ) {}

  ngOnInit(): void {
    this.formInitLogin();
  }

  formInitLogin() {
    this.formLogin = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      senha: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    })
  }

  login () {
    const formLogin = this.formLogin.getRawValue();

    if (this.formLogin.valid) {
      this.isLoggingIn = true;
      this.siteService.signIn({
        email: formLogin.email,
        senha: formLogin.senha,
      }).subscribe({
        error: error => {
          alert('Erro ao efetuar login. Chame um administrador.');
          this.isLoggingIn = false;
        },
        next: (rs: any) => {
          sessionStorage.setItem('user', JSON.stringify(rs.userWithoutPassword));
          sessionStorage.setItem('token', rs.token);
          this.isLoggingIn = false;
          this.router.navigateByUrl('/home');
        }
      })
    } else {
      this.formLogin.markAllAsTouched()
      console.log('erro')
    }
  }


  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  redirectRegister() {
    this.router.navigateByUrl('/register');
  }
}
