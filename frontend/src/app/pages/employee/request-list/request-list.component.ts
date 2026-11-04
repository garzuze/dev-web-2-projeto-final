import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import {
  EmployeeRequestFilter,
  MaintenanceRequestService,
} from '../../../services/maintenance-request.service';
import {
  getStatusClass,
  getStatusLabel,
} from '../../../utils/status-helpers.util';
import { RouterLink } from '@angular/router';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';
import { HttpErrorResponse } from '@angular/common/http';
import { problemMessage } from '../../../core/api';

@Component({
  imports: [FormsModule, CommonModule, RouterLink, EmployeeHeaderComponent],
  selector: 'app-request-list',
  styleUrl: './request-list.component.scss',
  templateUrl: './request-list.component.html',
})
export class RequestListComponent implements OnInit {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  filter: EmployeeRequestFilter = 'ALL';
  filterDataStart: string = '';
  filterDataEnd: string = '';
  readonly filteredRequests = signal<MaintenanceRequest[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly dateError = signal('');
  readonly requestStatus = RequestStatus;

  getStatusClass = getStatusClass;
  getStatusLabel = getStatusLabel;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.maintenanceRequestService
      .getAllRequests(this.filter, this.filterDataStart, this.filterDataEnd)
      .subscribe({
        next: (requests) => {
          this.filteredRequests.set(requests);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.filteredRequests.set([]);
          this.loading.set(false);
          this.errorMessage.set(
            problemMessage(err, 'Não foi possível carregar as solicitações.'),
          );
        },
      });
  }

  onFilterChange(): void {
    this.dateError.set('');
    if (this.filter !== 'PERIOD') {
      this.filterDataStart = '';
      this.filterDataEnd = '';
    }
    this.loadRequests();
  }

  onPeriodDateChange(): void {
    if (
      this.filterDataStart &&
      this.filterDataEnd &&
      this.filterDataStart > this.filterDataEnd
    ) {
      this.dateError.set(
        'A data de início não pode ser posterior à data de fim.',
      );
      return;
    }
    this.dateError.set('');
    this.loadRequests();
  }
}
