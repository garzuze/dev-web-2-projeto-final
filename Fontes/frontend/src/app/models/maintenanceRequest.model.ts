export enum RequestStatus {
  Open = 'ABERTA',
  Quoted = 'ORCADA',
  Rejected = 'REJEITADA',
  Approved = 'APROVADA',
  Redirected = 'REDIRECIONADA',
  Arranged = 'ARRUMADA',
  Paid = 'PAGA',
  Completed = 'FINALIZADA',
}

export interface MaintenanceRequest {
  id: number;
  openingDateTime: string;
  statusName: RequestStatus;

  clientId: number;
  clientName: string;
  clientDetails?: ClientDetails | null;

  categoryName: string;
  equipmentDescription: string;
  defectDescription: string;

  quoteValue?: number;
  rejectionReason?: string;

  currentEmployeeName?: string;
  maintenanceDateTime?: string;
  maintenanceEmployeeName?: string;
  maintenanceDescription?: string;
  clientInstructions?: string;

  paymentDateTime?: string;
  completionDateTime?: string;
  completionEmployeeName?: string;

  history: MaintenanceRequestHistory[];
}

export interface MaintenanceRequestHistory {
  id: number;
  requestId: number;
  dateTime: string;

  previousStatus?: RequestStatus;
  newStatus: RequestStatus;

  employeeName?: string;
  destinationEmployeeName?: string;

  notes?: string;
}

export interface ClientAddress {
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
}

export interface ClientDetails {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address?: ClientAddress | null;
}
