import { Injectable, signal } from '@angular/core';
import { NotificationInterface, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public messages = signal<NotificationInterface[]>([]);

  showNotification(message: string, type: NotificationType) {
    let id = Date.now();
    this.messages.update((messages) => [...messages, { message, type, id }]);

    setTimeout(() => {
      this.messages.update((messages) => messages.filter((message) => message.id !== id));
    }, 3000);
  }
}
