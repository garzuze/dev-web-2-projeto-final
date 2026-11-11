import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalContainerComponent } from '../../../../components/modal-container/modal-container.component';

@Component({
  imports: [ModalContainerComponent],
  selector: 'app-rejection-modal',
  styleUrl: './rejection-modal.component.scss',
  templateUrl: './rejection-modal.component.html',
})
export class RejectionModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();
  @Input() isRejecting = false;
}
