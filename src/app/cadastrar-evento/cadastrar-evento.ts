import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface respostaEvento {
  message: string;
  tipoMessagem: string
}

@Component({
  selector: 'app-cadastrar-evento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastrar-evento.html',
  styleUrl: './cadastrar-evento.css',
})
export class CadastrarEvento {

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  formularioPalestras = new FormGroup({
    titulo: new FormControl('', Validators.required),
    descricao: new FormControl('', Validators.required),
    nomePalestrante: new FormControl('', Validators.required),
    localEvento: new FormControl('', Validators.required),
    dataEvento: new FormControl('', Validators.required)
  });

  mensagem: string = '';
  tipoMensagem: 'success' | 'danger' = 'success';

  onSubmit() {
    if (this.formularioPalestras.valid) {
      this.http
        .post<any>(
          'http://localhost:3000/api/admin',
          this.formularioPalestras.value
        )
        .subscribe({
          next: (res) => {
            this.tipoMensagem = 'success';
            this.mensagem = res.message;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          },
          error: (err) => {
            this.tipoMensagem = 'danger';
            if (err?.status === 400) {
              this.mensagem =
                err?.error?.message || 'Erro ao cadastrar palestra/evento';
            } else {
              this.mensagem =
                err?.error?.message || 'Erro interno ao salvar os dados';
            }
            this.cdr.detectChanges();
          },
        });
    }
  }
}
