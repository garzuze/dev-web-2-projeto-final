import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalContainerComponent } from "../../../../components/modal-container/modal-container.component";

@Component({
  imports: [ModalContainerComponent],
  selector: 'app-rescue-modal',
  styleUrl: './rescue-modal.component.scss',
  templateUrl: './rescue-modal.component.html',
})
export class RescueModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Input() isRescuing: boolean = false;
}
