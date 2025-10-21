import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './pages/components/header/header';
import { Footer } from './pages/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']  // Corrigido de styleUrl para styleUrls
})
export class App {
  protected readonly title = signal('arq-sistemas-distribuidos');

  public showHeaderFooter = true;

  constructor(private router: Router) {
    // Escuta as mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hiddenRoutes = ['/login', '/register']; // Rotas sem header/footer
        this.showHeaderFooter = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}
