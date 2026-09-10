import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalContainerComponent } from '../modal-container/modal-container.component';

@Component({
  imports: [ModalContainerComponent],
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirmar';
  @Input({ required: true }) message = '';
  @Input() confirmLabel = 'Confirmar';
  @Input() busyLabel = 'Aguarde...';
  @Input() busy = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
