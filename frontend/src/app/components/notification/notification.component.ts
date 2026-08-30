import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../models/notification.model';

@Component({
  imports: [],
  selector: 'app-notification',
  styleUrl: './notification.component.scss',
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  notificationType = NotificationType;
}
