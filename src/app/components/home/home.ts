import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { NavbarComponent } from '../navbar/navbar';
import { ProfileComponent } from '../profile/profile';
import { FriendsComponent } from '../friends/friends';
import { NotificationsComponent } from '../notifications/notifications';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    NavbarComponent,
    ProfileComponent,
    FriendsComponent,
    NotificationsComponent,
    FooterComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {}
