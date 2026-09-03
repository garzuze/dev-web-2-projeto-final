import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalContainerComponent } from '../../../../components/modal-container/modal-container.component';

@Component({
  imports: [ModalContainerComponent],
  selector: 'app-approve-modal',
  styleUrl: './approve-modal.component.scss',
  templateUrl: './approve-modal.component.html',
})
export class ApproveModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Input() isApproving = false;
}
