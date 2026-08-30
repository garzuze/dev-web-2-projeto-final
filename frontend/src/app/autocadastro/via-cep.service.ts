import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class ViaCepService{
    private http = inject(HttpClient);

    buscarCep(cep: string): Observable<any>{
        const digitos = cep.replace(/\D/g, '');
        return this.http.get(`https://viacep.com.br/ws/${digitos}/json/`)
    }
}