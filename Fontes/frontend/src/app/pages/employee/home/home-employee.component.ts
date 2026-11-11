import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EmployeeHeaderComponent],
  templateUrl: './home-employee.component.html',
  styleUrl: './home-employee.component.scss',
})
export class HomeEmployeeComponent {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private router = inject(Router);

  readonly openRequestsResource = rxResource({
    stream: () => this.maintenanceRequestService.getOpenRequests(),
    defaultValue: [],
  });

  readonly openRequests = this.openRequestsResource.value;
  readonly isLoading = this.openRequestsResource.isLoading;
  readonly hasError = computed(() => !!this.openRequestsResource.error());
  readonly isEmpty = computed(
    () =>
      !this.isLoading() && !this.hasError() && this.openRequests().length === 0,
  );

  goToQuote(id: number): void {
    this.router.navigate(['/employee/quote', id]);
  }
}
