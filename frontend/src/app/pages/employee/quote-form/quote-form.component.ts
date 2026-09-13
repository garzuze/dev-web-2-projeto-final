import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest, RequestStatus } from '../../../models/maintenanceRequest.model';
import { RequestDetailsCardComponent } from '../../../components/request-details-card/request-details-card.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RequestDetailsCardComponent],
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
        this.maintenanceRequestService.getMaintenanceRequestById(id).subscribe((request) => {
          if (!request || request.statusName !== RequestStatus.Open) {
            this.notificationService.showNotification(
              'Solicitação inválida ou não está aberta.',
              NotificationType.error,
            );
            this.router.navigate(['/employee/home']);
            return;
          }
          this.requestData = request;
        });
      }
    });
  }

  formatQuoteValue(): void {
    const currentValue = this.quoteForm.get('quoteValue')?.value;
    if (currentValue) {
      const formattedValue = Number(currentValue).toFixed(2);
      this.quoteForm.patchValue({ quoteValue: formattedValue });
    }
  }

  onSubmit(): void {
    if (this.quoteForm.valid && this.requestData) {
      this.isSubmitting = true;
      const value = this.quoteForm.get('quoteValue')?.value;

      this.maintenanceRequestService.quoteRequest(this.requestData.id, value).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.notificationService.showNotification(res.message, NotificationType.success);
          this.router.navigate(['/employee/home']);
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.showNotification(
            'Erro ao salvar orçamento.',
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
