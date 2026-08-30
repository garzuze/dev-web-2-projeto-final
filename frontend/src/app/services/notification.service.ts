import { Injectable, Service, signal } from '@angular/core';
import { NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public message = signal<{ message: string; type: NotificationType } | null>(null);

  showNotification(message: string, type: NotificationType) {
    this.message.set({ message: message, type: type });

    setTimeout(() => {
      this.message.set(null);
    }, 3000);
  }
}
