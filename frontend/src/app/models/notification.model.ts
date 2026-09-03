export enum NotificationType {
  success = 'Sucesso',
  error = 'Erro',
  alert = 'Alerta',
}

export interface NotificationInterface {
  id: number;
  message: string;
  type: NotificationType;
}
