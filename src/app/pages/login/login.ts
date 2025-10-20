import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SiteService } from '../site.service';





@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
  providers: [SiteService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  hide = true;
  public formLogin!: FormGroup;


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
      this.siteService.signIn({
        email: formLogin.email,
        senha: formLogin.senha,
      }).subscribe({
        error: error => {
          console.log('erro: ', error)
        },
        next: (rs: any) => {
          console.log('rs: ', rs)
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
