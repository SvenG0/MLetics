# Bild- und Videoablage

Dateien hier ablegen — genau unter diesen Namen, dann greift die Seite sie automatisch.

## Logo

`logo/mletics-mark-dark.png` — bereits vorhanden. Freigestellte Fassung des
echten Logos für dunkle Flächen: Läufer-Symbol und Schriftzug auf Creme
umgefärbt, das Logo-Blau bleibt original. Quelle: `Logo/…jpg` im Projektordner.
Falls ein neues Original geliefert wird, einfach dieselbe Datei ersetzen.

## Kapitelhintergründe

Das Kapitel „Understand" wurde entfernt, dafür kam „Galerie" dazu — die
A-Version hat jetzt 6 Kapitel (die B-Version weiterhin ihre eigene Auswahl,
siehe unten).

| Datei | Kapitel | Motiv |
|---|---|---|
| `01-hero.jpg` | 01 Auftakt | **Vorhanden** — Maik auf dem Platz |
| `02-treat.jpg` | 02 Treat | **Vorhanden** — Behandlung am Bein (Quelle: `Bilder/Treat.jpg`) |
| `03-connect.jpg` | 03 Connect | **Vorhanden** — Jubel im Stadion mit zwei Spielern (Quelle: `Bilder/connect.jpg`) |
| `04-about.jpg` | 04 Über Maik | **Vorhanden** — Maik winkt lachend ins Stadion, bereits Schwarz-Weiß (Quelle: `Bilder/Über Maik Schwarz Weiß.jpg`) |
| — | 05 Galerie | Zeigt keinen eigenen Kapitelhintergrund, siehe eigener Abschnitt unten |
| `06-kontakt.jpg` | 06 Kontakt | Fehlt noch — nur A-Variante, dort greift solange der Farbverlauf. **Achtung:** hieß vor der Galerie-Ergänzung `05-kontakt.jpg` — falls schon eine Datei dafür vorbereitet war, bitte auf `06-kontakt.jpg` umbenennen. |

Die B-Variante nutzt `04-…` und `06-…` nicht; dort fehlt also nichts.

## Galerie (neu, A-Version)

Kapitel 05 zeigt ein Filmstreifen-Karussell. **Bereits befüllt** mit 10 echten
Fotos aus `Bilder/Galerie 1.jpg` bis `Galerie 10.jpg` (Physio-Einsätze am
Spielfeldrand, VfL Bochum, Eintracht Frankfurt, Aufstiegsfeier) — verkleinert
auf 1600px Breite und als JPEG komprimiert (Quelle bleibt im Original in
`Bilder/` erhalten):

```
assets/galerie/01.jpg … 10.jpg
```

Weitere Bilder ergänzen: Datei unter `assets/galerie/11.jpg` (usw.) ablegen
und in `index.html` im Abschnitt „05 GALERIE" ein weiteres
`<figure class="gallery__slide">` (Bild-Track) **und** einen passenden
`<button class="gallery__thumb">` (Miniaturleiste, mit eigenem `<img>` darin)
ergänzen — beide Listen müssen dieselbe Reihenfolge haben. Für den Alt-Text
kurz beschreiben, was auf dem Bild passiert (nicht nur „Foto 11").

Format/Auflösung wie bei den Kapitelbildern (siehe unten), Seitenverhältnis
im Karussell ist 16:9 — am besten schon in etwa so zuschneiden, sonst
schneidet `object-fit:cover` automatisch (mittig) zu.

## „Über Maik" — kein Vordergrundbild mehr

Kapitel 04 zeigte früher eine Autogrammkarte im Vordergrund (kleine Karte
neben dem Lebenslauf). Jetzt läuft das Foto stattdessen als Kapitel-
hintergrund, genau wie bei Auftakt/Treat/Connect (`04-about.jpg`, siehe
oben) — der Lebenslauf (`dl.vita`) steht frei auf dem Foto, ohne eigene
Bildkarte davor.

`mletics-card-maik.webp` (die alte Autogrammkarte) wird in Variante A nicht
mehr verwendet, liegt aber weiter in `assets/` und wird in Variante B
(`index-b.html`) weiterhin gezeigt.

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
