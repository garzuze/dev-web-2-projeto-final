import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViaCepService } from './via-cep.service';
import { AuthService, SignUpRequest } from '../core/auth.service';
import { Header } from '../components/header/header';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../models/notification.model';

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
  private notificationService = inject(NotificationService);

  get f() {
    return this.form.controls;
  }

  get name() {
    return this.f.name;
  }

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
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
      this.servicoCep.buscarCep(cep).subscribe({
        next: (response) =>{
          if (response.erro) { 
          this.notificationService.showNotification(
            'CEP não encontrado!',
            NotificationType.alert
          )
          return;
        }

        this.form.patchValue({
          street: response.logradouro,
          bairro: response.bairro,
          cidade: response.localidade,
          estado: response.uf,
        });
        this.notificationService.showNotification(
          'Endereço preenchido automaticamente',
          NotificationType.success
        )
        },
        error: (err) => {
          console.error('Erro na consulta do CEP:', err);
          this.notificationService.showNotification(
            'Não foi possivel consultar o CEP no momento.',
            NotificationType.error
          )
        }
        
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.showNotification(
        'Por favor, preencha todos os campos obrigatorios',
        NotificationType.alert
      )
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
        this.notificationService.showNotification(
          'Cadastro realizado com sucesso! Sua senha de acesso foi enviada para o e-mail de cadastro.',
          NotificationType.success
        )
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);
        this.notificationService.showNotification(
          'Erro ao realizar cadastro. Verifique se o CPF ou e-mail já estão cadastrados.',
          NotificationType.error
        )
      },
    });
  }
}
