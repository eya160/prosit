import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    signal,
    computed,
    effect,
} from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Conference } from '../../models/conference';
import {
    participantsValidator,
    futureDateValidator,
} from '../../validators/conference.validators';

/**
 * ══════════════════════════════════════════════════════════
 * PROSIT 3 — Reactive Forms + Signals (Angular 21)
 * ══════════════════════════════════════════════════════════
 *
 * PROBLÈME identifié avec valueChanges / statusChanges :
 * ─────────────────────────────────────────────────────────
 * • Ce sont des Observables RxJS → nécessitent subscribe() / unsubscribe()
 * • Risque de memory leaks si on oublie de se désabonner
 * • Déclenchent la détection des changements sur TOUTE l'arborescence
 *   (Zone.js) → performance dégradée sur les grands formulaires
 *
 * SOLUTION avec les Signals (Angular 21) :
 * ─────────────────────────────────────────
 * • signal<T>()   → valeur réactive primitive, la source de vérité
 * • computed()    → valeur dérivée recalculée automatiquement
 *                   uniquement quand ses dépendances changent (granulaire)
 * • effect()      → effet de bord exécuté quand un Signal change
 * • toSignal()    → convertit un Observable en Signal (bridge RxJS ↔ Signals)
 *
 * La détection des changements est LOCALE (Signal Graph) :
 * seuls les composants lisant le Signal concerné sont mis à jour → Performant !
 * ══════════════════════════════════════════════════════════
 */
@Component({
    selector: 'app-conference-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './conference-form.html',
    styleUrl: './conference-form.css',
})
export class ConferenceFormComponent implements OnInit {
    @Input() conference: Conference | null = null;
    @Output() formSubmit = new EventEmitter<Conference>();

