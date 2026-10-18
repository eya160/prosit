import { Component } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Conference } from '../../models/conference';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css'
})
export class ConferenceList {

  conferences: Conference[] = [];

  constructor(private conferenceService: ConferenceService) {
    this.conferences = this.conferenceService.getAll();
  }
}
