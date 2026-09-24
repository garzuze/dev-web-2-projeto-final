import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/auth.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { RequestStatus } from '../../../models/maintenanceRequest.model';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge.component';
import { ClientHeaderComponent } from '../../../components/client-header/client-header.component';

const EQUIPMENT_DESCRIPTION_PREVIEW_LENGTH = 30;

@Component({
  imports: [DatePipe, RouterLink, StatusBadgeComponent, ClientHeaderComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly auth = inject(AuthService);
  private readonly maintenanceRequestService = inject(
    MaintenanceRequestService,
  );

  readonly requestStatus = RequestStatus;

  readonly requestsResource = rxResource({
    params: () => this.auth.currentUser?.id ?? 0,
    stream: ({ params: clientId }) =>
      this.maintenanceRequestService.getMaintenanceRequestsByClientId(clientId),
    defaultValue: [],
  });

  readonly requests = this.requestsResource.value;
  readonly isLoading = this.requestsResource.isLoading;
  readonly isEmpty = computed(
    () => !this.isLoading() && this.requests().length === 0,
  );

  truncateEquipmentDescription(description: string): string {
    return description.length > EQUIPMENT_DESCRIPTION_PREVIEW_LENGTH
      ? `${description.slice(0, EQUIPMENT_DESCRIPTION_PREVIEW_LENGTH)}...`
      : description;
  }
}
