import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ViaCepResponse } from '../models/via-cep.model';

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  private http = inject(HttpClient);

  buscarCep(cep: string): Observable<ViaCepResponse> {
    const digitos = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${digitos}/json/`);
  }
}
