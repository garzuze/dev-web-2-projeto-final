import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { ApproveModalComponent } from './approve-modal/approve-modal.component';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { ClientHeaderComponent } from '../../../components/client-header/client-header.component';
import { RescueModalComponent } from './rescue-modal/rescue-modal.component';
import { problemMessage } from '../../../core/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalContainerComponent } from '../../../components/modal-container/modal-container.component';

@Component({
  imports: [
    ClientHeaderComponent,
    RequestDetailsCardComponent,
    RejectionModalComponent,
    ApproveModalComponent,
    RescueModalComponent,
    CurrencyPipe,
    ModalContainerComponent,
  ],
  selector: 'app-quote',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  public approvedValue: number | null = null;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.maintenanceRequestService.getMaintenanceRequestById(id).subscribe({
        next: (request) => {
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
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.showNotification(
            problemMessage(err, 'Solicitação não encontrada.'),
            NotificationType.error,
          );
          this.router.navigate(['/client/request']);
        },
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
    if (this.requestData?.id) {
      this.isRejecting = true;
      this.maintenanceRequestService
        .rejectRequest(this.requestData.id, $event)
        .subscribe({
          next: (res) => {
            this.isRejecting = false;
            this.notificationService.showNotification(
              'Serviço Rejeitado',
              NotificationType.success,
            );
            this.isRejectionModalOpen = false;
            this.router.navigate(['/client/request']);
          },
          error: (err) => {
            this.isRejecting = false;
            this.notificationService.showNotification(
              problemMessage(err, 'Erro ao rejeitar orçamento'),
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
      this.maintenanceRequestService
        .approveRequest(this.requestData.id)
        .subscribe({
          next: (res) => {
            this.isApproving = false;
            this.isApproveModalOpen = false;
            this.approvedValue = res.quoteValue ?? 0;
          },
          error: (err) => {
            this.isApproving = false;
            this.notificationService.showNotification(
              problemMessage(err, 'Erro ao aprovar orçamento'),
              NotificationType.error,
            );
          },
        });
    }
  }

  onApprovedOk() {
    this.approvedValue = null;
    this.router.navigate(['/client/request']);
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
      this.maintenanceRequestService
        .rescueRequest(this.requestData.id)
        .subscribe({
          next: (r) => {
            this.isRescuing = false;
            this.notificationService.showNotification(
              'Solicitação resgatada com sucesso',
              NotificationType.success,
            );
            this.isRescueModalOpen = false;
            this.router.navigate(['/client/request']);
          },
          error: (err) => {
            this.isRescuing = false;
            this.notificationService.showNotification(
              problemMessage(err, 'Erro ao resgatar orçamento'),
              NotificationType.error,
            );
          },
        });
    }
  }
}
