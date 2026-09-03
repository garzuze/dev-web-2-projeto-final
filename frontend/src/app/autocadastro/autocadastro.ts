import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ViaCepService } from './via-cep.service';


@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-autocadastro',
  styleUrl: './autocadastro.scss',
  templateUrl: './autocadastro.html',

})
export class Autocadastro {
  private formBuilder = inject(FormBuilder);
  private servicoCep = inject(ViaCepService);

  form = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    telefone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cep: ['', Validators.required],
    estado: ['', Validators.required],
    cidade: ['', Validators.required],
    bairro: ['', Validators.required],
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: ['']
  })

   buscaCep() {
      const cep = this.form.get('cep')?.value?.replace(/\D/g, '') || '';
      
      if (cep.length === 8) {
        this.servicoCep.buscarCep(cep).subscribe((retorno) => {
          if (retorno.erro) {
            alert('CEP não encontrado!');
            return;
          }
          
          this.form.patchValue({
            rua: retorno.logradouro,
            bairro: retorno.bairro,
            cidade: retorno.localidade,
            estado: retorno.uf,
          });
        });
      }
    }

    cadastrar() {
      console.log('Formulário é válido?', this.form.valid);
      console.log('Exemplo de payload:', this.form.value);
    }
}
