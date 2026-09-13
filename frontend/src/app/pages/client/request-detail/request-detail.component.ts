import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { MaintenanceRequest, RequestStatus } from '../../../models/maintenanceRequest.model';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { ClientHeaderComponent } from '../../../components/client-header/client-header.component';

@Component({
  imports: [RequestDetailsCardComponent, RouterLink, ClientHeaderComponent],
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
})
export class RequestDetailComponent {
  private readonly maintenanceRequestService = inject(MaintenanceRequestService);
  private readonly notificationService = inject(NotificationService);
  private readonly auth = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public requestData?: MaintenanceRequest;
  public requestStatus = RequestStatus;

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

        const currentUser = this.auth.currentUser;
        if (currentUser?.profile === 'CUSTOMER' && request.clientId !== currentUser.id) {
          this.notificationService.showNotification(
            'Você não tem permissão para acessar esta solicitação.',
            NotificationType.error,
          );
          this.router.navigate(['/client/request']);
          return;
        }

        this.requestData = request;
      });
    });
  }
}
