import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { API_URL } from '../core/api';
import { NotificationService } from '../services/notification.service';
import { SelfRegister } from './self-register.component';

describe('SelfRegister', () => {
  let component: SelfRegister;
  let fixture: ComponentFixture<SelfRegister>;
  let http: HttpTestingController;

  const page = () => fixture.nativeElement as HTMLElement;
  const notifications = () =>
    TestBed.inject(NotificationService)
      .messages()
      .map((notification) => notification.message);

  /** Digita no campo como o usuário faria, passando pelo formulário. */
  const type = (id: string, value: string) => {
    const input = page().querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfRegister],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // o cadastro termina navegando para /login
        provideRouter([{ path: 'login', children: [] }]),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SelfRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require the name', () => {
    type('name', '');

    expect(component.name.hasError('required')).toBe(true);
    expect(page().textContent).toContain('O nome é obrigatório.');
  });

  it('should ask for at least 3 characters in the name', () => {
    type('name', 'ab');

    expect(component.name.hasError('minlength')).toBe(true);
    expect(page().textContent).toContain(
      'O nome deve ter pelo menos 3 caracteres.',
    );
  });

  it('should accept a valid name and leave the field validated', () => {
    type('name', 'Maria Silva');

    expect(component.name.valid).toBe(true);
    expect(component.name.status).toBe('VALID');
  });

  it('should not accept a name longer than the 120 the backend allows', () => {
    component.name.setValue('a'.repeat(121));
    component.name.markAsTouched();
    fixture.detectChanges();

    expect(component.name.hasError('maxlength')).toBe(true);
    expect(page().textContent).toContain(
      'O nome deve ter no máximo 120 caracteres.',
    );
  });

  it('should warn and not call the backend while the form is invalid', () => {
    component.save();

    expect(notifications()).toEqual([
      'Por favor, preencha todos os campos obrigatórios.',
    ]);
    http.expectNone(`${API_URL}/auth/sign-up`);
  });

  it('should send only the digits of CPF, phone and CEP and go to the login', async () => {
    component.form.setValue({
      name: 'Maria Silva',
      cpf: '111.222.333-44',
      phone: '(41) 98888-1111',
      email: 'maria@exemplo.com',
      cep: '80060-000',
      estado: 'PR',
      cidade: 'Curitiba',
      bairro: 'Centro',
      street: 'Rua XV de Novembro',
      numero: '150',
      complemento: '',
    });

    component.save();

    const request = http.expectOne(`${API_URL}/auth/sign-up`);
    expect(request.request.body).toEqual({
      name: 'Maria Silva',
      cpf: '11122233344',
      email: 'maria@exemplo.com',
      phone: '41988881111',
      address: {
        zipCode: '80060000',
        street: 'Rua XV de Novembro',
        number: '150',
        district: 'Centro',
        city: 'Curitiba',
        state: 'PR',
        complement: '',
      },
    });
    request.flush({ id: 1, name: 'Maria Silva', email: 'maria@exemplo.com' });
    await fixture.whenStable();

    expect(notifications()).toEqual([
      expect.stringContaining('Cadastro realizado com sucesso'),
    ]);
    expect(TestBed.inject(Router).url).toBe('/login');
  });
});
