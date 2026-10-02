import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
  name = 'Eya Mabrouk';
  email = 'eya@example.com';
  role = 'Étudiante en ingénierie informatique';
}
