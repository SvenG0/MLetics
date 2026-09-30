import type { APIRoute } from 'astro';

// Die robots.txt lag vorher als feste Datei in public/ — mit der Domain
// ausgeschrieben. Damit stand die Adresse an ZWEI Stellen, und der Kommentar
// in astro.config.mjs („die einzige Stelle") war schlicht falsch: Bei einem
// Wechsel auf eine andere Domain hätte die robots.txt still weiter auf die
// alte gezeigt und Suchmaschinen zu einer Sitemap geschickt, die es dort
// nicht mehr gibt. Jetzt wird sie beim Bauen aus `site` erzeugt — die Domain
// steht wirklich nur noch in astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? new URL('sitemap-index.xml', site).href : '/sitemap-index.xml';

  return new Response(
    [
      '# Alles darf indexiert werden — die Seite hat keine internen Bereiche.',
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${sitemap}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
