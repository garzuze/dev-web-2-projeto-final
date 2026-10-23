import { RequestStatus } from '../models/maintenanceRequest.model';

const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.Open]: 'Aberta',
  [RequestStatus.Quoted]: 'Orçada',
  [RequestStatus.Rejected]: 'Rejeitada',
  [RequestStatus.Approved]: 'Aprovada',
  [RequestStatus.Redirected]: 'Redirecionada',
  [RequestStatus.Arranged]: 'Arrumada',
  [RequestStatus.Paid]: 'Paga',
  [RequestStatus.Completed]: 'Finalizada',
};

/** Nome de exibição do estado (com acento), no lugar do código da API. */
export function getStatusLabel(status?: string): string {
  return STATUS_LABELS[status as RequestStatus] ?? status ?? '';
}

export function getStatusClass(status?: string): string {
  switch (status) {
    case RequestStatus.Open:
      return 'bg-gray-100 text-gray-800';
    case RequestStatus.Quoted:
      return 'bg-amber-800/10 text-amber-900';
    case RequestStatus.Rejected:
      return 'bg-red-100 text-red-800';
    case RequestStatus.Approved:
      return 'bg-yellow-100 text-yellow-800';
    case RequestStatus.Redirected:
      return 'bg-purple-100 text-purple-800';
    case RequestStatus.Arranged:
      return 'bg-blue-100 text-blue-800';
    case RequestStatus.Paid:
      return 'bg-orange-100 text-orange-800';
    case RequestStatus.Completed:
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
