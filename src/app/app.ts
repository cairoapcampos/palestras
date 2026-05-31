import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Auth } from './auth';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface UserData {
  email: string;
  nome: string;
  admin: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('sistemaPalestras');
  userData: UserData | null = null;
  logado: boolean = false;
  constructor(private router: Router, private authService: Auth) { }
  ngOnInit(): void {
    this.logado = this.authService.isLoggedIn();
    this.userData = this.authService.getUser();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.logado = this.authService.isLoggedIn();
        this.userData = this.authService.getUser();
      });
  }
  logout(): void {
    this.authService.logout();
    this.logado = false;
    this.userData = null;
  }
}
