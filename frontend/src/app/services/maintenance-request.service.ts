import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MaintenanceRequest } from '../models/maintenanceRequest.model';
import { MAINTENANCE_REQUEST_MOCK } from '../mocks/maintenance-request.mock';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/requests`;
  private readonly employeeUrl = `${API_URL}/employee/requests`;

  getAllRequests(): Observable<MaintenanceRequest[] | undefined> {
    return of(MAINTENANCE_REQUEST_MOCK);
  }

  getOpenRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${this.employeeUrl}/open`);
  }

  // Busca a informação de um requisição de manutenção específica
  getMaintenanceRequestById(id: number): Observable<MaintenanceRequest> {
    return this.http.get<MaintenanceRequest>(`${this.url}/${id}`);
  }

  getEmployeeRequestById(id: number): Observable<MaintenanceRequest> {
    return this.http.get<MaintenanceRequest>(`${this.employeeUrl}/${id}`);
  }

  quoteRequest(id: number, quoteValue: number): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(
      `${this.employeeUrl}/${id}/quote`,
      { quoteValue },
    );
  }

  // Lista as solicitações do cliente logado, já ordenadas pelo backend
  getClientRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.url);
  }

  createRequest(request: {
    equipmentDescription: string;
    categoryId: number;
    defectDescription: string;
  }): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(this.url, request);
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
