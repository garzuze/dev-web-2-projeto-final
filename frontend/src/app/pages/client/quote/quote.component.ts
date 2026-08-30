import { Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest, RequestStatus } from '../../../models/maintenanceRequest.model';
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
  public isRejecting: boolean = false;
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
      this.isRejecting = true;
      this.maintenanceRequestService.approveRequest(this.requestData.id).subscribe({
        next: () => {
          this.isApproving = false;
          this.isRejecting = false;
          this.notificationService.showNotification(
            'Orçamento aprovado com sucesso',
            NotificationType.success,
          );
          this.isApproveModalOpen = false;
        },
        error: (err) => {
          this.isApproving = false;
          this.isRejecting = false;
          this.notificationService.showNotification(
            'Erro ao aprovar orçamento',
            NotificationType.error,
          );
        },
      });
    }
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case RequestStatus.Open:
        return 'bg-gray-100 text-gray-800';
      case RequestStatus.Quoted:
        return 'bg-amber-800/10 text-amber-900';
      case RequestStatus.Rejected:
        return 'bg-red-100 text-red-800';
      case RequestStatus.Approved:
        return 'bg-yellow-100 text-yellow-800';
      case RequestStatus.Redirected:
        return 'bg-purple-100 text-purple-800';
      case RequestStatus.Arranged:
        return 'bg-blue-100 text-blue-800';
      case RequestStatus.Paid:
        return 'bg-orange-100 text-orange-800';
      case RequestStatus.Completed:
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
