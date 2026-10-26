// Einzige Quelle für die Kapitelreihenfolge. Vorher stand dieselbe Liste an
// drei Stellen (Rail-Buttons, Zähler „/ 06", namen-Array im JS) und musste
// bei jeder Änderung dreifach gepflegt werden.
export interface Kapitel {
  id: string;
  name: string;
}

export const kapitel: Kapitel[] = [
  { id: 'auftakt', name: 'Understand' },
  { id: 'treat',   name: 'Treat' },
  { id: 'connect', name: 'Connect' },
  { id: 'about',   name: 'Über Maik' },
  { id: 'galerie', name: 'Galerie' },
  { id: 'kontakt', name: 'Kontakt' },
];
