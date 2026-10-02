
import { Component, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-conference-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css'
})
export class ConferenceDetailComponent {

  // Données de la conférence avec Signals
  title = signal('Angular 21 : les nouveautés');
  speaker = signal('Eya Mabrouk');
  date = signal(new Date(2026, 9, 15));
  maxParticipants = signal(100);
  nbParticipants = signal(75);

  // Calcul automatique des places disponibles
  placesDisponibles = computed(() =>
    this.maxParticipants() - this.nbParticipants()
  );

  // Modifier le titre depuis le champ de saisie
  modifierTitre(nouveauTitre: string) {
    this.title.set(nouveauTitre);
  }

  // Inscription d'un participant
  inscrire() {
    if (this.placesDisponibles() > 0) {
      this.nbParticipants.update(nombre => nombre + 1);
    }
  }
}
