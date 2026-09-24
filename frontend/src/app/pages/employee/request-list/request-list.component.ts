import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { getStatusClass } from '../../../utils/status-helpers.util';
import { RouterLink } from '@angular/router';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';

@Component({
  imports: [FormsModule, CommonModule, RouterLink, EmployeeHeaderComponent],
  selector: 'app-request-list',
  styleUrl: './request-list.component.scss',
  templateUrl: './request-list.component.html',
})
export class RequestListComponent implements OnInit {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  filter: string = 'every';
  filterDataStart: string = '';
  filterDataEnd: string = '';
  requestsData: MaintenanceRequest[] = [];
  filteredRequests: MaintenanceRequest[] = [];
  requestStatus = RequestStatus;
  getStatusClass = getStatusClass;

  ngOnInit(): void {
    this.maintenanceRequestService.getAllRequests().subscribe({
      next: (requests) => {
        if (requests) {
          this.requestsData = requests;
          this.filteredRequests = this.requestsData;
        }
      },
    });
  }

  onFilterChange() {
    if (this.filter === 'every') {
      this.filteredRequests = this.requestsData;
    } else if (this.filter === 'today') {
      const today = new Date().toDateString();
      this.filteredRequests = this.requestsData.filter(
        (r) => new Date(r.openingDateTime).toDateString() === today,
      );
    } else if (this.filter === 'period') {
      this.filteredRequests = this.requestsData.filter((r) => {
        const reqDate = new Date(r.openingDateTime).getTime();
        const start = new Date(this.filterDataStart).getTime();
        const end = new Date(this.filterDataEnd).getTime() + 86400000;
        return reqDate >= start && reqDate <= end;
      });
    }
  }
}
