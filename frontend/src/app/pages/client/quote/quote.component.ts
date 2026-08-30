import { Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest } from '../../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';

@Component({
  imports: [CurrencyPipe, DatePipe, LowerCasePipe, RejectionModalComponent],
  selector: 'app-quote',
  styleUrl: './quote.component.scss',
  templateUrl: './quote.component.html',
})
export class QuoteComponent {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private notificationService = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);
  public requestData?: MaintenanceRequest;
  public isRejectionModalOpen: boolean = false;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.maintenanceRequestService.getMaintenanceRequestById(id).subscribe((request) => {
        this.requestData = request;
      });
    });
  }
  onReject() {
    this.isRejectionModalOpen = true;
  }
  onCancelReject() {
    this.isRejectionModalOpen = false;
  }
  onConfirmReject($event: string) {
    console.log($event);
    if (this.requestData?.id) {
      this.maintenanceRequestService.rejectRequest(this.requestData.id, $event).subscribe({
        next: (res) => {
          this.notificationService.showNotification(
            'Orçamento rejeitado com sucesso!',
            NotificationType.success,
          );
          this.isRejectionModalOpen = false;
        },
        error: (err) => {
          this.notificationService.showNotification(
            'Erro ao rejeitar orçamento',
            NotificationType.error,
          );
        },
      });
    }
  }
  onConfirmRequest() {
    if (this.requestData?.id)
      this.maintenanceRequestService.approveRequest(this.requestData.id).subscribe({
        next: () => {
          this.notificationService.showNotification(
            'Orçamento aprovado com sucesso',
            NotificationType.success,
          );
        },
        error: (err) => {
          this.notificationService.showNotification(
            'Erro ao aprovar orçamento',
            NotificationType.error,
          );
        },
      });
  }
}
