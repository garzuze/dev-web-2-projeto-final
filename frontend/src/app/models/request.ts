export type RequestStatus =
  | 'ABERTA'
  | 'ORÇADA'
  | 'REJEITADA'
  | 'APROVADA'
  | 'REDIRECIONADA'
  | 'ARRUMADA'
  | 'PAGA'
  | 'FINALIZADA';

export interface RequestHistory {
  dateTime: Date;
  previousStatus?: RequestStatus;
  newStatus: RequestStatus;
  sourceEmployeeId?: number;
  destinationEmployeeId?: number;
  notes?: string;
}

export interface Request {
  id: number;
  customerId: number;
  equipmentDescription: string;
  equipmentCategory: string;
  defectDescription: string;
  creationDateTime: Date;
  currentStatus: RequestStatus;

  // Quote
  quoteAmount?: number;
  rejectionReason?: string;

  // Maintenance
  maintenanceDescription?: string;
  customerInstructions?: string;
  maintenanceDateTime?: Date;
  maintenanceEmployeeId?: number;

  // Payment/Completion
  paymentDateTime?: Date;
  completionDateTime?: Date;
  completionEmployeeId?: number;

  history: RequestHistory[];
}
