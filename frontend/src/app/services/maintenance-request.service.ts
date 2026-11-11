import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceRequest } from '../models/maintenanceRequest.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../core/api';

export type EmployeeRequestFilter = 'ALL' | 'TODAY' | 'PERIOD';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/requests`;
  private readonly employeeUrl = `${API_URL}/employee/requests`;

  getAllRequests(
    filterType: EmployeeRequestFilter = 'ALL',
    startDate?: string,
    endDate?: string,
  ): Observable<MaintenanceRequest[]> {
    let params = new HttpParams().set('filterType', filterType);
    if (filterType === 'PERIOD') {
      if (startDate) params = params.set('startDate', startDate);
      if (endDate) params = params.set('endDate', endDate);
    }
    return this.http.get<MaintenanceRequest[]>(this.employeeUrl, { params });
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

  // Funcionário registra a manutenção feita (RF014) e a solicitação vai para
  // ARRUMADA. A API recebe "customerInstructions", mas devolve "clientInstructions".
  performMaintenance(
    id: number,
    maintenanceDescription: string,
    customerInstructions: string,
  ): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(
      `${this.employeeUrl}/${id}/maintenance`,
      { maintenanceDescription, customerInstructions },
    );
  }
  
  // Redireciona a manutenção da solicitação para outro funcionário.
  redirectRequest(
    id: number,
    destinationEmployeeId: number,
  ): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(
      `${this.employeeUrl}/${id}/redirect`,
      { destinationEmployeeId },
    );
  }

  // Funcionário finaliza a solicitação PAGA (RF016). Quem finalizou e quando
  // ficam no histórico, gravados pelo backend.
  finishRequest(id: number): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(
      `${this.employeeUrl}/${id}/finish`,
      null,
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
    return this.http.put<MaintenanceRequest>(`${this.url}/${id}/reject`, {
      rejectionReason,
    });
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
