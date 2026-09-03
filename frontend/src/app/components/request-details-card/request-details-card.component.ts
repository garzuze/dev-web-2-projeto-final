import { Component, Input } from '@angular/core';
import { MaintenanceRequest, RequestStatus } from '../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';

@Component({
  imports: [DatePipe, LowerCasePipe, CurrencyPipe],
  selector: 'app-request-details-card',
  styleUrl: './request-details-card.component.scss',
  templateUrl: './request-details-card.component.html',
})
export class RequestDetailsCardComponent {
  public requestStatus = RequestStatus;
  @Input({ required: true }) requestData?: MaintenanceRequest;
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
