import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { PalestraApi, Palestra } from "../palestra";
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserData {
  id: number;
  email: string;
  nome: string;
  admin: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {

  palestras: Palestra[] = [];
  userData: UserData | null = null;
  inscricoesUsuario: Set<number> = new Set();
  palestraEmEdicao: number | null = null;
  formularioEdicao!: FormGroup;

  constructor(
    private authService: Auth,
    private router: Router,
    private palestraApi: PalestraApi,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.getUser();
    if (!this.userData) {
      this.router.navigateByUrl("/login");
      return;
    }
    this.carregarDados();
  }

  carregarDados(): void {
    const idUsuario = this.userData!.id;
    this.palestraApi.listarPalestra().subscribe({
      next: (dados) => {
        this.palestras = dados;
        this.cd.detectChanges();
      },
      error: (err) => console.log("Erro ao carregar dados", err),
    });
    this.http.get<number[]>(`http://localhost:3000/api/inscricoes/${idUsuario}`).subscribe({
      next: (ids) => {
        this.inscricoesUsuario = new Set(ids);
        this.cd.detectChanges();
      },
      error: (err) => console.log("Erro ao buscar inscrições", err),
    });
  }

  inscricao(idPalestra: number): void {
    const idUsuario = this.userData?.id;
    if (!idUsuario) return;
    this.http.post<any>("http://localhost:3000/api/inscricao", {
      idUsuario,
      idPalestra
    }).subscribe({
      next: (res) => {
        alert(res.message);
        this.carregarDados();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  excluirEvento(idPalestra: number): void {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    this.http.delete<any>(`http://localhost:3000/api/palestra/${idPalestra}`).subscribe({
      next: (res) => {
        alert(res.message);
        this.carregarDados();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  abrirEdicao(p: Palestra): void {
    this.palestraEmEdicao = p.id;
    this.formularioEdicao = new FormGroup({
      titulo: new FormControl(p.titulo, Validators.required),
      descricao: new FormControl(p.descricao, Validators.required),
      nomePalestrante: new FormControl(p.nomePalestrante, Validators.required),
      localEvento: new FormControl(p.localEvento, Validators.required),
      dataEvento: new FormControl(
        new Date(p.dataEvento).toISOString().slice(0, 16),
        Validators.required
      ),
    });
  }

  cancelarEdicao(): void {
    this.palestraEmEdicao = null;
  }

  salvarEdicao(idPalestra: number): void {
    if (!this.formularioEdicao.valid) return;
    this.http.put<any>(`http://localhost:3000/api/palestra/${idPalestra}`, this.formularioEdicao.value)
      .subscribe({
        next: (res) => {
          alert(res.message);
          this.palestraEmEdicao = null;
          this.carregarDados();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
  }

  cancelarInscricao(idPalestra: number): void {
    const idUsuario = this.userData?.id;
    if (!idUsuario) return;
    this.http.delete<any>("http://localhost:3000/api/inscricao", {
      body: { idUsuario, idPalestra }
    }).subscribe({
      next: (res) => {
        alert(res.message);
        this.carregarDados();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
