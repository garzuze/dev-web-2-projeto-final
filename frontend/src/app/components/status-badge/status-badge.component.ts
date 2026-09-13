import { Component, Input } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

import { RequestStatus } from '../../models/maintenanceRequest.model';

const STATUS_CLASSES: Record<RequestStatus, string> = {
  [RequestStatus.Open]: 'bg-gray-100 text-gray-800',
  [RequestStatus.Quoted]: 'bg-amber-800/10 text-amber-900',
  [RequestStatus.Rejected]: 'bg-red-100 text-red-800',
  [RequestStatus.Approved]: 'bg-yellow-100 text-yellow-800',
  [RequestStatus.Redirected]: 'bg-purple-100 text-purple-800',
  [RequestStatus.Arranged]: 'bg-blue-100 text-blue-800',
  [RequestStatus.Paid]: 'bg-orange-100 text-orange-800',
  [RequestStatus.Completed]: 'bg-emerald-100 text-emerald-800',
};

@Component({
  imports: [LowerCasePipe],
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: RequestStatus;

  get statusClass(): string {
    return STATUS_CLASSES[this.status] ?? 'bg-gray-100 text-gray-800';
  }
}
