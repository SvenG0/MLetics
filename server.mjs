// Winziger statischer Server für die lokale Vorschau (keine Abhängigkeiten).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, damit Leerzeichen im Pfad korrekt dekodiert werden.
const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const rel = normalize(urlPath === '/' ? '/index.html' : urlPath).replace(/^(\.\.[/\\])+/, '');
  try {
    const buf = await readFile(join(ROOT, rel));
    res.writeHead(200, {
      'Content-Type': TYPES[extname(rel)] ?? 'application/octet-stream',
      // Lokaler Dev-Server: nie cachen. Sonst servieren Browser bei
      // wiederholten Aufrufen derselben URL stille alte Stände aus —
      // das hat in dieser Session einen echten Fehler vorgetäuscht.
      'Cache-Control': 'no-store',
    });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`MLetics-Vorschau läuft auf http://localhost:${PORT}`));
