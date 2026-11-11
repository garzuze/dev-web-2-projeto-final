import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { problemMessage } from '../../../core/api';
import { AuthService } from '../../../core/auth.service';
import { EmployeeService } from '../../../core/employee.service';
import { Employee } from '../../../models/employee.model';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { NotificationType } from '../../../models/notification.model';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { NotificationService } from '../../../services/notification.service';
import { RedirectModalComponent } from '../request-list/redirect-modal/redirect-modal.component';

const REQUESTS_PATH = '/employee/requests';

// Mesmas regras do PerformMaintenanceRequest do backend: obrigatório (sem
// aceitar só espaços) e no máximo 500 caracteres.
const TEXT_MAX_LENGTH = 500;
const textValidators = [
  Validators.required,
  Validators.pattern(/\S/),
  Validators.maxLength(TEXT_MAX_LENGTH),
];

@Component({
  imports: [
    ReactiveFormsModule,
    RequestDetailsCardComponent,
    EmployeeHeaderComponent,
    RedirectModalComponent,
  ],
  selector: 'app-maintenance-form',
  templateUrl: './maintenance-form.component.html',
})
export class MaintenanceFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly maintenanceRequestService = inject(
    MaintenanceRequestService,
  );
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly textMaxLength = TEXT_MAX_LENGTH;
  readonly requestData = signal<MaintenanceRequest | null>(null);
  readonly submitting = signal(false);
  readonly submitted = signal(false);

  // Redirecionamento (RF015), feito pelo modal da lista de solicitações.
  readonly availableEmployees = signal<Employee[]>([]);
  readonly loadingEmployees = signal(false);
  readonly redirectModalOpen = signal(false);
  readonly redirecting = signal(false);

  readonly form = this.formBuilder.group({
    maintenanceDescription: this.formBuilder.nonNullable.control(
      '',
      textValidators,
    ),
    customerInstructions: this.formBuilder.nonNullable.control(
      '',
      textValidators,
    ),
  });

  get maintenanceDescription() {
    return this.form.controls.maintenanceDescription;
  }

  get customerInstructions() {
    return this.form.controls.customerInstructions;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!Number.isInteger(id) || id <= 0) {
        this.leaveWithError('Solicitação não encontrada.');
        return;
      }
      this.loadRequest(id);
    });
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  submit(): void {
    this.submitted.set(true);
    const request = this.requestData();
    if (this.form.invalid || !request || this.submitting()) {
      return;
    }

    const { maintenanceDescription, customerInstructions } =
      this.form.getRawValue();

    this.submitting.set(true);
    this.maintenanceRequestService
      .performMaintenance(
        request.id,
        maintenanceDescription.trim(),
        customerInstructions.trim(),
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.notificationService.showNotification(
            `Manutenção da solicitação #${request.id} registrada com sucesso.`,
            NotificationType.success,
          );
          this.router.navigate([REQUESTS_PATH]);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.notificationService.showNotification(
            problemMessage(err, 'Não foi possível registrar a manutenção.'),
            NotificationType.error,
          );
        },
      });
  }

  cancel(): void {
    this.router.navigate([REQUESTS_PATH]);
  }

  openRedirectModal(): void {
    if (this.loadingEmployees()) {
      return;
    }
    const currentUserId = this.authService.currentUser?.id;

    this.loadingEmployees.set(true);
    this.employeeService.list().subscribe({
      next: (employees) => {
        // Não dá para redirecionar para si mesmo (RF015).
        this.availableEmployees.set(
          employees.filter((employee) => employee.id !== currentUserId),
        );
        this.loadingEmployees.set(false);
        this.redirectModalOpen.set(true);
      },
      error: () => {
        this.loadingEmployees.set(false);
        this.notificationService.showNotification(
          'Não foi possível carregar a lista de funcionários.',
          NotificationType.error,
        );
      },
    });
  }

  closeRedirectModal(): void {
    this.redirectModalOpen.set(false);
  }

  confirmRedirect(destinationEmployeeId: number): void {
    const request = this.requestData();
    if (!request || this.redirecting()) {
      return;
    }

    this.redirecting.set(true);
    this.maintenanceRequestService
      .redirectRequest(request.id, destinationEmployeeId)
      .subscribe({
        next: () => {
          const destination = this.availableEmployees().find(
            (employee) => employee.id === destinationEmployeeId,
          );
          this.redirecting.set(false);
          this.notificationService.showNotification(
            `Solicitação #${request.id} redirecionada com sucesso para ${destination?.name ?? 'outro funcionário'}.`,
            NotificationType.success,
          );
          this.router.navigate([REQUESTS_PATH]);
        },
        error: (err: HttpErrorResponse) => {
          this.redirecting.set(false);
          this.notificationService.showNotification(
            problemMessage(err, 'Erro ao redirecionar a solicitação.'),
            NotificationType.error,
          );
        },
      });
  }

  private loadRequest(id: number): void {
    this.maintenanceRequestService.getEmployeeRequestById(id).subscribe({
      next: (request) => {
        if (
          request.statusName !== RequestStatus.Approved &&
          request.statusName !== RequestStatus.Redirected
        ) {
          this.leaveWithError(
            'Esta solicitação não está disponível para manutenção.',
          );
          return;
        }
        this.requestData.set(request);
      },
      error: (err: HttpErrorResponse) =>
        this.leaveWithError(problemMessage(err, 'Solicitação não encontrada.')),
    });
  }

  private leaveWithError(message: string): void {
    this.notificationService.showNotification(message, NotificationType.error);
    this.router.navigate([REQUESTS_PATH]);
  }
}
