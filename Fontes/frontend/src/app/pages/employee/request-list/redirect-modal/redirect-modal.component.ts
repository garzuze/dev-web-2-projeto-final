import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalContainerComponent } from '../../../../components/modal-container/modal-container.component';
import { Employee } from '../../../../models/employee.model';
import { MaintenanceRequest } from '../../../../models/maintenanceRequest.model';

@Component({
  selector: 'app-redirect-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalContainerComponent],
  templateUrl: './redirect-modal.component.html',
})
export class RedirectModalComponent {
  @Input() request?: MaintenanceRequest;
  @Input() employees: Employee[] = [];
  @Input() isRedirecting = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();

  selectedEmployeeId: number | null = null;
}
