import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Leistungen speisen die Karten im Kapitel „Treat", die Auswahlliste im
// Formular, das JSON-LD und die jeweilige Unterseite — eine Quelle, damit
// nichts auseinanderläuft. Der Dateiname ist die Adresse: physiotherapie.md
// wird zu /physiotherapie.
const leistungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leistungen' }),
  schema: z.object({
    reihenfolge: z.number(),
    nummer: z.string(),
    titel: z.string(),
    kurz: z.string(),
    punkte: z.array(z.string()),

    /* ── Felder der Unterseite ──────────────────────────────────────
       h1 trägt bewusst das Suchwort samt Ort — der Claim der Startseite
       („UNDERSTAND. TREAT. CONNECT.") enthält keines. seoTitel und
       seoText landen in <title> und Meta-Description. */
    h1: z.string(),
    seoTitel: z.string(),
    seoText: z.string(),
    intro: z.string(),
    /** Kapitelbild der Unterseite, Dateiname in src/assets/. */
    bild: z.string(),
    /** Verlaufs-Rückfallebene, falls das Bild fehlt: "bg-01" … "bg-06". */
    bg: z.string(),
    abschnitte: z.array(z.object({ titel: z.string(), text: z.string() })),
    anlaesse: z.object({ titel: z.string(), punkte: z.array(z.string()) }),
    ablauf: z.array(z.object({ titel: z.string(), text: z.string() })),
  }),
});

const zielgruppen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zielgruppen' }),
  schema: z.object({
    reihenfolge: z.number(),
    titel: z.string(),
    icon: z.enum(['trend', 'herz']),
    text: z.string(),
  }),
});

export const collections = { leistungen, zielgruppen };
