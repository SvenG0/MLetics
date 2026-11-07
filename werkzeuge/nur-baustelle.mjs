/**
 * Macht aus dem vollstaendigen Build einen Build, der NUR die
 * Baustellenseite enthaelt.
 *
 * Warum nicht einfach alles hochladen und per Regel umleiten: Dann laegen
 * die fertigen Seiten und 26 MB Galeriebilder weiterhin auf dem Server und
 * waeren ueber ihre Adressen erreichbar. "Versteckt" ist schwaecher als
 * "nicht vorhanden".
 *
 * Deshalb: Die Baustellenseite wird zur Startseite, und vom Rest bleibt
 * ausschliesslich das uebrig, worauf sie selbst verweist — ermittelt aus
 * ihrem eigenen Quelltext, nicht geraten.
 */
import { readFileSync, writeFileSync, rmSync, readdirSync, statSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const quelle = join(dist, 'baustelle', 'index.html');

let html = readFileSync(quelle, 'utf8');

/* Alles einsammeln, worauf die Seite verweist: CSS, Schriften, das Logo
   samt aller Groessen aus srcset. */
const gebraucht = new Set(['.well-known']);
for (const m of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) gebraucht.add(m[1]);
for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const teil of m[1].split(',')) {
    const p = teil.trim().split(/\s+/)[0];
    if (p.startsWith('/')) gebraucht.add(p);
  }
}
/* Schriften stehen im CSS, nicht im HTML — die CSS-Dateien mitlesen. */
for (const p of [...gebraucht]) {
  if (!p.endsWith('.css')) continue;
  const css = readFileSync(join(dist, p), 'utf8');
  for (const m of css.matchAll(/url\((\/[^)"']+)\)/g)) gebraucht.add(m[1]);
}

const behalten = new Set(['index.html']);
for (const p of gebraucht) behalten.add(p.replace(/^\//, '').split('/')[0]);

/* Baustellenseite wird zur Startseite. */
rmSync(join(dist, 'index.html'), { force: true });
renameSync(quelle, join(dist, 'index.html'));
rmSync(join(dist, 'baustelle'), { recursive: true, force: true });

/* Innerhalb von _astro nur die wirklich verwendeten Dateien behalten —
   sonst blieben alle Galeriebilder liegen. */
const astroOrdner = join(dist, '_astro');
let entferntBilder = 0;
try {
  for (const datei of readdirSync(astroOrdner)) {
    if (!gebraucht.has('/_astro/' + datei)) {
      rmSync(join(astroOrdner, datei), { force: true });
      entferntBilder++;
    }
  }
} catch {}

/* Oberste Ebene aufraeumen. */
let entferntSeiten = 0;
for (const eintrag of readdirSync(dist)) {
  if (behalten.has(eintrag)) continue;
  rmSync(join(dist, eintrag), { recursive: true, force: true });
  entferntSeiten++;
}

/* Alles mit 503 beantworten. Die Baustellenseite selbst ist das
   Fehlerdokument — Apache liefert sie damit MIT Status 503 aus, was
   Suchmaschinen als "voruebergehend" lesen. Ausgenommen sind nur die
   Dateien, die die Seite zum Darstellen braucht, und .well-known, wo
   Let's Encrypt alle 90 Tage das Zertifikat erneuert. */
writeFileSync(join(dist, '.htaccess'), `# Wartungsmodus. Erzeugt von werkzeuge/nur-baustelle.mjs.
ErrorDocument 503 /index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_URI} !^/(_astro|fonts|favicon|\\.well-known|index\\.html|vorschauM)
  RewriteRule ^ - [R=503,L]
</IfModule>

<IfModule mod_headers.c>
  # Nur fuer die Baustelle, nicht fuer /vorschauM: Eine .htaccess im
  # Wurzelverzeichnis gilt auch in Unterordnern. Ohne diese Einschraenkung
  # bekam die Vorschau zwei widerspruechliche Cache-Control-Zeilen und ein
  # Retry-After, das dort nichts zu suchen hat.
  SetEnvIf Request_URI "^/vorschauM" IST_VORSCHAU
  Header always set Retry-After "1209600" env=!IST_VORSCHAU
  Header always set Cache-Control "no-store, must-revalidate" env=!IST_VORSCHAU
</IfModule>
`);

const groesse = (o) => readdirSync(o, { withFileTypes: true })
  .reduce((s, e) => s + (e.isDirectory() ? groesse(join(o, e.name)) : statSync(join(o, e.name)).size), 0);

console.log(`Entfernt: ${entferntSeiten} Einträge auf oberster Ebene, ${entferntBilder} Dateien in _astro`);
console.log(`Behalten: ${[...behalten].sort().join(', ')}`);
console.log(`Verbleibende Größe: ${(groesse(dist) / 1024).toFixed(0)} KB`);
