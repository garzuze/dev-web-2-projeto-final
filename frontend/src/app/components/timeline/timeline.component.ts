import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MaintenanceRequestHistory } from '../../models/maintenanceRequest.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  imports: [DatePipe, StatusBadgeComponent],
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})
export class TimelineComponent {
  @Input({ required: true }) history: MaintenanceRequestHistory[] = [];

  authorName(item: MaintenanceRequestHistory): string {
    return item.employeeName ?? 'Cliente';
  }
}
