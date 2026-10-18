import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConferenceFormComponent } from '../conference-form/conference-form';
import { ConferenceService } from '../../services/conference.service';
import { Conference } from '../../models/conference';

@Component({
    selector: 'app-add-conference',
    standalone: true,
    imports: [ConferenceFormComponent, RouterLink],
    templateUrl: './add-conference.html',
    styleUrl: './add-conference.css'
})
export class AddConferenceComponent {

    constructor(
        private conferenceService: ConferenceService,
        private router: Router
    ) { }

    onFormSubmit(conference: Conference): void {
        this.conferenceService.add(conference);
        this.router.navigate(['/']);
    }
}
