import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../../../core/api';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { NotificationType } from '../../../models/notification.model';
import { NotificationService } from '../../../services/notification.service';
import { RequestListComponent } from './request-list.component';

describe('RequestListComponent', () => {
  let component: RequestListComponent;
  let fixture: ComponentFixture<RequestListComponent>;
  let httpTesting: HttpTestingController;
  let showNotification: ReturnType<typeof vi.spyOn>;

  const listUrl = `${API_URL}/employee/requests`;
  const finishUrl = `${listUrl}/9/finish`;
  const paid: MaintenanceRequest = {
    id: 9,
    openingDateTime: '2026-10-20T09:15:00',
    statusName: RequestStatus.Paid,
    clientId: 4,
    clientName: 'Joana Martins',
    categoryName: 'Impressora',
    equipmentDescription: 'Impressora HP LaserJet',
    defectDescription: 'Papel enrosca na bandeja',
    quoteValue: 120,
    history: [],
  };

  function respondList(requests: MaintenanceRequest[]) {
    httpTesting
      .expectOne((req) => req.url === listUrl && req.method === 'GET')
      .flush(requests);
    fixture.detectChanges();
  }

  function finishButton(): HTMLButtonElement | undefined {
    return Array.from(
      fixture.nativeElement.querySelectorAll(
        'button',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Finalizar Solicitação'));
  }

  function clickFinishAndConfirm() {
    finishButton()!.click();
    fixture.detectChanges();
    component.confirmFinish();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestListComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    showNotification = vi.spyOn(
      TestBed.inject(NotificationService),
      'showNotification',
    );
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    respondList([]);
    expect(component).toBeTruthy();
  });

  it('abre a confirmação ao clicar em Finalizar Solicitação (RF016)', () => {
    respondList([paid]);

    finishButton()!.click();
    fixture.detectChanges();

    expect(component.selectedRequestForFinish).toBe(paid);
    expect(fixture.nativeElement.textContent).toContain(
      'Finalizar a solicitação #9?',
    );
  });

  it('cancelar a confirmação não chama a API', () => {
    respondList([paid]);

    finishButton()!.click();
    component.cancelFinish();
    fixture.detectChanges();

    expect(component.selectedRequestForFinish).toBeNull();
    httpTesting.expectNone(finishUrl);
  });

  it('finaliza pela API, avisa e recarrega a lista', () => {
    respondList([paid]);

    clickFinishAndConfirm();
    const put = httpTesting.expectOne(finishUrl);
    expect(put.request.method).toBe('PUT');
    expect(component.isFinishing).toBe(true);
    put.flush({ ...paid, statusName: RequestStatus.Completed });

    expect(showNotification).toHaveBeenCalledWith(
      'Solicitação #9 finalizada com sucesso.',
      NotificationType.success,
    );
    expect(component.selectedRequestForFinish).toBeNull();
    expect(component.isFinishing).toBe(false);
    respondList([{ ...paid, statusName: RequestStatus.Completed }]);
    expect(finishButton()).toBeUndefined();
  });

  it('mostra a mensagem do backend quando a finalização falha', () => {
    respondList([paid]);

    clickFinishAndConfirm();
    httpTesting
      .expectOne(finishUrl)
      .flush(
        {
          status: 409,
          detail: 'Apenas serviços no estado PAGA podem ser finalizados.',
        },
        { status: 409, statusText: 'Conflict' },
      );

    expect(showNotification).toHaveBeenCalledWith(
      'Apenas serviços no estado PAGA podem ser finalizados.',
      NotificationType.error,
    );
    expect(component.isFinishing).toBe(false);
    expect(component.selectedRequestForFinish).toBe(paid);
  });
});
