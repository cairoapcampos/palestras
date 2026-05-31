import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Palestra {
  id: number;
  titulo: string;
  descricao: string;
  nomePalestrante: string;
  localEvento: string;
  dataEvento: string;
  totalInscritos: number;
}

@Injectable({
  providedIn: 'root',
})

export class PalestraApi {

  private apiUrl = "http://localhost:3000/api/palestras";
  constructor(private http: HttpClient) { }
  listarPalestra(): Observable<Palestra[]> {
    return this.http.get<Palestra[]>(this.apiUrl);
  }

}
