import { Component } from '@angular/core';

import { ConferenceDetailComponent } from './components/conference-detail/conference-detail';
import { ConferenceList } from './components/conference-list/conference-list';
import { Conference } from './models/conference';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConferenceList, ConferenceDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  selectedConference: Conference | null = null;

  onConferenceSelected(conference: Conference): void {
    this.selectedConference = conference;
  }

}
