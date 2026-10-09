import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Leistungen speisen sowohl die Karten im Kapitel „Treat" als auch (ab Phase 3)
// die jeweilige Unterseite — eine Quelle, damit beides nicht auseinanderläuft.
const leistungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leistungen' }),
  schema: z.object({
    reihenfolge: z.number(),
    /* Bildzeichen der Karte — loest die fruehere Ziffer ab.
       Die Namen stehen in src/components/LeistungIcon.astro. */
    icon: z.enum(['beweglichkeit', 'aufbau', 'erlaubnis']),
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
    icon: z.enum(['trend', 'herz']),
    text: z.string(),
  }),
});

export const collections = { leistungen, zielgruppen };
