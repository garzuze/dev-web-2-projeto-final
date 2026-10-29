import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { problemMessage } from '../../../core/api';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';

@Component({
  selector: 'app-quote-form',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RequestDetailsCardComponent,
    EmployeeHeaderComponent,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask({})],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.scss',
})
export class QuoteFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  public requestData?: MaintenanceRequest;
  public quoteForm!: FormGroup;
  public isSubmitting = false;

  ngOnInit(): void {
    this.quoteForm = this.fb.group({
      quoteValue: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.maintenanceRequestService.getEmployeeRequestById(id).subscribe({
          next: (request) => {
            if (!request || request.statusName !== RequestStatus.Open) {
              this.notificationService.showNotification(
                'Solicitação inválida ou não está aberta.',
                NotificationType.error,
              );
              this.router.navigate(['/employee/home']);
              return;
            }
            this.requestData = request;
          },
          error: (err) => {
            this.notificationService.showNotification(
              problemMessage(err, 'Solicitação não encontrada.'),
              NotificationType.error,
            );
            this.router.navigate(['/employee/home']);
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (this.quoteForm.valid && this.requestData) {
      this.isSubmitting = true;
      const value = Number(this.quoteForm.get('quoteValue')?.value);
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);

      this.maintenanceRequestService
        .quoteRequest(this.requestData.id, value)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.notificationService.showNotification(
              `Orçamento registrado no valor de ${formattedValue}`,
              NotificationType.success,
            );
            this.router.navigate(['/employee/home']);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.notificationService.showNotification(
              problemMessage(err, 'Erro ao salvar orçamento.'),
              NotificationType.error,
            );
          },
        });
    } else {
      this.quoteForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/employee/home']);
  }
}
