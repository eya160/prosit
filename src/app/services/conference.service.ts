import { Injectable } from '@angular/core';
import { Conference } from '../models/conference';

@Injectable({
    providedIn: 'root'
})
export class ConferenceService {

    private nextId = 4;

    private conferences: Conference[] = [
        {
            id: 1,
            title: 'Angular 21',
            description: 'Découvrir les nouveautés d\'Angular 21',
            date: new Date('2026-10-15'),
            place: 'Tunis',
            maxParticipants: 100,
            nbParticipants: 70
        },
        {
            id: 2,
            title: 'Spring Boot',
            description: 'Développement d\'applications avec Spring Boot',
            date: new Date('2026-11-10'),
            place: 'Sousse',
            maxParticipants: 50,
            nbParticipants: 45
        },
        {
            id: 3,
            title: 'Cloud Computing',
            description: 'Introduction au Cloud',
            date: new Date('2026-12-05'),
            place: 'Sfax',
            maxParticipants: 80,
            nbParticipants: 80
        }
    ];

    getAll(): Conference[] {
        return this.conferences;
    }

    getById(id: number): Conference | undefined {
        return this.conferences.find(c => c.id === id);
    }

    add(conference: Conference): void {
        conference.id = this.nextId++;
        this.conferences.push(conference);
    }

    update(id: number, updated: Conference): void {
        const index = this.conferences.findIndex(c => c.id === id);
        if (index !== -1) {
            this.conferences[index] = { ...updated, id };
        }
    }
}
