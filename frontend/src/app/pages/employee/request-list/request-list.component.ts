import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
import { RedirectModalComponent } from './redirect-modal/redirect-modal.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { EmployeeService } from '../../../core/employee.service';
import { AuthService } from '../../../core/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { Employee } from '../../../models/employee.model';
import { NotificationType } from '../../../models/notification.model';

@Component({
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    EmployeeHeaderComponent,
    RedirectModalComponent,
    ConfirmDialogComponent,
  ],
  selector: 'app-request-list',
  styleUrl: './request-list.component.scss',
  templateUrl: './request-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RequestListComponent implements OnInit {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  filter: EmployeeRequestFilter = 'ALL';
  filterDataStart: string = '';
  filterDataEnd: string = '';
  readonly filteredRequests = signal<MaintenanceRequest[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly dateError = signal('');
  readonly requestStatus = RequestStatus;

  isRedirectModalOpen = false;
  isRedirecting = false;
  selectedRequestForRedirect: MaintenanceRequest | null = null;
  availableEmployees: Employee[] = [];

  selectedRequestForFinish: MaintenanceRequest | null = null;
  isFinishing = false;

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

  openRedirectModal(request: MaintenanceRequest): void {
    this.selectedRequestForRedirect = request;
    const currentUserId = this.authService.currentUser?.id;

    this.employeeService.list().subscribe({
      next: (employees) => {
        this.availableEmployees = employees.filter(
          (emp) => emp.id !== currentUserId,
        );
        this.isRedirectModalOpen = true;
      },
      error: () => {
        this.notificationService.showNotification(
          'Não foi possível carregar a lista de funcionários.',
          NotificationType.error,
        );
      },
    });
  }

  cancelRedirect(): void {
    this.isRedirectModalOpen = false;
    this.selectedRequestForRedirect = null;
  }

  confirmRedirect(destinationEmployeeId: number): void {
    if (!this.selectedRequestForRedirect) return;

    const requestId = this.selectedRequestForRedirect.id;
    this.isRedirecting = true;

    this.maintenanceRequestService
      .redirectRequest(requestId, destinationEmployeeId)
      .subscribe({
        next: (updated) => {
          this.isRedirecting = false;
          this.isRedirectModalOpen = false;

          const destEmployee = this.availableEmployees.find(
            (e) => e.id === destinationEmployeeId,
          );
          const destName = destEmployee ? destEmployee.name : 'outro funcionário';

          this.notificationService.showNotification(
            `Solicitação #${updated.id} redirecionada com sucesso para ${destName}.`,
            NotificationType.success,
          );

          this.selectedRequestForRedirect = null;
          // Recarrega as solicitações para atualizar a tabela conforme filtros
          this.loadRequests();
        },
        error: (err: HttpErrorResponse) => {
          this.isRedirecting = false;
          this.notificationService.showNotification(
            problemMessage(err, 'Erro ao redirecionar a solicitação.'),
            NotificationType.error,
          );
        },
      });
  }

  openFinish(request: MaintenanceRequest): void {
    this.selectedRequestForFinish = request;
  }

  cancelFinish(): void {
    this.selectedRequestForFinish = null;
  }

  confirmFinish(): void {
    if (!this.selectedRequestForFinish || this.isFinishing) return;

    this.isFinishing = true;
    this.maintenanceRequestService
      .finishRequest(this.selectedRequestForFinish.id)
      .subscribe({
        next: (updated) => {
          this.isFinishing = false;
          this.selectedRequestForFinish = null;
          this.notificationService.showNotification(
            `Solicitação #${updated.id} finalizada com sucesso.`,
            NotificationType.success,
          );
          this.loadRequests();
        },
        error: (err: HttpErrorResponse) => {
          this.isFinishing = false;
          this.notificationService.showNotification(
            problemMessage(err, 'Erro ao finalizar a solicitação.'),
            NotificationType.error,
          );
        },
      });
  }
}
