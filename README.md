# MLetics — Website

Website der Praxis **MLetics, Maik Liesbrock** (Osteopathie | Physiotherapie, Bochum).
Gebaut mit [Astro](https://astro.build) als rein statische Seite — kein Framework im
Browser, kein Cookie, keine externe Verbindung beim Aufruf.

## Aufbau

```text
/
├── src/
│   ├── pages/        index · impressum · datenschutz
│   ├── layouts/      Base (alle Seiten) · Textseite (Rechtstexte)
│   ├── components/   Header, Chapter, Gallery, ContactForm, …
│   ├── content/      Inhalte als Collections (leistungen, zielgruppen, galerie)
│   ├── data/         praxis.json, impressum.json — Adresse, Telefon, Pflichtangaben
│   ├── styles/       global.css (bewusst NICHT pro Komponente gescopet)
│   └── scripts/      main.js
├── public/           Schriften, Favicon, robots.txt, OG-Bild
└── archiv/           die alte Einzeldatei-Version, eingefroren
```

**`src/styles/global.css` ist absichtlich global.** Viele Regeln greifen
kapitelübergreifend (`.bg-03 .chapter__bg-img`, Abstände zum schwebenden
Vor/Zurück-Button). Scoped Styles würden genau diese Querbezüge zerreißen.

**`src/data/*.json` ist die einzige Quelle für Adresse, Telefon und
Pflichtangaben.** Von dort speisen sich Kontaktkapitel, Footer, JSON-LD,
Impressum und Datenschutzerklärung. Kontaktdaten immer nur dort ändern.
Felder auf `null` gelten als offen und erscheinen auf der Seite sichtbar als
„noch zu ergänzen", damit Pflichtangaben nicht unbemerkt fehlen.

## Befehle

| Befehl            | Wirkung                                  |
| :---------------- | :--------------------------------------- |
| `npm install`     | Abhängigkeiten installieren              |
| `npm run dev`     | Entwicklungsserver                       |
| `npm run build`   | Erzeugt die fertige Seite nach `dist/`   |
| `npm run preview` | Das Bauergebnis lokal ansehen            |

## Hosting

IONOS Deploy Now baut bei jedem Push nach `main` aus diesem Repo und legt das
Ergebnis auf IONOS-Webspace (Server in Deutschland). Es gibt nichts manuell
hochzuladen.

Astro erzeugt Verzeichnisse (`impressum/index.html`), Apache liefert die
Adresse `/impressum` deshalb ohne zusätzliche `.htaccess`-Regel aus.

## archiv/

Die ursprüngliche Fassung: eine einzelne handgeschriebene `index.html` samt
eigenem Mini-Server (`node archiv/server.mjs`, Port 4321). Bleibt liegen, um
bei Zweifeln den alten Stand danebenstellen zu können — wird nicht mehr
gepflegt und nicht ausgeliefert.
