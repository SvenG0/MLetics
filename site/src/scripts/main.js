function initMLetics(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sections = Array.prototype.slice.call(document.querySelectorAll('.chapter'));

  /* Kapitelpositionen für Navigation (Punktleiste, Vor/Zurück, #anker).
     Früher musste hier zum Messen kurz auf 0 gescrollt und zurück
     gesprungen werden, weil offsetTop bei position:sticky-Elementen
     scroll-abhängige Werte lieferte. Seit die Kapitel im normalen Fluss
     liegen, ist offsetTop wieder verlässlich — der Sprung entfällt
     (er war bei jedem Resize sichtbar). */
  var sectionTops = [];
  function neuVermessen(){
    sectionTops = sections.map(function(s){ return s.offsetTop; });
  }
  neuVermessen();

  /* Startposition selbst bestimmen, statt sich auf den Browser zu
     verlassen: scrollRestoration:'manual' unterdrückt bei einigen Browsern
     das automatische Anker-Scrollen ohne Ersatz — ein Aufruf mit #anker
     landete dadurch unzuverlässig bei 0 statt am Zielkapitel. Deshalb hier
     explizit selbst positionieren, erst wenn Schrift/Layout stehen. */
  if('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var ziel = location.hash && document.querySelector(location.hash);
  var zielIndex = ziel ? sections.indexOf(ziel) : -1;
  if(zielIndex > -1){
    /* Layout steht erst final, wenn Schrift/Ressourcen geladen sind —
       deshalb mehrfach neu vermessen und nachpositionieren. */
    var zuZiel = function(){ neuVermessen(); window.scrollTo(0, sectionTops[zielIndex]); };
    zuZiel();
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(zuZiel); }
    window.addEventListener('load', zuZiel);
  } else {
    window.scrollTo(0,0);
  }

  var railBtns = Array.prototype.slice.call(document.querySelectorAll('.rail button'));
  var pillLnks = Array.prototype.slice.call(document.querySelectorAll('.bar__nav a'));

  railBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var i = sections.indexOf(document.getElementById(b.dataset.go));
      window.scrollTo({top: sectionTops[i], behavior: reduce ? 'auto' : 'smooth'});
    });
  });

  /* Fehlende Bilddateien entfernen, damit statt eines kaputten Bildes
     der CSS-Verlauf als Rückfallebene sichtbar bleibt. */
  document.querySelectorAll('[data-media]').forEach(function(m){
    m.addEventListener('error', function(){ m.remove(); });
    if(m.tagName === 'IMG' && m.complete && m.naturalWidth === 0) m.remove();
  });

  var namen = ['Auftakt','Treat','Connect','Über Maik','Galerie','Kontakt'];
  var announcer = document.getElementById('announcer');
  var stepPrev  = document.getElementById('stepPrev');
  var stepNext  = document.getElementById('stepNext');
  var stepNow   = document.getElementById('stepNow');
  var current   = 0;

  /* Aktives Kapitel: Navigation, Kapitel-Punkte, Zähler und
     Screenreader-Ansage aktualisieren. Der Hintergrund selbst braucht das
     nicht mehr — er scrollt normal mit, kein Crossfade mehr nötig. */
  function activate(i){
    if(i < 0 || i >= sections.length) return;
    current = i;
    railBtns.forEach(function(b, k){ b.setAttribute('aria-current', k === i); });
    var id = sections[i].id;
    pillLnks.forEach(function(a){
      a.setAttribute('aria-current', a.getAttribute('href') === '#' + id);
    });
    stepNow.textContent = ('0' + (i + 1)).slice(-2);
    stepPrev.disabled = (i === 0);
    stepNext.disabled = (i === sections.length - 1);
    announcer.textContent = 'Kapitel ' + (i + 1) + ' von ' + sections.length + ': ' + namen[i];
  }

  /* Lesefortschritt in der Kopfleiste — per rAF gedrosselt,
     damit das Scrollen nicht ins Stocken gerät. */
  var bar = document.querySelector('.bar'), ticking = false;
  function zeichneFortschritt(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max) : 0);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; requestAnimationFrame(zeichneFortschritt); }
  }, {passive: true});
  window.addEventListener('resize', zeichneFortschritt);
  window.addEventListener('resize', neuVermessen);
  zeichneFortschritt();

  /* Kein Scroll-gebundenes Skript mehr für die Kapitelbilder: Jedes
     Bild liegt jetzt fest in seinem eigenen Kapitel (siehe .chapter__bg
     weiter oben im CSS) und erscheint dadurch automatisch zur
     richtigen Zeit — ganz ohne JavaScript, während des Scrollens
     eingeschlossen. Frühere Fassungen banden das an einen
     Scroll-Handler (erst Sticky-Stapeln, dann eine fixierte
     Bild-Bühne mit Crossfade); beides hing am selben wunden Punkt:
     iOS Safari verzögert Scroll-gebundene Skripte systematisch, solange
     aktiv gewischt wird, wodurch die Bühne mitten im Scrollen auf dem
     zuletzt berechneten Bild hängen blieb — meist dem ersten. */

  function goTo(i){
    if(i < 0 || i >= sections.length) return;
    window.scrollTo({top: sectionTops[i], behavior: reduce ? 'auto' : 'smooth'});
  }
  stepPrev.addEventListener('click', function(){ goTo(current - 1); });
  stepNext.addEventListener('click', function(){ goTo(current + 1); });

  /* Aktives Kapitel: NICHT über IntersectionObserver bestimmt, bewusst.
     Bei Sticky-Stapelung überlappen sich zwei Kapitel geometrisch immer
     kurz (das hintere klebt noch bei ~97% Sichtbarkeit, während das
     vordere schon oben ansteht) — ein Schwellenwert-Observer kann dann
     nicht zuverlässig sagen, welches „vorne" liegt. Stattdessen: das
     vorderste (letzte in Dokumentreihenfolge) Kapitel, dessen Oberkante
     bereits bei 0 klebt, ist optisch immer das oberste im Stapel. */
  var chapterTicking = false;
  function vorderstesKapitel(){
    var aktiv = 0;
    for(var i = 0; i < sections.length; i++){
      if(sections[i].getBoundingClientRect().top <= 1) aktiv = i;
    }
    return aktiv;
  }
  function watchAktivesKapitel(){
    activate(vorderstesKapitel());
    chapterTicking = false;
  }
  window.addEventListener('scroll', function(){
    if(!chapterTicking){ chapterTicking = true; requestAnimationFrame(watchAktivesKapitel); }
  }, {passive: true});
  watchAktivesKapitel();

  /* Reveal-Animation separat über IntersectionObserver — hier ist
     Mehrdeutigkeit unkritisch: ein Kapitel einmal zu früh „bereit"
     zu markieren, bevor es vorne im Stapel ankommt, fällt nicht auf.
     Wichtig: .rise ist per CSS-Grundzustand sichtbar (siehe oben) — erst
     hier, wenn wir wissen, dass JS wirklich läuft, schalten wir aktiv auf
     "unsichtbar, bis das Kapitel in Sicht kommt" um. Läuft dieser Code aus
     irgendeinem Grund gar nicht (Skripte blockiert, Fehler, IntersectionObserver
     fehlt), bleibt der Inhalt einfach beim sichtbaren CSS-Grundzustand stehen. */
  if('IntersectionObserver' in window){
    document.querySelectorAll('.rise').forEach(function(el){ el.dataset.in = 'false'; });

    var revealWatch = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var items = en.target.querySelectorAll('.rise');
        items.forEach(function(el, k){
          setTimeout(function(){ el.dataset.in = 'true'; }, k * 90);
        });
        obs.unobserve(en.target);
      });
    }, {rootMargin: '0px 0px -20% 0px'});

    sections.forEach(function(sec){ revealWatch.observe(sec); });

    /* Sicherheitsnetz: Klickt man einen Nav-Link an (z.B. direkt zu
       „Galerie"), springt der Browser nativ und SOFORT dorthin (kein
       scroll-behavior:smooth, siehe Begründung oben bei den
       Design-Tokens) — dabei wird nie ein Frame gerendert, in dem die
       übersprungenen Kapitel (Treat, Connect, …) kurz im Sichtfenster
       stehen. Der IntersectionObserver oben bekommt für sie dadurch nie
       ein "jetzt sichtbar"-Ereignis und sie blieben für immer bei
       opacity:0 hängen — obwohl man längst daran vorbeigescrollt ist.
       Gleiches gilt für einen Deep-Link mit #anker beim ersten Laden.
       Hier deshalb ein Nachtrag: alles, was bereits im oder über dem
       Sichtfenster liegt, sofort sichtbar schalten (ohne die
       gestaffelte Animation — die ist ohnehin nicht zu sehen, wenn man
       nie dort vorbeigescrollt ist). */
    var riseNachtragTicking = false;
    function riseNachtragen(){
      document.querySelectorAll('.rise[data-in="false"]').forEach(function(el){
        if(el.getBoundingClientRect().top < innerHeight){ el.dataset.in = 'true'; }
      });
    }
    riseNachtragen();
    window.addEventListener('scroll', function(){
      if(!riseNachtragTicking){ riseNachtragTicking = true; requestAnimationFrame(function(){ riseNachtragen(); riseNachtragTicking = false; }); }
    }, {passive: true});
    window.addEventListener('hashchange', riseNachtragen);
  }

  /* Treat-/„Für wen?"-Karten: der Hervorhebungs-Zustand (Rahmen, Ziffer,
     Unterstreichung) hängt bisher an :hover — auf Touch-Geräten gibt es
     kein echtes Hover, dort passierte beim Antippen/Scrollen also gar
     nichts. Erkennung bewusst über drei Signale statt nur
     matchMedia('(hover: none)') allein: auf einem echten iPhone blieb
     das Feature aus, vermutlich weil ein einzelnes Signal je nach
     Ansichts-Kontext (Safari direkt vs. Quick-Look-Vorschau aus
     Mail/Nachrichten) nicht zuverlässig war. Reicht eines der drei
     Signale, gilt das Gerät als „kein echtes Hover".

     Erst mit IntersectionObserver + prozentualem rootMargin gebaut —
     in einer eingebetteten Ansicht (z.B. WhatsApp-Artefakt-Vorschau)
     blieben dann mehrere Karten gleichzeitig aktiv, vermutlich weil
     der Beobachtungsbereich dort nicht dem tatsächlich sichtbaren
     Ausschnitt entspricht. Jetzt robuster: direkt beim Scrollen
     gemessen, welche Karte ihrer Mitte nach am nächsten an der
     Bildschirmmitte liegt — das hängt nur von getBoundingClientRect()
     und innerHeight ab, nicht von der Interpretation eines
     Beobachtungs-„root" durch die jeweilige Ansicht, und markiert
     garantiert immer nur genau eine Karte aktiv. rAF-gedrosselt wie
     der Lesefortschritt oben, aus demselben Grund (iOS verzögert
     scroll-gebundene Skripte sonst während des Wischens). */
  var keinEchtesHover =
    matchMedia('(hover: none)').matches ||
    matchMedia('(pointer: coarse)').matches ||
    ('ontouchstart' in window);
  if(keinEchtesHover){
    var karten = document.querySelectorAll('.service, .audience__card');
    var kartenTicking = false;
    function aktiveKarteAktualisieren(){
      var mitte = innerHeight / 2;
      var beste = null, besterAbstand = Infinity;
      karten.forEach(function(k){
        var r = k.getBoundingClientRect();
        if(r.bottom <= 0 || r.top >= innerHeight) return;
        var abstand = Math.abs((r.top + r.height / 2) - mitte);
        if(abstand < besterAbstand){ besterAbstand = abstand; beste = k; }
      });
      karten.forEach(function(k){ k.classList.toggle('is-inview', k === beste); });
      kartenTicking = false;
    }
    window.addEventListener('scroll', function(){
      if(!kartenTicking){ kartenTicking = true; requestAnimationFrame(aktiveKarteAktualisieren); }
    }, {passive: true});
    aktiveKarteAktualisieren();
  }

  /* Der Vor/Zurück-Button schwebt fest unten rechts und würde sonst
     dauerhaft über der Fußzeile liegen, sobald man ganz nach unten
     scrollt — dort verdeckte er den Datenschutz-Link. Da es im
     Fußbereich kein weiteres Kapitel mehr gibt, zu dem er führen
     könnte, blendet er hier einfach aus. */
  var footerEl = document.querySelector('footer');
  var stepEl = document.getElementById('step');
  if('IntersectionObserver' in window && footerEl && stepEl){
    var footerWatch = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        stepEl.dataset.hidden = en.isIntersecting ? 'true' : 'false';
      });
    }, {rootMargin: '0px 0px -10% 0px'});
    footerWatch.observe(footerEl);
  }

  /* Kein GSAP mehr nötig — die Kapitelbilder liegen fest im Dokument
     (siehe .chapter__bg), kein Scroll-Handler übernimmt hier mehr
     irgendeine Animation. GSAP wird dadurch nirgends mehr gebraucht
     (siehe <head>), also keine externe Abhängigkeit und ein
     HTTP-Request weniger. */

  /* Galerie: das Wischen/Scrollen selbst macht der Browser nativ über
     scroll-snap (siehe CSS) — kein Drag-Handler nötig. JS übernimmt nur
     drei Dinge: Pfeiltasten-Buttons scrollen um ein Bild weiter, ein
     Klick auf eine Miniatur springt zum passenden Bild, und beim
     Scrollen wird per rAF nachgezogen, welche Miniatur gerade „aktiv"
     (breiter, voll deckend) markiert ist. */
  var galTrack = document.getElementById('galTrack');
  if(galTrack){
    var galSlides = Array.prototype.slice.call(galTrack.children);
    var galThumbBtns = Array.prototype.slice.call(document.querySelectorAll('.gallery__thumb'));
    var galPrev = document.getElementById('galPrev');
    var galNext = document.getElementById('galNext');
    var galTicking = false;
    var galIndex = 0;

    function galAktualisieren(){
      var mitte = galTrack.scrollLeft + galTrack.clientWidth / 2;
      var naechster = 0;
      galSlides.forEach(function(slide, i){
        if(slide.offsetLeft <= mitte) naechster = i;
      });
      galIndex = naechster;
      galThumbBtns.forEach(function(b, i){ b.setAttribute('aria-current', i === galIndex); });
      galPrev.disabled = (galIndex === 0);
      galNext.disabled = (galIndex === galSlides.length - 1);
      galTicking = false;
    }
    galTrack.addEventListener('scroll', function(){
      if(!galTicking){ galTicking = true; requestAnimationFrame(galAktualisieren); }
    }, {passive: true});

    function galSpringeZu(i){
      i = Math.max(0, Math.min(galSlides.length - 1, i));
      galSlides[i].scrollIntoView({behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest'});
    }
    galPrev.addEventListener('click', function(){ galSpringeZu(galIndex - 1); });
    galNext.addEventListener('click', function(){ galSpringeZu(galIndex + 1); });
    galThumbBtns.forEach(function(b){
      b.addEventListener('click', function(){ galSpringeZu(+b.dataset.index); });
    });
    galAktualisieren();

    /* Bildhöhe: der CSS-Wert (min(48svh,520px)) ist nur ein Fallback für
       den ersten Sekundenbruchteil und für Besucher ohne JavaScript —
       eine feste Zahl muss zwangsläufig auf JEDEM Bildschirm passen,
       also blieb auf großen Monitoren viel Platz ungenutzt. Hier wird
       stattdessen gemessen, wie viel Höhe nach Kopfzeile, Beschriftung,
       Miniaturen und Innenabstand tatsächlich noch übrig ist, und genau
       das ausgenutzt — ohne dabei über den Bildschirmrand zu wachsen. */
    var galChapter = document.getElementById('galerie');
    var galWrap = galChapter.querySelector('.wrap');
    function galHoeheAnpassen(){
      galSlides.forEach(function(s){ s.style.height = ''; });
      var basisHoehe = galSlides[0].offsetHeight;
      var cs = getComputedStyle(galChapter);
      var polsterung = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      var restInhalt = galWrap.offsetHeight - basisHoehe;
      var verfuegbar = innerHeight - polsterung - restInhalt - 8;
      /* Ab 240px Bildhöhe greift wie gehabt der übliche Mindestwert
         (genug Platz vorhanden) — reicht der Platz nicht (sehr flaches
         Fenster, z.B. Handy im Querformat), schrumpft das Bild lieber
         weiter (bis zu einem kleinen Sicherheitswert von 90px), statt
         über den verfügbaren Platz hinauszuwachsen: die Polsterung
         unten ist fest für den Abstand zum fixierten Vor/Zurück-Button
         reserviert (siehe #galerie) und darf dafür nicht verdrängt
         werden. */
      var hoehe = verfuegbar >= 240
        ? Math.min(verfuegbar, innerHeight * 0.82)
        : Math.max(verfuegbar, 90);
      galSlides.forEach(function(s){ s.style.height = Math.round(hoehe) + 'px'; });
    }
    galHoeheAnpassen();
    window.addEventListener('resize', galHoeheAnpassen);
  }

  /* Formular — Prototyp, versendet noch nicht */
  document.getElementById('form').addEventListener('submit', function(e){
    e.preventDefault();
    document.getElementById('formNote').textContent =
      'Prototyp: Der Versand wird angebunden, sobald Formspree oder Netlify Forms eingerichtet ist.';
  });
}

/* Auf DOMContentLoaded warten, falls das Skript vor Ende des Markups
   ausgeführt würde — hier nicht mehr der Fall, schadet aber nicht. */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initMLetics);
} else {
  initMLetics();
}
