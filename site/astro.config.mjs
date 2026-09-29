// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Muss gesetzt sein, damit canonical-Adressen, die strukturierten Daten und
  // die sitemap.xml absolute URLs erzeugen können.
  // ACHTUNG: Steht noch auf mletics.de — falls stattdessen mletics.com kommt,
  // ist das hier die einzige Stelle, die geändert werden muss.
  // Über SITE_URL überschreibbar (Netlify setzt so etwas beim Deploy).
  site: process.env.SITE_URL ?? 'https://mletics.de',
  integrations: [sitemap()],
});
