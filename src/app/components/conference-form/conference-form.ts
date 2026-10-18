import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Conference } from '../../models/conference';

@Component({
    selector: 'app-conference-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './conference-form.html',
    styleUrl: './conference-form.css'
})
export class ConferenceFormComponent implements OnInit {

    @Input() conference: Conference | null = null;
    @Output() formSubmit = new EventEmitter<Conference>();

    // FormGroup contenant tous les FormControl du formulaire
    conferenceForm!: FormGroup;

    ngOnInit(): void {
        // Création du FormGroup avec des FormControl et des Validators
        this.conferenceForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(3)]),
            description: new FormControl('', [Validators.required, Validators.minLength(10)]),
            date: new FormControl('', [Validators.required]),
            place: new FormControl('', [Validators.required]),
            maxParticipants: new FormControl(1, [Validators.required, Validators.min(1)]),
            nbParticipants: new FormControl(0, [Validators.required, Validators.min(0)])
        });

        // Si une conférence est passée en @Input, on pré-remplit le formulaire (mode édition)
        if (this.conference) {
            this.conferenceForm.patchValue({
                title: this.conference.title,
                description: this.conference.description,
                date: this.formatDate(this.conference.date),
                place: this.conference.place,
                maxParticipants: this.conference.maxParticipants,
                nbParticipants: this.conference.nbParticipants
            });
        }
    }

    // Méthode appelée lors du submit du formulaire
    onSubmit(): void {
        if (this.conferenceForm.valid) {
            const formValue = this.conferenceForm.value;
            const conference: Conference = {
                ...formValue,
                date: new Date(formValue.date)
            };
            this.formSubmit.emit(conference);
        }
    }

    // Formater la date en yyyy-MM-dd pour l'input type="date"
    private formatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
