import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from
  '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface respostaCadastro {
  message: string;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro {
  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }
  formularioCadastro = new FormGroup({
    email: new FormControl('', Validators.required),
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  mensagem: string = '';
  tipoMensagem: 'success' | 'danger' = 'success';

  onSubmit() {
    if (this.formularioCadastro.valid) {
      this.http
        .post<respostaCadastro>(
          'http://localhost:3000/api/cadastro',
          this.formularioCadastro.value
        )
        .subscribe({
          next: (res) => {
            this.tipoMensagem = 'success';
            this.mensagem = res.message;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err) => {
            this.tipoMensagem = 'danger';
            if (err?.status === 400) {
              this.mensagem = err?.error?.message || 'Email já cadastrado';
            } else {
              this.mensagem = err?.error?.message || 'Erro ao cadastrar';
            }
            this.cdr.detectChanges();
          },
        });
    }
  }
}