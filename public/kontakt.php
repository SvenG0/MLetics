<?php
/**
 * Empfänger des Kontaktformulars.
 *
 * Bewusst ohne Bibliothek und ohne Datenbank: Das Formular hat fünf Felder
 * und soll eine Mail auslösen. Alles, was hier nicht steht, kann auch nicht
 * ausfallen oder veralten.
 *
 * Datenschutz: Es wird nichts gespeichert und nichts protokolliert. Die
 * Angaben gehen ausschließlich in die Mail an die Praxis.
 */

const EMPFAENGER = 'maik@mletics.de';
/* Absender muss eine Adresse der eigenen Domain sein, sonst stufen
   Mailserver die Nachricht per SPF/DMARC als Fälschung ein. Die Adresse
   des Absenders steht im Reply-To — ein Klick auf "Antworten" geht also
   an die anfragende Person, nicht an uns selbst. */
const ABSENDER  = 'maik@mletics.de';

/* Kommt die Anfrage per fetch() aus dem Browser oder als normales
   Formular ohne JavaScript? Davon haengt ab, was wir zurueckgeben. */
$willJson = strpos((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false;

function antwort($code, $text, $json) {
    http_response_code($code);
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $code === 200, 'text' => $text], JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        $sicher = htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
        echo "<!doctype html><html lang=de><meta charset=utf-8>"
           . "<title>MLetics</title>"
           . "<body style=\"background:#0A0B0D;color:#F2F0EA;font-family:system-ui;"
           . "display:grid;place-items:center;min-height:100vh;margin:0;padding:2rem;text-align:center\">"
           . "<div><p style=\"font-size:1.2rem;max-width:34rem\">$sicher</p>"
           . "<p><a href=\"/#kontakt\" style=\"color:#4A8CC9\">Zurück zur Seite</a></p></div>";
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    antwort(405, 'Diese Adresse nimmt nur abgeschickte Formulare entgegen.', $willJson);
}

/* Spam-Abwehr ohne Captcha. Ein Captcha waere eine Huerde fuer Menschen
   mit Behinderung und bindet meist einen US-Dienst ein — beides wollen
   wir nicht.
   1. Honigtopf: ein Feld, das im Browser unsichtbar ist. Menschen fuellen
      es nie aus, automatische Skripte fuellen stumpf alles aus.
   2. Zeitsperre: Wer das Formular in unter drei Sekunden abschickt, hat
      es nicht gelesen. */
if (($_POST['website'] ?? '') !== '') {
    antwort(200, 'Danke, Deine Anfrage ist eingegangen.', $willJson); // stilles Verschlucken
}
$start = (int) ($_POST['gestartet'] ?? 0);
if ($start > 0 && (time() - $start) < 3) {
    antwort(400, 'Das ging zu schnell. Bitte versuche es noch einmal.', $willJson);
}

$name      = trim((string) ($_POST['name'] ?? ''));
$email     = trim((string) ($_POST['email'] ?? ''));
$telefon   = trim((string) ($_POST['tel'] ?? ''));
$anliegen  = trim((string) ($_POST['anliegen'] ?? ''));
$nachricht = trim((string) ($_POST['nachricht'] ?? ''));

if ($name === '' || $email === '' || $nachricht === '') {
    antwort(400, 'Bitte fülle Name, E-Mail und Nachricht aus.', $willJson);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    antwort(400, 'Diese E-Mail-Adresse sieht nicht richtig aus.', $willJson);
}
$laenge = function_exists('mb_strlen') ? 'mb_strlen' : 'strlen';
if ($laenge($nachricht) > 5000 || $laenge($name) > 200) {
    antwort(400, 'Die Nachricht ist zu lang.', $willJson);
}

/* Kopfzeilen-Einschleusung: Wer Zeilenumbrueche in Name oder Adresse
   unterbringt, koennte sonst eigene Empfaenger ergaenzen und den Server
   zum Spamversand missbrauchen. */
if ($telefon !== '' && !preg_match('/^[0-9 +().\/-]{5,30}$/', $telefon)) {
    antwort(400, 'Die Telefonnummer sieht nicht richtig aus.', $willJson);
}

foreach ([$name, $email, $telefon, $anliegen] as $feld) {
    if (preg_match('/[\r\n]/', $feld)) {
        antwort(400, 'Ungültige Eingabe.', $willJson);
    }
}

$betreff = '=?UTF-8?B?' . base64_encode('Anfrage über mletics.de: ' . ($anliegen ?: 'Kontakt')) . '?=';

$text = "Neue Anfrage über das Kontaktformular auf mletics.de\n\n"
      . "Name:     $name\n"
      . "E-Mail:   $email\n"
      . "Telefon:  " . ($telefon !== '' ? $telefon : '—') . "\n"
      . "Anliegen: " . ($anliegen ?: '—') . "\n\n"
      . "Nachricht:\n$nachricht\n";

$kopf = [
    'From: MLetics Website <' . ABSENDER . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: mletics.de',
];

if (!mail(EMPFAENGER, $betreff, $text, implode("\r\n", $kopf))) {
    antwort(500, 'Die Nachricht konnte gerade nicht verschickt werden. Bitte schreib direkt an ' . EMPFAENGER . '.', $willJson);
}

antwort(200, 'Danke, Deine Anfrage ist eingegangen. Maik meldet sich.', $willJson);
