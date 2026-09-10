import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ViaCepService } from './via-cep.service';
import { AuthService, SignUpRequest } from '../core/auth.service';
import { Header } from '../components/header/header';


@Component({
  imports: [RouterLink, ReactiveFormsModule, Header],
  selector: 'app-autocadastro',
  styleUrl: './autocadastro.scss',
  templateUrl: './autocadastro.html',
})
export class Autocadastro {
  private formBuilder = inject(FormBuilder);
  private servicoCep = inject(ViaCepService);
  private authService = inject(AuthService);
  private router = inject(Router);

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
    complemento: [''],
  });

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
    if (this.form.invalid) {
      return;
    }

    const dados = this.form.getRawValue();
    const payload: SignUpRequest = {
      name: dados.nome || '',
      cpf: (dados.cpf || '').replace(/\D/g, ''),
      email: dados.email || '',
      phone: (dados.telefone || '').replace(/\D/g, ''),
      address: {
        zipCode: (dados.cep || '').replace(/\D/g, ''),
        street: dados.rua || '',
        number: dados.numero || '',
        district: dados.bairro || '',
        city: dados.cidade || '',
        state: dados.estado || '',
        complement: dados.complemento || '',
      },
    };

    this.authService.signUp(payload).subscribe({
      next: (resposta) => {
        alert('Cadastro realizado com sucesso! Sua senha de acesso foi enviada para o seu e-mail.');
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);
        alert('Erro ao realizar cadastro. Verifique se o CPF ou e-mail já estão cadastrados.');
      },
    });
  }
}
