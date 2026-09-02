import { Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest, RequestStatus } from '../../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { ApproveModalComponent } from './approve-modal/approve-modal.component';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { RescueModalComponent } from './rescue-modal/rescue-modal.component';

@Component({
  imports: [
    RequestDetailsCardComponent,
    RejectionModalComponent,
    ApproveModalComponent,
    RescueModalComponent,
  ],
  selector: 'app-quote',
  styleUrl: './quote.component.scss',
  templateUrl: './quote.component.html',
})
export class QuoteComponent {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private notificationService = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public requestData?: MaintenanceRequest;
  public requestStatus = RequestStatus;

  public isRejectionModalOpen: boolean = false;
  public isApproveModalOpen: boolean = false;
  public isRescueModalOpen: boolean = false;
  public isApproving: boolean = false;
  public isRejecting: boolean = false;
  public isRescuing: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.maintenanceRequestService.getMaintenanceRequestById(id).subscribe((request) => {
        if (!request) {
          this.notificationService.showNotification(
            'Solicitação não encontrada',
            NotificationType.error,
          );
          this.router.navigate(['/client/request']);
          return;
        }
        if (
          request.statusName !== RequestStatus.Quoted &&
          request.statusName !== RequestStatus.Rejected
        ) {
          if (request.statusName === RequestStatus.Open) {
            this.notificationService.showNotification(
              'Esta solicitação ainda está sendo orçada. O orçamento não está disponível no momento.',
              NotificationType.alert,
            );
          } else {
            this.notificationService.showNotification(
              'Este orçamento já foi processado e não está mais disponível.',
              NotificationType.alert,
            );
          }

          this.router.navigate(['/client/request']);
          return;
        }
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
      this.isRejecting = true;
      this.maintenanceRequestService.rejectRequest(this.requestData.id, $event).subscribe({
        next: (res) => {
          this.isRejecting = false;
          this.notificationService.showNotification(
            'Orçamento rejeitado com sucesso!',
            NotificationType.success,
          );
          this.isRejectionModalOpen = false;
        },
        error: (err) => {
          this.isRejecting = false;
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

  onRescue() {
    this.isRescueModalOpen = true;
  }

  onCancelRescue() {
    this.isRescueModalOpen = false;
  }

  onConfirmRescue() {
    if (this.requestData?.id) {
      this.isRescuing = true;
      this.maintenanceRequestService.rescueRequest(this.requestData.id).subscribe({
        next: (r) => {
          this.isRescuing = false;
          this.notificationService.showNotification(
            'Solicitação resgatada com sucesso',
            NotificationType.success,
          );
          this.isRejectionModalOpen = false;
        },
        error: (err) => {
          this.isRescuing = false;
          this.notificationService.showNotification(
            'Erro ao resgatar orçamento',
            NotificationType.error,
          );
        },
      });
    }
  }
}
