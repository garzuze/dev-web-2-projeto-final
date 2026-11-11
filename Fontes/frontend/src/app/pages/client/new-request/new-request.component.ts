import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Category, CategoryService } from '../../../core/category.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { ClientHeaderComponent } from '../../../components/client-header/client-header.component';

@Component({
  imports: [ReactiveFormsModule, ClientHeaderComponent],
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
})
export class NewRequestComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly maintenanceRequestService = inject(
    MaintenanceRequestService,
  );
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly equipmentDescriptionMinLength = 10;
  readonly equipmentDescriptionMaxLength = 200;
  readonly defectDescriptionMinLength = 20;
  readonly defectDescriptionMaxLength = 2000;

  readonly categories = signal<Category[]>([]);
  readonly loadingCategories = signal(true);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly noCategoriesAvailable = computed(
    () => !this.loadingCategories() && this.categories().length === 0,
  );

  readonly form = this.formBuilder.group({
    equipmentDescription: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(this.equipmentDescriptionMinLength),
      Validators.maxLength(this.equipmentDescriptionMaxLength),
    ]),
    categoryId: this.formBuilder.control<number | null>(
      null,
      Validators.required,
    ),
    defectDescription: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(this.defectDescriptionMinLength),
      Validators.maxLength(this.defectDescriptionMaxLength),
    ]),
  });

  get equipmentDescription() {
    return this.form.controls.equipmentDescription;
  }

  get categoryId() {
    return this.form.controls.categoryId;
  }

  get defectDescription() {
    return this.form.controls.defectDescription;
  }

  ngOnInit() {
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loadingCategories.set(false);
      },
      error: () => {
        this.loadingCategories.set(false);
        this.notifications.showNotification(
          'Não foi possível carregar as categorias.',
          NotificationType.error,
        );
      },
    });
  }

  submit() {
    this.submitted.set(true);

    if (this.form.invalid || this.noCategoriesAvailable()) {
      return;
    }

    const { equipmentDescription, categoryId, defectDescription } =
      this.form.getRawValue();
    if (categoryId === null) {
      return;
    }

    this.submitting.set(true);
    this.maintenanceRequestService
      .createRequest({
        equipmentDescription: equipmentDescription.trim(),
        categoryId,
        defectDescription: defectDescription.trim(),
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.notifications.showNotification(
            'Solicitação criada com sucesso!',
            NotificationType.success,
          );
          this.router.navigate(['/client/request']);
        },
        error: () => {
          this.submitting.set(false);
          this.notifications.showNotification(
            'Não foi possível criar a solicitação. Tente novamente.',
            NotificationType.error,
          );
        },
      });
  }
}
