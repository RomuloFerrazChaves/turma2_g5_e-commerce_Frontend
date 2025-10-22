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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  public formLogin!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formInitLogin();
    this.getMe();
  }

  formInitLogin() {
    this.formLogin = this.formBuilder.group({
      nome: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      criado: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    });
  }

  getMe() {
    this.siteService.getMe().subscribe((res: any) => {
      this.formLogin.patchValue({
        nome: res.nome,
        email: res.email,
        criado: new Date(res.criadoEm).toLocaleDateString(),
      });
    });
  }
}
