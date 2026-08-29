export interface MaintenanceRequest {
  id: number;
  clientId: number;
  categoryId: number;
  statusId: number;
  equipmentDescription: string;
  defectDescription: string;
  openingDateTime: string;
  quoteValue?: number;
  rejectionReason?: string;
  maintenanceDescription?: string;
  clientInstructions?: string;
  paymentDateTime?: string;
}
