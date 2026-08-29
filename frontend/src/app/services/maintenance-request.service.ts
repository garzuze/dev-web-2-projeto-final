import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MaintenanceRequest } from '../models/maintenanceRequest.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestService {
  // Busca a informação de um requisição de manutenção específica
  getMaintenanceRequestById(id: number): Observable<MaintenanceRequest> {
    return of({
      id: id,
      clientId: 1,
      categoryId: 2,
      statusId: 2,
      equipmentDescription: 'Notebook Dell',
      defectDescription: 'Não liga',
      openingDateTime: new Date().toISOString(),
      quoteValue: 350.0,
    });
  }

  // Aprova o orçamento de manutenção
  approveRequest(id: number): Observable<{ message: string; success: boolean }> {
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
    return of({
      message: `Serviço rejeitado pelo motivo: ${rejectionReason}`,
      success: true,
    });
  }

  // Restaura uma requisição que tinha sido rejeitada anteriormente
  rescueRequest(id: number): Observable<{ message: string; success: boolean }> {
    return of({
      message: `Serviço ${id} restaurado`,
      success: true,
    });
  }

  // Paga uma requisição de manutençao
  payRequest(
    id: number,
  ): Observable<{ message: string; success: boolean; paymentDateTime: string }> {
    return of({
      message: `Registrado pagamento do pedido ${id}`,
      success: true,
      paymentDateTime: new Date().toISOString(),
    });
  }
}
