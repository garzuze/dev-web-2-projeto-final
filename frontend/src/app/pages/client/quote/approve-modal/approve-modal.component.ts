import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-approve-modal',
  styleUrl: './approve-modal.component.scss',
  templateUrl: './approve-modal.component.html',
})
export class ApproveModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
