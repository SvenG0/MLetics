/**
 * Interne Adresse mit dem Basispfad der Seite davor.
 *
 * Normalerweise liegt die Seite im Wurzelverzeichnis einer Domain
 * (mletics.de/impressum) — dann ändert dieser Helfer nichts.
 *
 * Auf GitHub Pages liegt sie dagegen in einem Unterordner
 * (sveng0.github.io/MLetics/impressum). Astro setzt dort `base` auf
 * "/MLetics"; eigene Links müssen das selbst voranstellen, sonst zeigt
 * href="/impressum" auf sveng0.github.io/impressum — und das gibt es nicht.
 * Bilder und Stile aus src/ rechnet Astro selbst um, handgeschriebene
 * Links wie hier nicht.
 *
 * pfad("/impressum")  →  "/impressum"          (normale Domain)
 *                     →  "/MLetics/impressum"  (Test auf GitHub Pages)
 * pfad("#kontakt")    →  "#kontakt"            (Sprungmarke, bleibt gleich)
 */
export function pfad(ziel: string): string {
  // Sprungmarken auf derselben Seite bekommen keinen Präfix.
  if (ziel.startsWith('#')) return ziel;

  // BASE_URL ist "/" oder "/MLetics/" — Schrägstriche am Übergang
  // zusammenführen, damit nie "//" entsteht.
  const basis = import.meta.env.BASE_URL.replace(/\/$/, '');
  return basis + (ziel.startsWith('/') ? ziel : '/' + ziel);
}
