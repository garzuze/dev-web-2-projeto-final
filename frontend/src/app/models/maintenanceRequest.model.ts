export interface MaintenanceRequest {
  id: number;
  clientName: string;
  categoryName: string;
  statusName: string;
  equipmentDescription: string;
  defectDescription: string;
  openingDateTime: string;
  quoteValue?: number;
  rejectionReason?: string;
  maintenanceDescription?: string;
  clientInstructions?: string;
  paymentDateTime?: string;
}
