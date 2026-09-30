// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Muss gesetzt sein, damit canonical-Adressen, die strukturierten Daten und
  // die sitemap.xml absolute URLs erzeugen können.
  // Steht vorläufig auf mletics.de. Das hier ist tatsächlich die EINZIGE
  // Stelle, an der die Domain steht — canonical-Adressen, Open-Graph-Links,
  // JSON-LD, sitemap.xml und robots.txt leiten sich alle daraus ab. Ein
  // Wechsel auf z.B. mletics.com ist deshalb diese eine Zeile.
  // Über SITE_URL überschreibbar, falls die Hosting-Umgebung sie setzt.
  site: process.env.SITE_URL ?? 'https://mletics.de',
  integrations: [sitemap()],
});
