import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViaCepService } from './via-cep.service';
import { AuthService, SignUpRequest } from '../core/auth.service';
import { Header } from '../components/header/header';

@Component({
  imports: [RouterLink, ReactiveFormsModule, Header],
  selector: 'app-self-register',
  styleUrl: './self-register.component.scss',
  templateUrl: './self-register.component.html',
})
export class SelfRegister {
  private formBuilder = inject(FormBuilder);
  private servicoCep = inject(ViaCepService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get f() {
    return this.form.controls;
  }

  get name() {
    return this.f.name;
  }

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    cpf: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cep: ['', Validators.required],
    estado: ['', Validators.required],
    cidade: ['', Validators.required],
    bairro: ['', Validators.required],
    street: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
  });

  buscaCep() {
    const cep = this.form.get('cep')?.value?.replace(/\D/g, '') || '';

    if (cep.length === 8) {
      this.servicoCep.buscarCep(cep).subscribe((response) => {
        if (response.erro) { // response.erro? Isso existe mesmo? Por quê não tipar esse response?
          alert('CEP não encontrado!');
          return;
        }

        this.form.patchValue({
          street: response.logradouro,
          bairro: response.bairro,
          cidade: response.localidade,
          estado: response.uf,
        });
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();
    const payload: SignUpRequest = {
      name: formData.name || '',
      cpf: (formData.cpf || '').replace(/\D/g, ''),
      email: formData.email || '',
      phone: (formData.phone || '').replace(/\D/g, ''),
      address: {
        zipCode: (formData.cep || '').replace(/\D/g, ''),
        street: formData.street || '',
        number: formData.numero || '',
        district: formData.bairro || '',
        city: formData.cidade || '',
        state: formData.estado || '',
        complement: formData.complemento || '',
      },
    };

    this.authService.signUp(payload).subscribe({
      next: (resposta) => {
        alert(
          'Cadastro realizado com sucesso! Sua senha de acesso foi enviada para o seu e-mail.',
        );
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);
        alert(
          'Erro ao realizar cadastro. Verifique se o CPF ou e-mail já estão cadastrados.',
        );
      },
    });
  }
}
