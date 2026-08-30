import { Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest } from '../../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { ApproveModalComponent } from './approve-modal/approve-modal.component';

@Component({
  imports: [CurrencyPipe, DatePipe, LowerCasePipe, RejectionModalComponent, ApproveModalComponent],
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
  public isApproveModalOpen: boolean = false;
  public isApproving: boolean = false;
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
  onApprove() {
    this.isApproveModalOpen = true;
  }
  onCancelApprove() {
    this.isApproveModalOpen = false;
  }
  onConfirmApprove() {
    if (this.requestData?.id) {
      this.isApproving = true;
      this.maintenanceRequestService.approveRequest(this.requestData.id).subscribe({
        next: () => {
          this.isApproving = false;
          this.notificationService.showNotification(
            'Orçamento aprovado com sucesso',
            NotificationType.success,
          );
          this.isApproveModalOpen = false;
        },
        error: (err) => {
          this.isApproving = false;
          this.notificationService.showNotification(
            'Erro ao aprovar orçamento',
            NotificationType.error,
          );
        },
      });
    }
  }
}
