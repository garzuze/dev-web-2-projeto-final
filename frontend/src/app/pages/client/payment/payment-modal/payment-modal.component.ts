import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalContainerComponent } from '../../../../components/modal-container/modal-container.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { paymentData } from '../../../../models/payment.model';

@Component({
  imports: [ModalContainerComponent, ReactiveFormsModule],
  selector: 'app-payment-modal',
  styleUrl: './payment-modal.component.scss',
  templateUrl: './payment-modal.component.html',
})
export class PaymentModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<paymentData>();
  @Input() isPaymenting: boolean = false;

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['PIX', Validators.required],
      cardNumber: [''],
      cardHolder: [''],
      expiryDate: [''],
      cvv: [''],
    });
  }

  onSubmit() {
    if (this.paymentForm?.valid) {
      this.confirm.emit(this.paymentForm.value);
    }
  }
}
