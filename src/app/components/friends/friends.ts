import { Component } from '@angular/core';

@Component({
  selector: 'app-friends',
  standalone: true,
  templateUrl: './friends.html',
  styleUrl: './friends.css'
})
export class FriendsComponent {
  friends = ['Mouna', 'Sarra', 'Ahmed', 'Yassine'];
}
