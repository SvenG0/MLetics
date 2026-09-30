import type { APIRoute } from 'astro';

// Die robots.txt lag vorher als feste Datei in public/ — mit der Domain
// ausgeschrieben. Damit stand die Adresse an ZWEI Stellen, und der Kommentar
// in astro.config.mjs („die einzige Stelle") war schlicht falsch: Bei einem
// Wechsel auf eine andere Domain hätte die robots.txt still weiter auf die
// alte gezeigt und Suchmaschinen zu einer Sitemap geschickt, die es dort
// nicht mehr gibt. Jetzt wird sie beim Bauen aus `site` erzeugt — die Domain
// steht wirklich nur noch in astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  // Unterordner = Testaufbau auf GitHub Pages (siehe src/lib/pfad.ts).
  // Der muss sich aus der Suche heraushalten, sonst stehen später zwei
  // identische Seiten im Index und Google sucht sich eine aus. Zusätzlich
  // setzt Base.astro dort noindex in jede Seite — robots.txt allein genügt
  // nicht, sie verhindert nur das Crawlen, nicht das Aufnehmen einer Adresse,
  // auf die von woanders verlinkt wird.
  const testaufbau = import.meta.env.BASE_URL !== '/';

  const zeilen = testaufbau
    ? [
        '# Testaufbau — nicht die echte Seite. Bitte nicht indexieren.',
        'User-agent: *',
        'Disallow: /',
      ]
    : [
        '# Alles darf indexiert werden — die Seite hat keine internen Bereiche.',
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${site ? new URL('sitemap-index.xml', site).href : '/sitemap-index.xml'}`,
      ];

  return new Response(zeilen.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
