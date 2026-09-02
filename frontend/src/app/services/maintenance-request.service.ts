import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MaintenanceRequest, RequestStatus } from '../models/maintenanceRequest.model';
import { MAINTENANCE_REQUEST_MOCK } from '../mocks/maintenance-request.mock';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestService {
  // Busca a informação de um requisição de manutenção específica
  getMaintenanceRequestById(id: number): Observable<MaintenanceRequest | undefined> {
    const request = MAINTENANCE_REQUEST_MOCK.find((r) => r.id === id);
    return of(request);
  }

  // Aprova o orçamento de manutenção
  approveRequest(id: number): Observable<{ message: string; success: boolean }> {
    const request = MAINTENANCE_REQUEST_MOCK.find((r) => r.id === id);
    if (request) {
      const previousStatus = request.statusName;
      request.statusName = RequestStatus.Approved;
      request.history.push({
        id: Date.now(),
        requestId: id,
        dateTime: new Date().toISOString(),
        previousStatus: previousStatus,
        newStatus: RequestStatus.Approved,
        notes: 'Orçamento aprovado pelo cliente.',
      });
    }
    return of({
      message: 'Serviço Aprovado',
      success: true,
    });
  }

  // Rejeita o orçamento da manutenção
  rejectRequest(
    id: number,
    rejectionReason: string,
  ): Observable<{ message: string; success: boolean }> {
    const request = MAINTENANCE_REQUEST_MOCK.find((r) => r.id === id);
    if (request) {
      const previousStatus = request.statusName;
      request.statusName = RequestStatus.Rejected;
      request.history.push({
        id: Date.now(),
        requestId: id,
        dateTime: new Date().toISOString(),
        previousStatus: previousStatus,
        newStatus: RequestStatus.Rejected,
        notes: `Cliente rejeitou o orçamento. Motivo: ${rejectionReason}`,
      });
    }
    return of({
      message: `Serviço rejeitado pelo motivo: ${rejectionReason}`,
      success: true,
    });
  }

  // Restaura uma requisição que tinha sido rejeitada anteriormente
  rescueRequest(id: number): Observable<{ message: string; success: boolean }> {
    const request = MAINTENANCE_REQUEST_MOCK.find((r) => r.id === id);
    if (request) {
      const previousStatus = request.statusName;
      request.statusName = RequestStatus.Approved;
      request.history.push({
        id: Date.now(),
        requestId: id,
        dateTime: new Date().toISOString(),
        previousStatus: previousStatus,
        newStatus: RequestStatus.Approved,
        notes: 'Serviço resgatado e aprovado.',
      });
    }
    return of({
      message: `Serviço ${id} restaurado`,
      success: true,
    });
  }

  // Paga uma requisição de manutençao
  payRequest(
    id: number,
  ): Observable<{ message: string; success: boolean; paymentDateTime: string }> {
    const request = MAINTENANCE_REQUEST_MOCK.find((r) => r.id === id);
    if (request) {
      const previousStatus = request.statusName;
      request.statusName = RequestStatus.Paid;
      request.history.push({
        id: Date.now(),
        requestId: id,
        dateTime: new Date().toISOString(),
        previousStatus: previousStatus,
        newStatus: RequestStatus.Paid,
        notes: 'Pagamento confirmado.',
      });
    }
    return of({
      message: `Registrado pagamento do pedido ${id}`,
      success: true,
      paymentDateTime: new Date().toISOString(),
    });
  }
}
