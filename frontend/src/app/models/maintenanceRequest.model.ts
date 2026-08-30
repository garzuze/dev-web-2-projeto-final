export enum RequestStatus {
  Open = 'ABERTA',
  Quoted = 'ORÇADA',
  Rejected = 'REJEITADA',
  Approved = 'APROVADA',
  Redirected = 'REDIRECIONADA',
  Arranged = 'ARRUMADA',
  Paid = 'PAGA',
  Completed = 'FINALIZADA',
}

export interface MaintenanceRequest {
  id: number;
  clientName: string;
  categoryName: string;
  statusName: RequestStatus;
  equipmentDescription: string;
  defectDescription: string;
  openingDateTime: string;
  quoteValue?: number;
  rejectionReason?: string;
  maintenanceDescription?: string;
  clientInstructions?: string;
  paymentDateTime?: string;
}
