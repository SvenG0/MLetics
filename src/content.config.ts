import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Leistungen speisen sowohl die Karten im Kapitel „Treat" als auch (ab Phase 3)
// die jeweilige Unterseite — eine Quelle, damit beides nicht auseinanderläuft.
const leistungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leistungen' }),
  schema: z.object({
    reihenfolge: z.number(),
    titel: z.string(),
    kurz: z.string(),
    punkte: z.array(z.string()),
  }),
});

const zielgruppen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zielgruppen' }),
  schema: z.object({
    reihenfolge: z.number(),
    titel: z.string(),
    text: z.string(),
  }),
});

/* Haeufige Fragen. Eigene Sammlung, weil sie an zwei Stellen gebraucht
   werden: sichtbar im Kapitel „Fragen" und noch einmal als strukturierte
   Daten (FAQPage). Genau dieses Format uebernehmen Googles KI-Antworten
   und Sprachmodelle am liebsten — eine woertlich gestellte Frage mit
   kurzer Antwort ist leichter zu zitieren als ein Fliesstext. */
const fragen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fragen' }),
  schema: z.object({
    reihenfolge: z.number(),
    frage: z.string(),
    antwort: z.string(),
  }),
});

export const collections = { leistungen, zielgruppen, fragen };
