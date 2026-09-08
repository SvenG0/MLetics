# Bild- und Videoablage

Dateien hier ablegen — genau unter diesen Namen, dann greift die Seite sie automatisch.

## Logo

`logo/mletics-mark-dark.png` — bereits vorhanden. Freigestellte Fassung des
echten Logos für dunkle Flächen: Läufer-Symbol und Schriftzug auf Creme
umgefärbt, das Logo-Blau bleibt original. Quelle: `Logo/…jpg` im Projektordner.
Falls ein neues Original geliefert wird, einfach dieselbe Datei ersetzen.

## Kapitelhintergründe

Das Kapitel „Understand" wurde entfernt — die Seite hat jetzt 5 Kapitel.

| Datei | Kapitel | Motiv |
|---|---|---|
| `01-hero.jpg` | 01 Auftakt | **Vorhanden** — Maik auf dem Platz |
| `02-treat.jpg` | 02 Treat | **Vorhanden** — Behandlung am Bein (Quelle: `Bilder/Treat.jpg`) |
| `03-connect.jpg` | 03 Connect | **Vorhanden** — Jubel im Stadion mit zwei Spielern (Quelle: `Bilder/connect.jpg`) |
| `04-about.jpg` | 04 Über Maik | Fehlt noch — nur A-Variante, dort greift solange der Farbverlauf |
| `05-kontakt.jpg` | 05 Kontakt | Fehlt noch — nur A-Variante, dort greift solange der Farbverlauf |

Die B-Variante nutzt `04-…` und `05-…` nicht; dort fehlt also nichts.

## Karte „Über Maik"

Kapitel 04 zeigt die Autogrammkarte `mletics-card-maik.webp` (aus
`Bilder/Maik AutogrammKarte.webp`).

## Rechte

Nutzungsrechte für alle eingesetzten Bilder sind laut Sven geklärt —
zuletzt bestätigt für das Connect-Foto (2026-09-08). Auf mehreren
Aufnahmen sind fremde Vereins- und Sponsorenkennzeichen erkennbar
(Vereinswappen, indeed, Nike); die Freigabe deckt das laut Sven ab.

Das frühere Connect-Bild („Maik behandlung.jpeg") wird **nicht mehr
verwendet** — es wurde durch das Stadionfoto ersetzt.

## Anforderungen

- **Format:** JPG oder WebP. WebP spart etwa 30 % Gewicht bei gleicher Qualität.
- **Auflösung:** mindestens 2400 × 1600 px. Die Bilder laufen formatfüllend über den ganzen Bildschirm.
- **Ausschnitt:** Das Motiv gehört in die **rechte Bildhälfte**. Links liegt der Text — dort darf nichts Wichtiges sein.
- **Dateigröße:** je Bild unter 400 KB halten (vorher komprimieren, z. B. mit squoosh.app).

## Video statt Standbild

Funktioniert genauso. Datei als `01-hero.mp4` ablegen und in `index.html` im
Stage-Block das `<img>` durch das auskommentierte `<video>` ersetzen — der
Codeblock liegt dort fertig vorbereitet.

Videos bitte:
- ohne Ton, 8–14 Sekunden, nahtlos geloopt
- maximal 1920 px breit, unter 3 MB
- ruhige Bewegung — kein Schnitt, keine Kamerafahrt mit Tempo

## Farbanpassung

Die Fotos werden im Browser automatisch angeglichen (leicht entsättigt,
abgedunkelt, mit einer Blau-Lasur überlagert — Logo-Blau statt der früheren
Grün-Variante), damit sie zur Palette passen. Die Stärke lässt sich in
`index.html` unter `.stage__img` und `.stage__grade` justieren.
