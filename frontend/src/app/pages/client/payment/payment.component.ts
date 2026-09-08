import { Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceRequest, RequestStatus } from '../../../models/maintenanceRequest.model';
import { NotificationType } from '../../../models/notification.model';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { paymentData } from '../../../models/payment.model';

@Component({
  imports: [RequestDetailsCardComponent, PaymentModalComponent],
  selector: 'app-payment',
  styleUrl: './payment.component.scss',
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private notificationService = inject(NotificationService);
  private activatedRoutes = inject(ActivatedRoute);
  private router = inject(Router);
  public requestData?: MaintenanceRequest;
  public requestStatus = RequestStatus;

  public isPaymentModalOpen: boolean = false;
  public isPaymenting: boolean = false;
  ngOnInit(): void {
    this.activatedRoutes.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.maintenanceRequestService.getMaintenanceRequestById(id).subscribe((response) => {
        if (!response) {
          this.notificationService.showNotification(
            'Solicitação não encontrada',
            NotificationType.error,
          );
          this.router.navigate(['/client/request']);
        }
        if (response?.statusName !== this.requestStatus.Arranged) {
          if (
            response?.statusName === this.requestStatus.Paid ||
            response?.statusName === this.requestStatus.Completed
          ) {
            this.notificationService.showNotification(
              'O pagamento já foi realizado',
              NotificationType.alert,
            );
          } else {
            this.notificationService.showNotification(
              'O serviço ainda não foi realizado, não é possível pagar',
              NotificationType.alert,
            );
          }
          this.router.navigate(['/client/request']);
          return;
        }
        this.requestData = response;
      });
    });
  }

  onPayment() {
    this.isPaymentModalOpen = true;
  }

  onCancelPayment() {
    this.isPaymentModalOpen = false;
  }

  onConfirmPayment(paymentData: paymentData) {
    console.log(paymentData);
    if (this.requestData?.id) {
      this.isPaymenting = true;
      this.maintenanceRequestService.payRequest(this.requestData.id).subscribe({
        next: (res) => {
          this.isPaymenting = false;
          this.notificationService.showNotification(
            'Serviço pago com sucesso!',
            NotificationType.success,
          );
          this.isPaymentModalOpen = false;
          this.router.navigate(['/client/request']);
        },
        error: () => {
          this.isPaymenting = false;
          this.notificationService.showNotification(
            'Erro ao pagar serviço.',
            NotificationType.error,
          );
        },
      });
    }
  }
}
