# Bild- und Videoablage

Dateien hier ablegen — genau unter diesen Namen, dann greift die Seite sie automatisch.

## Logo

`logo/mletics-mark-dark.png` — bereits vorhanden. Freigestellte Fassung des
echten Logos für dunkle Flächen: Läufer-Symbol und Schriftzug auf Creme
umgefärbt, das Logo-Blau bleibt original. Quelle: `Logo/…jpg` im Projektordner.
Falls ein neues Original geliefert wird, einfach dieselbe Datei ersetzen.

## Kapitelhintergründe

Das Kapitel „Understand" wurde entfernt — die Seite hat jetzt 5 Kapitel.

| Datei | Kapitel | Motivvorschlag |
|---|---|---|
| `01-hero.jpg` | 01 Auftakt | Maik auf dem Platz (bereits vorhanden) |
| `02-treat.jpg` | 02 Treat | Behandlung in Aktion, Liege oder Mobilisation |
| `03-connect.jpg` | 03 Connect | **Bereits vorhanden** — Behandlungsfoto (Betreuung am Spielfeldrand) |
| `04-about.jpg` | 04 Über Maik | Kapitelhintergrund — separat von der Karte unten |
| `05-kontakt.jpg` | 05 Kontakt | Praxis außen oder Empfang |

## Karte „Über Maik"

Kapitel 04 zeigt zusätzlich zum Kapitelhintergrund eine **interaktive Karte**
rechts im Text — `mletics-card-maik.webp` (bereits vorhanden, aus der
AutogrammKarte). Die Nutzungsrechte für dieses Bild sind laut Sven geklärt.

Beim **Behandlungsfoto** (`03-connect.jpg`, „Maik behandlung.jpeg") ist auf
dem Trikot ein anderer Vereins-/Sponsorenkontext erkennbar (Krombacher,
Vereinswappen) als bei der AutogrammKarte — das war nicht Teil der
genannten Freigabe. Bitte vor dem Livegang gesondert bestätigen, dass auch
dieses Bild verwendet werden darf.

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
