import { Component, OnInit, inject, signal } from '@angular/core';

import { EmployeeService } from '../../../core/employee.service';
import { Employee } from '../../../models/employee.model';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { EmployeeModalComponent } from './employee-modal';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';
import { DatePipe } from '@angular/common';

@Component({
  imports: [
    ConfirmDialogComponent,
    EmployeeModalComponent,
    EmployeeHeaderComponent,
    DatePipe,
  ],
  selector: 'app-employees',
  templateUrl: './employees.component.html',
})
export class EmployeesComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly notifications = inject(NotificationService);

  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(true);
  readonly currentUserId = signal<number | null>(null);

  isFormOpen = false;
  editing: Employee | null = null;

  removing: Employee | null = null;
  isRemoving = false;

  ngOnInit() {
    this.loadCurrentUser();
    this.reload();
  }

  private loadCurrentUser() {
    // depois vamos trocar isso por um auth service ou coisa do tipo
    this.employeeService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.currentUserId.set(user.id);
        }
      },
    });
  }

  reload() {
    this.loading.set(true);
    this.employeeService.list().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notifications.showNotification(
          'Não foi possível carregar os funcionários.',
          NotificationType.error,
        );
      },
    });
  }

  onNew() {
    this.editing = null;
    this.isFormOpen = true;
  }

  onEdit(employee: Employee) {
    this.editing = employee;
    this.isFormOpen = true;
  }

  onFormCancel() {
    this.isFormOpen = false;
  }

  onSaved(saved: Employee) {
    const wasEditing = this.editing !== null;
    this.isFormOpen = false;
    this.notifications.showNotification(
      wasEditing
        ? `Funcionário "${saved.name}" atualizado.`
        : `Funcionário "${saved.name}" criado.`,
      NotificationType.success,
    );
    this.reload();
  }

  onRemove(employee: Employee) {
    if (employee.id === this.currentUserId()) {
      this.notifications.showNotification(
        'Você não pode remover a si.',
        NotificationType.error,
      );
      return;
    }

    this.removing = employee;
  }

  onCancelRemove() {
    this.removing = null;
  }

  onConfirmRemove() {
    if (!this.removing) return;

    const target = this.removing;
    this.isRemoving = true;
    this.employeeService.deactivate(target.id).subscribe({
      next: () => {
        this.isRemoving = false;
        this.removing = null;
        this.notifications.showNotification(
          `Funcionário "${target.name}" removido.`,
          NotificationType.success,
        );
        this.reload();
      },
      error: () => {
        this.isRemoving = false;
        this.removing = null;
        this.notifications.showNotification(
          'Não foi possível remover o funcionário.',
          NotificationType.error,
        );
      },
    });
  }
}
