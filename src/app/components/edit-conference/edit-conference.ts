import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConferenceFormComponent } from '../conference-form/conference-form';
import { ConferenceService } from '../../services/conference.service';
import { Conference } from '../../models/conference';

@Component({
    selector: 'app-edit-conference',
    standalone: true,
    imports: [ConferenceFormComponent, RouterLink],
    templateUrl: './edit-conference.html',
    styleUrl: './edit-conference.css'
})
export class EditConferenceComponent implements OnInit {

    conference: Conference | null = null;
    private conferenceId!: number;

    constructor(
        private route: ActivatedRoute,
        private conferenceService: ConferenceService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.conferenceId = Number(this.route.snapshot.paramMap.get('id'));
        const found = this.conferenceService.getById(this.conferenceId);
        if (found) {
            this.conference = found;
        } else {
            this.router.navigate(['/']);
        }
    }

    onFormSubmit(updated: Conference): void {
        this.conferenceService.update(this.conferenceId, updated);
        this.router.navigate(['/']);
    }
}
