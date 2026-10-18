/**
 * Interface représentant une conférence
 * Chaque propriété correspond à un FormControl dans le formulaire
 */
export interface Conference {
  id?: number;
  title: string;
  description: string;
  category: string;       // Nouveau champ : catégorie de la conférence
  date: Date;
  place: string;
  maxParticipants: number;
  nbParticipants: number;
}
