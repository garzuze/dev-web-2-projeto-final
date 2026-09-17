import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Employee } from '../../../../models/employee.model';
import { EmployeeService } from '../../../../core/employee.service';
import { ModalContainerComponent } from '../../../../components/modal-container/modal-container.component';

@Component({
  imports: [ModalContainerComponent, ReactiveFormsModule],
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
})
export class EmployeeModalComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);

  @Input() employee: Employee | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Employee>();

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
  });

  get name() {
    return this.form.controls.name;
  }

  get email() {
    return this.form.controls.email;
  }

  get birthDate() {
    return this.form.controls.birthDate;
  }

  ngOnInit() {
    if (this.employee) {
      this.form.setValue({
        name: this.employee.name,
        email: this.employee.email,
        birthDate: this.employee.birthDate,
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, birthDate } = this.form.getRawValue();
    this.saving.set(true);
    this.errorMessage.set('');

    const request = this.employee
      ? this.employeeService.update(this.employee.id, name.trim(), email.trim(), birthDate)
      : this.employeeService.create(name.trim(), email.trim(), birthDate);

    request.subscribe({
      next: (employee) => {
        this.saving.set(false);
        this.saved.emit(employee);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set("Erro ao cadastrar funcionário!");
      },
    });
  }
}
