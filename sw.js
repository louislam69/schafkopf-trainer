/* Offline-Cache. Wird nur über https registriert, damit die Entwicklung
   auf localhost immer die frischen Dateien lädt.

   FILES muss alle Dateien der App enthalten, sonst fehlt beim ersten
   Offline-Start ein Modul. Weil die Liste beim Anlegen neuer Dateien
   gern vergessen wird, prüft test/pwa.js sie gegen den Ordner src.
   Wer hier etwas ändert, zählt CACHE hoch. */
const CACHE = "schafkopf-v10";
const FILES = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest",
  "./icon.svg", "./src/cards.js", "./src/coach.js", "./src/dds.js", "./src/engine.js",
  "./src/knowledge/alleinspiel.js", "./src/knowledge/book.js", "./src/knowledge/buch2.js", "./src/knowledge/buch3.js", "./src/knowledge/buch4.js", "./src/knowledge/buch5.js",
  "./src/knowledge/buch1.js", "./src/knowledge/buecher.js", "./src/knowledge/glossar.js", "./src/knowledge/goldene-regeln.js", "./src/knowledge/play-rules.js", "./src/knowledge/principles.js", "./src/knowledge/spritze.js", "./src/knowledge/strategy.js",
  "./src/pimc.js", "./src/table.js", "./src/ui.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request))
  );
});
