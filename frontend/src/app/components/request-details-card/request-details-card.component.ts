import { Component, Input } from '@angular/core';
import { MaintenanceRequest, RequestStatus } from '../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe, LowerCasePipe, NgClass } from '@angular/common';
import { getStatusClass } from '../../utils/status-helpers.util';

@Component({
  imports: [DatePipe, LowerCasePipe, CurrencyPipe, NgClass],
  selector: 'app-request-details-card',
  styleUrl: './request-details-card.component.scss',
  templateUrl: './request-details-card.component.html',
})
export class RequestDetailsCardComponent {
  public requestStatus = RequestStatus;
  public getStatusClass = getStatusClass;
  showHistory: boolean = false;

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  @Input({ required: true }) requestData?: MaintenanceRequest;
}