    // ─── FormGroup (Prosit 2 conservé) ────────────────────────
    conferenceForm!: FormGroup;

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
        'Autre',
    ];

    submittedData: Conference | null = null;

    // ─── Signals manuels (source de vérité) ───────────────────
    /**
     * signal<string>('') : Signal mutable contenant la valeur du champ titre.
     * Mis à jour à chaque frappe via (input) dans le template.
     * Alternative : toSignal(this.conferenceForm.get('title')!.valueChanges)
     */
    titleValue = signal<string>('');
    descriptionValue = signal<string>('');

    /**
     * formValid : Signal dérivé de l'état Angular Forms via toSignal().
     * toSignal() convertit l'Observable statusChanges en Signal.
     *
     * Avantage vs subscribe() :
     * • Pas de unsubscribe() à gérer (nettoyage automatique avec l'injection context)
     * • Intégré dans le Signal Graph → mise à jour granulaire
     */
    formValid!: ReturnType<typeof signal<boolean>>;

    // ─── Computed Signals (valeurs dérivées) ───────────────────
    /**
     * computed() : Recalcule automatiquement quand titleValue() change.
     * Jamais besoin d'appeler la fonction manuellement.
     */
    titleLength = computed(() => this.titleValue().length);
    descriptionLength = computed(() => this.descriptionValue().length);

    /**
     * titleStatus : Signal calculé indiquant l'état du titre.
     * Angular sait que titleLength() est une dépendance → réévalue si elle change.
     */
    titleStatus = computed(() => {
        const len = this.titleLength();
        if (len === 0) return 'empty';
        if (len < 3) return 'too-short';
        if (len > 100) return 'too-long';
        return 'ok';
    });

    descriptionStatus = computed(() => {
        const len = this.descriptionLength();
        if (len === 0) return 'empty';
        if (len < 10) return 'too-short';
        if (len > 500) return 'too-long';
        return 'ok';
    });

    /**
     * canSubmit : Computed Signal — le bouton "Enregistrer" est activé
     * uniquement quand le formulaire est valide.
     * Remplace [disabled]="conferenceForm.invalid" par un Signal pur.
     */
    canSubmit = computed(() => this.formValid());

    /**
     * formStatusLabel : texte affiché en temps réel selon la validité du formulaire.
     * Se met à jour automatiquement dès que formValid() change.
     */
    formStatusLabel = computed(() =>
        this.formValid()
            ? '✅ Formulaire valide — Prêt à soumettre'
            : '❌ Formulaire invalide — Corrigez les erreurs'
    );

    ngOnInit(): void {
        // ── Construction du FormGroup (identique Prosit 2) ──────
        this.conferenceForm = new FormGroup(
            {
                title: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ]),
                description: new FormControl('', [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(500),
                ]),
                category: new FormControl('', [Validators.required]),
                date: new FormControl('', [
                    Validators.required,
                    futureDateValidator(),
                ]),
                place: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                ]),
                maxParticipants: new FormControl(1, [
                    Validators.required,
                    Validators.min(1),
                    Validators.max(10000),
                ]),
                nbParticipants: new FormControl(0, [
                    Validators.required,
                    Validators.min(0),
                ]),
            },
            { validators: participantsValidator() }
        );

        // ── Pont RxJS → Signal via toSignal() ───────────────────
        /**
         * toSignal() convertit l'Observable statusChanges en Signal<string>.
         * initialValue : valeur initiale avant le premier événement de l'Observable.
         *
         * COMPARAISON :
         * ❌ Ancienne approche (RxJS seul) :
         *    this.conferenceForm.statusChanges.subscribe(status => {
         *      this.isFormValid = status === 'VALID'; // variable ordinaire
         *    });
         *    // → il faut gérer le cycle de vie et le unsubscribe()
         *
         * ✅ Nouvelle approche (Signals) :
         *    const status = toSignal(this.conferenceForm.statusChanges, { initialValue: 'INVALID' });
         *    // → Signal auto-géré, lu dans computed(), pas de subscribe/unsubscribe
         */
        const statusSignal = toSignal(this.conferenceForm.statusChanges, {
            initialValue: 'INVALID',
        });
        this.formValid = computed(() => statusSignal() === 'VALID') as ReturnType<typeof signal<boolean>>;

        // ── Initialisation des signals de valeur ─────────────────
        /**
         * toSignal() sur valueChanges pour synchroniser titleValue / descriptionValue.
         * Ainsi titleLength et descriptionLength (computed) se recalculent automatiquement.
         */
        const titleSignal = toSignal(
            this.conferenceForm.get('title')!.valueChanges,
            { initialValue: '' }
        );
        const descSignal = toSignal(
            this.conferenceForm.get('description')!.valueChanges,
            { initialValue: '' }
        );

        /**
         * effect() : Exécuté automatiquement quand titleSignal() ou descSignal() change.
         * Met à jour les signals manuels utilisés dans les computed().
         *
         * Équivalent réactif d'un subscriber, sans gestion du cycle de vie.
         */
        effect(() => {
            this.titleValue.set(titleSignal() ?? '');
        });

        effect(() => {
            this.descriptionValue.set(descSignal() ?? '');
        });

        /**
         * effect() de logging / diagnostic :
         * Affiche dans la console l'état du formulaire à chaque changement.
         * Remplace l'abonnement à statusChanges pour le debug.
         */
        effect(() => {
            console.log(
                `[Signal] Formulaire ${this.formValid() ? 'VALIDE ✅' : 'INVALIDE ❌'} | ` +
                `Titre: ${this.titleLength()} car. | ` +
                `Description: ${this.descriptionLength()} car.`
            );
        });

        // Mode édition
        if (this.conference) {
            this.conferenceForm.patchValue({
                title: this.conference.title,
                description: this.conference.description,
                category: this.conference.category,
                date: this.formatDate(this.conference.date),
                place: this.conference.place,
                maxParticipants: this.conference.maxParticipants,
                nbParticipants: this.conference.nbParticipants,
            });
        }
    }

    onSubmit(): void {
        if (this.conferenceForm.valid) {
            const formValue = this.conferenceForm.value;
            const conference: Conference = {
                ...formValue,
                date: new Date(formValue.date),
            };
            this.submittedData = conference;
            this.formSubmit.emit(conference);
        } else {
            this.conferenceForm.markAllAsTouched();
        }
    }

    private formatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
