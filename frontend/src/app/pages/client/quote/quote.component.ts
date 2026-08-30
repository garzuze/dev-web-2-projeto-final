import { Component, inject } from '@angular/core';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest } from '../../../models/maintenanceRequest.model';
import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';

@Component({
  imports: [CurrencyPipe, DatePipe, LowerCasePipe, RejectionModalComponent],
  selector: 'app-quote',
  styleUrl: './quote.component.scss',
  templateUrl: './quote.component.html',
})
export class QuoteComponent {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private activatedRoute = inject(ActivatedRoute);
  public requestData?: MaintenanceRequest;
  public isRejectionModalOpen: boolean = false;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.maintenanceRequestService.getMaintenanceRequestById(id).subscribe((request) => {
        this.requestData = request;
      });
    });
  }
  onReject() {
    this.isRejectionModalOpen = true;
  }
  onCancelReject() {
    this.isRejectionModalOpen = false;
  }
  onConfirmReject($event: string) {
    this.isRejectionModalOpen = false;
    console.log($event);
    if (this.requestData?.id) {
      this.maintenanceRequestService.rejectRequest(this.requestData.id, $event);
    }
  }
}
