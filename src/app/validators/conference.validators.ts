import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé : vérifie que nbParticipants <= maxParticipants
 * Ce validateur est appliqué au niveau du FormGroup (cross-field validation)
 */
export function participantsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const maxParticipants = group.get('maxParticipants')?.value;
        const nbParticipants = group.get('nbParticipants')?.value;

        if (maxParticipants != null && nbParticipants != null && nbParticipants > maxParticipants) {
            return { participantsExceeded: true };
        }
        return null;
    };
}

/**
 * Validateur personnalisé : vérifie que la date est dans le futur
 * Appliqué sur le FormControl de la date
 */
export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Laisse le Validators.required gérer ce cas
        }
        const inputDate = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Comparer uniquement les dates sans l'heure

        if (inputDate <= today) {
            return { futureDate: true };
        }
        return null;
    };
}
