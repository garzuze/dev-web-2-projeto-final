import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from '../../../core/api';
import { AuthService } from '../../../core/auth.service';
import { Employee } from '../../../models/employee.model';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { NotificationType } from '../../../models/notification.model';
import { NotificationService } from '../../../services/notification.service';
import { MaintenanceFormComponent } from './maintenance-form.component';

describe('MaintenanceFormComponent', () => {
  let component: MaintenanceFormComponent;
  let fixture: ComponentFixture<MaintenanceFormComponent>;
  let httpTesting: HttpTestingController;
  let paramMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let navigate: ReturnType<typeof vi.spyOn>;
  let showNotification: ReturnType<typeof vi.spyOn>;

  const requestUrl = `${API_URL}/employee/requests/7`;
  const maintenanceUrl = `${requestUrl}/maintenance`;
  const redirectUrl = `${requestUrl}/redirect`;
  const employeesUrl = `${API_URL}/employees`;
  const request: MaintenanceRequest = {
    id: 7,
    openingDateTime: '2026-10-13T14:32:00',
    statusName: RequestStatus.Approved,
    clientId: 25,
    clientName: 'José Pereira',
    clientDetails: {
      id: 25,
      name: 'José Pereira',
      email: 'jose@cliente.com',
      cpf: '22233344455',
      phone: '41988882222',
    },
    categoryName: 'Desktop',
    equipmentDescription: 'Desktop Positivo Master D580',
    defectDescription: 'Reinicia sozinho',
    quoteValue: 350,
    history: [],
  };
  // Maria (id 1) é quem está logada nos testes.
  const employees: Employee[] = [
    {
      id: 1,
      name: 'Maria',
      email: 'maria@manutencao.com',
      birthDate: '1990-05-10',
    },
    {
      id: 2,
      name: 'Mário',
      email: 'mario@manutencao.com',
      birthDate: '1988-03-22',
    },
    {
      id: 3,
      name: 'Ana',
      email: 'ana@manutencao.com',
      birthDate: '1995-11-02',
    },
  ];

  // Abre a tela e responde a busca da solicitação.
  function openWith(loaded: MaintenanceRequest = request) {
    fixture.detectChanges();
    httpTesting.expectOne(requestUrl).flush(loaded);
    fixture.detectChanges();
  }

  // Pede o redirecionamento e responde a busca dos funcionários.
  function openRedirectModal() {
    component.openRedirectModal();
    httpTesting.expectOne(employeesUrl).flush(employees);
    fixture.detectChanges();
  }

  function fillForm(
    maintenanceDescription: string,
    customerInstructions: string,
  ) {
    component.form.setValue({ maintenanceDescription, customerInstructions });
  }

  function buttonByText(text: string): HTMLButtonElement {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    const button = buttons.find((item) => item.textContent?.trim() === text);
    if (!button) {
      throw new Error(`Botão "${text}" não encontrado`);
    }
    return button;
  }

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject(convertToParamMap({ id: '7' }));

    await TestBed.configureTestingModule({
      imports: [MaintenanceFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$ } },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    TestBed.inject(AuthService).setLoggedUser({
      id: 1,
      name: 'Maria',
      email: 'maria@manutencao.com',
      profile: 'EMPLOYEE',
    });

    fixture = TestBed.createComponent(MaintenanceFormComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    showNotification = vi.spyOn(
      TestBed.inject(NotificationService),
      'showNotification',
    );
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should load the request from the employee API and show client and equipment', () => {
    fixture.detectChanges();
    const getRequest = httpTesting.expectOne(requestUrl);
    expect(getRequest.request.method).toBe('GET');
    getRequest.flush(request);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Efetuar Manutenção #7');
    expect(text).toContain('José Pereira');
    expect(text).toContain('Desktop Positivo Master D580');
  });

  it.each([RequestStatus.Approved, RequestStatus.Redirected])(
    'should open the form for a %s request',
    (statusName) => {
      openWith({ ...request, statusName });

      expect(component.requestData()?.statusName).toBe(statusName);
      expect(navigate).not.toHaveBeenCalled();
    },
  );

  it('should go back to the list when the request cannot receive maintenance', () => {
    openWith({ ...request, statusName: RequestStatus.Arranged });

    expect(component.requestData()).toBeNull();
    expect(showNotification).toHaveBeenCalledWith(
      'Esta solicitação não está disponível para manutenção.',
      NotificationType.error,
    );
    expect(navigate).toHaveBeenCalledWith(['/employee/requests']);
  });

  it('should go back to the list and show the API message when the request is not found', () => {
    fixture.detectChanges();
    httpTesting
      .expectOne(requestUrl)
      .flush(
        { status: 404, detail: 'Solicitação não encontrada.' },
        { status: 404, statusText: 'Not Found' },
      );

    expect(showNotification).toHaveBeenCalledWith(
      'Solicitação não encontrada.',
      NotificationType.error,
    );
    expect(navigate).toHaveBeenCalledWith(['/employee/requests']);
  });

  it('should go back to the list without calling the API when the id is invalid', () => {
    paramMap$.next(convertToParamMap({ id: 'abc' }));

    fixture.detectChanges();

    httpTesting.expectNone(requestUrl);
    expect(navigate).toHaveBeenCalledWith(['/employee/requests']);
  });

  it('should require both fields and show the errors on submit', () => {
    openWith();

    component.submit();
    fixture.detectChanges();

    httpTesting.expectNone(maintenanceUrl);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('A descrição da manutenção é obrigatória.');
    expect(text).toContain('As orientações para o cliente são obrigatórias.');
  });

  it('should not accept fields with only spaces', () => {
    openWith();
    fillForm('   ', '   ');

    component.submit();

    httpTesting.expectNone(maintenanceUrl);
    expect(component.maintenanceDescription.hasError('pattern')).toBe(true);
    expect(component.customerInstructions.hasError('pattern')).toBe(true);
  });

  it('should not accept more than 500 characters in a field', () => {
    openWith();
    fillForm('a'.repeat(501), 'b'.repeat(501));

    component.submit();

    httpTesting.expectNone(maintenanceUrl);
    expect(component.maintenanceDescription.hasError('maxlength')).toBe(true);
    expect(component.customerInstructions.hasError('maxlength')).toBe(true);
  });

  it('should send the trimmed texts to the API and go back to the list', () => {
    openWith();
    fillForm('  Troca da fonte de alimentação  ', '  Evite locais abafados  ');

    component.submit();

    const putRequest = httpTesting.expectOne(maintenanceUrl);
    expect(putRequest.request.method).toBe('PUT');
    expect(putRequest.request.body).toEqual({
      maintenanceDescription: 'Troca da fonte de alimentação',
      customerInstructions: 'Evite locais abafados',
    });
    putRequest.flush({ ...request, statusName: RequestStatus.Arranged });

    expect(showNotification).toHaveBeenCalledWith(
      'Manutenção da solicitação #7 registrada com sucesso.',
      NotificationType.success,
    );
    expect(navigate).toHaveBeenCalledWith(['/employee/requests']);
    expect(component.submitting()).toBe(false);
  });

  it('should not send a second request while the first one is in progress', () => {
    openWith();
    fillForm('Troca da fonte', 'Evite locais abafados');

    component.submit();
    component.submit();

    httpTesting.expectOne(maintenanceUrl).flush(request);
  });

  it('should show the API message and stay on the screen when saving fails', () => {
    openWith();
    fillForm('Troca da fonte', 'Evite locais abafados');

    component.submit();
    httpTesting.expectOne(maintenanceUrl).flush(
      {
        status: 409,
        detail: 'Este serviço foi redirecionado para outro funcionário.',
      },
      { status: 409, statusText: 'Conflict' },
    );

    expect(showNotification).toHaveBeenCalledWith(
      'Este serviço foi redirecionado para outro funcionário.',
      NotificationType.error,
    );
    expect(navigate).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
  });

  it('should go back to the list when cancelled', () => {
    openWith();

    component.cancel();

    expect(navigate).toHaveBeenCalledWith(['/employee/requests']);
  });

  describe('redirect (RF015)', () => {
    it('should open the redirect modal with every employee but the logged one', () => {
      openWith();
      expect(
        fixture.nativeElement.querySelector('app-redirect-modal'),
      ).toBeNull();

      openRedirectModal();

      expect(component.availableEmployees().map((item) => item.id)).toEqual([
        2, 3,
      ]);
      expect(
        fixture.nativeElement.querySelector('app-redirect-modal'),
      ).not.toBeNull();
    });

    it('should not open the modal when the employees cannot be loaded', () => {
      openWith();

      component.openRedirectModal();
      httpTesting
        .expectOne(employeesUrl)
        .flush(null, { status: 500, statusText: 'Server Error' });
      fixture.detectChanges();

      expect(component.redirectModalOpen()).toBe(false);
      expect(component.loadingEmployees()).toBe(false);
      expect(showNotification).toHaveBeenCalledWith(
        'Não foi possível carregar a lista de funcionários.',
        NotificationType.error,
      );
    });

    it('should redirect to the employee chosen in the modal and go back to the list', async () => {
      openWith();
      buttonByText('Redirecionar Manutenção').click();
      httpTesting.expectOne(employeesUrl).flush(employees);
      fixture.detectChanges();
      await fixture.whenStable();

      const select: HTMLSelectElement = fixture.nativeElement.querySelector(
        '#destinationEmployee',
      );
      expect(
        Array.from(select.options).map((option) => option.textContent?.trim()),
      ).toEqual([
        'Selecione um funcionário...',
        'Mário (mario@manutencao.com)',
        'Ana (ana@manutencao.com)',
      ]);
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const confirmButton: HTMLButtonElement =
        fixture.nativeElement.querySelector('#confirm-redirect-button');
      expect(confirmButton.disabled).toBe(false);
      confirmButton.click();

      const putRequest = httpTesting.expectOne(redirectUrl);
      expect(putRequest.request.method).toBe('PUT');
      expect(putRequest.request.body).toEqual({ destinationEmployeeId: 2 });
      putRequest.flush({ ...request, statusName: RequestStatus.Redirected });

      expect(showNotification).toHaveBeenCalledWith(
        'Solicitação #7 redirecionada com sucesso para Mário.',
        NotificationType.success,
      );
      expect(navigate).toHaveBeenCalledWith(['/employee/requests']);
      expect(component.redirecting()).toBe(false);
    });

    it('should keep the modal open and show the API message when the redirect fails', () => {
      openWith();
      openRedirectModal();

      component.confirmRedirect(2);
      httpTesting.expectOne(redirectUrl).flush(
        {
          status: 409,
          detail: 'Não é possível redirecionar o serviço para si mesmo.',
        },
        { status: 409, statusText: 'Conflict' },
      );

      expect(showNotification).toHaveBeenCalledWith(
        'Não é possível redirecionar o serviço para si mesmo.',
        NotificationType.error,
      );
      expect(component.redirectModalOpen()).toBe(true);
      expect(component.redirecting()).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should close the modal when the redirect is cancelled', () => {
      openWith();
      openRedirectModal();

      component.closeRedirectModal();
      fixture.detectChanges();

      expect(component.redirectModalOpen()).toBe(false);
      expect(
        fixture.nativeElement.querySelector('app-redirect-modal'),
      ).toBeNull();
    });
  });
});
