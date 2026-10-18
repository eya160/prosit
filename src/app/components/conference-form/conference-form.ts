import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Conference } from '../../models/conference';
import { participantsValidator, futureDateValidator } from '../../validators/conference.validators';

/**
 * Composant de formulaire réutilisable pour l'ajout/modification de conférences
 *
 * ══════════════════════════════════════════════════════════════
 * PROSIT 2 — Explication des éléments Angular utilisés :
 * ══════════════════════════════════════════════════════════════
 *
 * 1. FormGroup : Regroupe un ensemble de FormControl sous un seul objet.
 *    Permet de manipuler l'état global du formulaire (valid, invalid, dirty...).
 *
 * 2. FormControl : Représente un champ individuel du formulaire.
 *    Chaque FormControl a une valeur, un état de validation, et des événements.
 *
 * 3. Validators : Fonctions de validation intégrées à Angular :
 *    - Validators.required        → Le champ est obligatoire
 *    - Validators.minLength(n)    → Longueur minimale de n caractères
 *    - Validators.maxLength(n)    → Longueur maximale de n caractères
 *    - Validators.min(n)          → Valeur numérique minimale
 *    - Validators.max(n)          → Valeur numérique maximale
 *    - Validators.pattern(regex)  → Doit respecter une expression régulière
 *
 * 4. ValidatorFn personnalisé :
 *    - futureDateValidator()       → Vérifie que la date est dans le futur
 *    - participantsValidator()     → Vérifie que nbParticipants ≤ maxParticipants
 *      (cross-field validator appliqué au FormGroup)
 *
 * 5. ReactiveFormsModule : Module Angular qui fournit les directives
 *    [formGroup] et formControlName pour lier le formulaire au template.
 *
 * 6. @Input() : Permet de recevoir une conférence existante (mode édition)
 * 7. @Output() : Émet un événement lors de la soumission du formulaire valide
 * ══════════════════════════════════════════════════════════════
 */
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

    // Le FormGroup est l'objet central du Reactive Form
    // Il contient tous les FormControl et coordonne la validation globale
    conferenceForm!: FormGroup;

    // Liste des catégories disponibles pour le select
    categories: string[] = [
        'Développement Web',
        'Backend',
        'Frontend',
        'Mobile',
        'Intelligence Artificielle',
        'Infrastructure',
        'Sécurité',
        'Data Science',
        'DevOps',
        'Autre'
    ];

    // Variable pour stocker les données soumises (récupération dans le TS)
    submittedData: Conference | null = null;

    ngOnInit(): void {
        /**
         * Construction du FormGroup avec FormControl et Validators
         *
         * Chaque FormControl est défini avec :
         *   - Une valeur par défaut (1er argument)
         *   - Un tableau de Validators (2ème argument)
         *
         * Le FormGroup accepte un 2ème argument pour les validators cross-field
         * (validateurs qui dépendent de plusieurs champs)
         */
        this.conferenceForm = new FormGroup({
            // Titre : obligatoire, entre 3 et 100 caractères
            title: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ]),

            // Description : obligatoire, entre 10 et 500 caractères
            description: new FormControl('', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(500)
            ]),

            // Catégorie : obligatoire (sélection depuis une liste)
            category: new FormControl('', [
                Validators.required
            ]),

            // Date : obligatoire + doit être dans le futur (validateur personnalisé)
            date: new FormControl('', [
                Validators.required,
                futureDateValidator()
            ]),

            // Lieu : obligatoire, au moins 2 caractères
            place: new FormControl('', [
                Validators.required,
                Validators.minLength(2)
            ]),

            // Nombre max de participants : obligatoire, entre 1 et 10000
            maxParticipants: new FormControl(1, [
                Validators.required,
                Validators.min(1),
                Validators.max(10000)
            ]),

            // Nombre de participants actuels : obligatoire, minimum 0
            nbParticipants: new FormControl(0, [
                Validators.required,
                Validators.min(0)
            ])
        }, {
            // Validateur cross-field appliqué au niveau du FormGroup
            // Vérifie que nbParticipants <= maxParticipants
            validators: participantsValidator()
        });

        // Mode édition : on pré-remplit le formulaire avec les données existantes
        // patchValue() met à jour uniquement les champs spécifiés
        if (this.conference) {
            this.conferenceForm.patchValue({
                title: this.conference.title,
                description: this.conference.description,
                category: this.conference.category,
                date: this.formatDate(this.conference.date),
                place: this.conference.place,
                maxParticipants: this.conference.maxParticipants,
                nbParticipants: this.conference.nbParticipants
            });
        }
    }

    /**
     * Méthode appelée lors de la soumission du formulaire
     * Récupère les valeurs via this.conferenceForm.value (objet JS)
     */
    onSubmit(): void {
        if (this.conferenceForm.valid) {
            // Récupération des données du formulaire dans le TypeScript
            const formValue = this.conferenceForm.value;

            // Construction de l'objet Conference à partir des données du formulaire
            const conference: Conference = {
                ...formValue,
                date: new Date(formValue.date)
            };

            // Stocker les données soumises pour affichage dans le template
            this.submittedData = conference;

            // Émettre l'événement vers le composant parent
            this.formSubmit.emit(conference);
        } else {
            // Marquer tous les champs comme "touched" pour afficher les erreurs
            this.conferenceForm.markAllAsTouched();
        }
    }

    /**
     * Formater la date en yyyy-MM-dd pour l'input type="date"
     */
    private formatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
