
import { Component } from '@angular/core';
import { ConferenceDetailComponent } from './components/conference-detail/conference-detail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConferenceDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
