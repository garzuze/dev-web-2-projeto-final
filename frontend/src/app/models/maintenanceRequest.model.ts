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
  // Dados Básicos
  id: number;
  openingDateTime: string;
  statusName: RequestStatus;

  // Cliente
  clientId: number;
  clientName: string;
  clientDetails?: ClientDetails | null;

  // Equipamento e Defeito
  categoryName: string;
  equipmentDescription: string;
  defectDescription: string;

  // Orçamento
  quoteValue?: number;
  rejectionReason?: string;

  // Manutenção
  currentEmployeeName?: string;
  maintenanceDateTime?: string;
  maintenanceEmployeeName?: string;
  maintenanceDescription?: string;
  clientInstructions?: string;

  // Pagamentos e Finalização
  paymentDateTime?: string;
  completionDateTime?: string;
  completionEmployeeName?: string;

  // Histórioco
  history: MaintenanceRequestHistory[];
}

export interface MaintenanceRequestHistory {
  // Identificação
  id: number;
  requestId: number;
  dateTime: string;

  // Transição de Estado
  previousStatus?: RequestStatus;
  newStatus: RequestStatus;

  // Envolvidos
  employeeName?: string;
  destinationEmployeeName?: string;

  // Informações Adicionais
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
