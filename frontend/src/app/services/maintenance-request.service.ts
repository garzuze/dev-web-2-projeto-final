import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../models/maintenanceRequest.model';
import { MAINTENANCE_REQUEST_MOCK } from '../mocks/maintenance-request.mock';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/requests`;

  getAllRequests(): Observable<MaintenanceRequest[] | undefined> {
    return of(MAINTENANCE_REQUEST_MOCK);
  }

  getOpenRequests(): Observable<MaintenanceRequest[] | undefined> {
    const filteredRequests = MAINTENANCE_REQUEST_MOCK.filter(
      (request) => request.statusName === RequestStatus.Open,
    );
    return of(filteredRequests);
  }

  // Busca a informação de um requisição de manutenção específica
  getMaintenanceRequestById(id: number): Observable<MaintenanceRequest> {
    return this.http.get<MaintenanceRequest>(`${this.url}/${id}`);
  }

  quoteRequest(id: number, quoteValue: number) {
    const request = MAINTENANCE_REQUEST_MOCK.find((r) => r.id === id);
    if (request) {
      const previousStatus = request.statusName;
      request.statusName = RequestStatus.Quoted;
      request.quoteValue = quoteValue;
      request.history.push({
        id: Date.now(),
        requestId: id,
        dateTime: new Date().toISOString(),
        previousStatus: previousStatus,
        newStatus: RequestStatus.Quoted,
        notes: 'Orçamento criado pelo funcionário.',
      });
    }
    return of({
      message: 'Orçamento registrado com sucesso',
      success: true,
    });
  }

  // Lista as solicitações de um cliente ordenadas de forma crescente por data/hora
  getMaintenanceRequestsByClientId(
    clientId: number,
  ): Observable<MaintenanceRequest[]> {
    const clientRequests = MAINTENANCE_REQUEST_MOCK.filter(
      (r) => r.clientId === clientId,
    );
    // Dados fictícios do mock para teste caso o cliente não tenha nenhuma solicitação criada
    const requests = (
      clientRequests.length > 0 ? clientRequests : [...MAINTENANCE_REQUEST_MOCK]
    ).sort(
      (a, b) =>
        new Date(a.openingDateTime).getTime() -
        new Date(b.openingDateTime).getTime(),
    );
    return of(requests);
  }

  createRequest(request: {
    clientId: number;
    clientName: string;
    categoryName: string;
    equipmentDescription: string;
    defectDescription: string;
  }): Observable<MaintenanceRequest> {
    const id = Date.now();
    const newRequest: MaintenanceRequest = {
      id,
      openingDateTime: new Date().toISOString(),
      statusName: RequestStatus.Open,
      clientId: request.clientId,
      clientName: request.clientName,
      categoryName: request.categoryName,
      equipmentDescription: request.equipmentDescription,
      defectDescription: request.defectDescription,
      history: [
        {
          id,
          requestId: id,
          dateTime: new Date().toISOString(),
          newStatus: RequestStatus.Open,
          notes: 'Solicitação aberta pelo cliente.',
        },
      ],
    };
    MAINTENANCE_REQUEST_MOCK.push(newRequest);
    return of(newRequest);
  }

  // Aprova o orçamento de manutenção
  approveRequest(id: number): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.url}/${id}/approve`, null);
  }

  // Rejeita o orçamento da manutenção
  rejectRequest(
    id: number,
    rejectionReason: string,
  ): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(
      `${this.url}/${id}/reject`,
      { rejectionReason },
    );
  }

  // Restaura uma requisição que tinha sido rejeitada anteriormente
  rescueRequest(id: number): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.url}/${id}/rescue`, null);
  }

  // Paga uma requisição de manutençao
  payRequest(id: number): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.url}/${id}/pay`, null);
  }
}
