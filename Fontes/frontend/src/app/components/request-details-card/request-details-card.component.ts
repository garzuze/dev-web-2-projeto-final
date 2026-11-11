import { Component, Input } from '@angular/core';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  getStatusClass,
  getStatusLabel,
} from '../../utils/status-helpers.util';
import { TimelineComponent } from '../timeline/timeline.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  imports: [DatePipe, CurrencyPipe, TimelineComponent, NgxMaskPipe],
  providers: [provideNgxMask({})],
  selector: 'app-request-details-card',
  styleUrl: './request-details-card.component.scss',
  templateUrl: './request-details-card.component.html',
})
export class RequestDetailsCardComponent {
  public requestStatus = RequestStatus;
  public getStatusClass = getStatusClass;
  public getStatusLabel = getStatusLabel;
  showSensitiveClientData: boolean = false;
  showHistory: boolean = false;

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  toggleSensitiveClientData(): void {
    this.showSensitiveClientData = !this.showSensitiveClientData;
  }

  formatCPF(cpf: string): string {
    if (!cpf) {
      return cpf;
    }
    const digits = cpf.replace(/\D/g, '');
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
  }

  @Input({ required: true }) requestData?: MaintenanceRequest;
  @Input() showClientDetails = false;
}
