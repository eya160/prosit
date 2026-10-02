import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent {
  notifications = [
    'Nouvelle conférence disponible',
    'Votre inscription est confirmée',
    'Une conférence commence bientôt'
  ];
}
