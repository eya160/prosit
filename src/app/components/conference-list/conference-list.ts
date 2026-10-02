import { Component } from '@angular/core';
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
    },
    {
      title: 'Ancienne conférence',
      description: 'Cette conférence ne doit pas apparaître',
      date: new Date('2025-01-10'),
      place: 'Tunis',
      maxParticipants: 50,
      nbParticipants: 20
    }
  ];

  get upcomingConferences(): Conference[] {
    const today = new Date();

    return this.conferences.filter(
      conference => new Date(conference.date) >= today
    );
  }

  getRemainingPlaces(conference: Conference): number {
    return conference.maxParticipants - conference.nbParticipants;
  }
}
