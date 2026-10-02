import { Component, EventEmitter, Output } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Conference } from '../../models/conference';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css'
})
export class ConferenceList {

  @Output() conferenceSelected = new EventEmitter<Conference>();

  conferences: Conference[] = [
    {
      title: 'Angular 21',
      description: 'Découvrir les nouveautés d’Angular 21',
      date: new Date('2026-10-15'),
      place: 'Tunis',
      maxParticipants: 100,
      nbParticipants: 70
    },
    {
      title: 'Spring Boot',
      description: 'Développement d’applications avec Spring Boot',
      date: new Date('2026-11-10'),
      place: 'Sousse',
      maxParticipants: 50,
      nbParticipants: 45
    },
    {
      title: 'Cloud Computing',
      description: 'Introduction au Cloud',
      date: new Date('2026-12-05'),
      place: 'Sfax',
      maxParticipants: 80,
      nbParticipants: 80
    }
  ];

  selectConference(conference: Conference): void {
    this.conferenceSelected.emit(conference);
  }
}
