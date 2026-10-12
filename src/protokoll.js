import { newDeal, playCard, gibKontra, bidRank, settle, isDeclarerSide, legalCards } from "./engine.js";
import { applyGame, reizung } from "./table.js";

/* ============================================================
   DAS PROTOKOLL ECHTER PARTIEN (Aufgabe 9, Paket P8)

   Alles bisher Gemessene vergleicht Bots mit Bots. Wo *Menschen*
   Fehler machen, welcher Grundsatz am häufigsten verletzt wird und
   ob er nach der Nachbesprechung seltener wird, ruhte auf keiner
   Zahl. Dieses Modul schreibt deshalb jedes Blatt mit, das am Tisch
   gespielt wird — und zwar **roh**: Geber, die 32 Karten, die
   Ansagen, wer wann gespritzt hat, jede Karte in der Reihenfolge, in
   der sie fiel, und vor welchem Zug der Hinweis offen war.

   Das Urteil gehört ausdrücklich *nicht* zum Protokoll. Würde der
   Verlust je Zug festgehalten, wären alte Blätter nach der nächsten
   Regeländerung nicht mehr mit neuen vergleichbar. `nachspielen`
   baut aus dem rohen Eintrag jeden Zustand wieder auf, an dem der
   Mensch entscheiden musste — daraus lässt sich das Urteil jederzeit
   neu rechnen. Was die Oberfläche trotzdem unter `urteil` ablegt, ist
   ein Zwischenspeicher mit Stand (`URTEIL_STAND`): die
   Nachbesprechung braucht je Blatt rund 0,3 s, und eine Statistik
   über tausend Blätter soll nicht jedes Mal fünf Minuten rechnen.

   Bewusst nur lokal, unter einem eigenen Schlüssel in `localStorage`.
   Name plus vollständige Spielhistorie ist eine personenbezogene
   Aufzeichnung; solange sie das Gerät nicht verlässt, braucht es
   keine Einwilligung, aber ein Löschen (`loescheProtokoll`). Eine
   Fassung, die Daten über mehrere Spieler sammelt, wäre ein Server —
   das erste Stück Infrastruktur dieses Projekts und eine eigene
   Entscheidung (ARBEITSSTAND, „Idee: Spielername").

   Platz: Karten als zwei Zeichen, Blatt und Spielverlauf je 64
   Zeichen, Ansagen als kleine Objekte. Ohne Urteil rund 400 Bytes je
   Blatt (test/protokoll.js zählt nach, mit Hinweisen), mit Urteil gut
   das Doppelte; 2000 Blätter bleiben unter zwei Megabyte, weit unter
   den fünf, die ein Browser hergibt.
   ============================================================ */

const KEY = "schafkopf.protokoll.v1";
export const HOECHSTENS = 2000;

/* Hochzählen, wenn sich ändert, *wie* geurteilt wird — Schwelle,
   Welten, Grundsätze. Ein Urteil mit älterem Stand gilt dann als
   unbewertet, und die Statistik bietet an, es neu zu rechnen. Das
   rohe Blatt bleibt davon unberührt; genau dafür ist es roh. */
export const URTEIL_STAND = 1;

export function ladeProtokoll() {
  try {
    const raw = localStorage.getItem(KEY);
    const liste = raw ? JSON.parse(raw) : [];
    return Array.isArray(liste) ? liste : [];
  } catch (e) {
    return [];
  }
}

/* Ist der Speicher voll, gehen die ältesten Blätter zuerst — halbiert,
   bis es passt. Das Protokoll ist ein Lernwerkzeug, kein Archiv. */
export function speichereProtokoll(liste) {
  if (liste.length > HOECHSTENS) liste.splice(0, liste.length - HOECHSTENS);
  for (;;) {
    try {
      localStorage.setItem(KEY, JSON.stringify(liste));
      return true;
    } catch (e) {
      if (liste.length < 2) return false;
      liste.splice(0, Math.ceil(liste.length / 2));
    }
  }
}

export function loescheProtokoll() {
  try { localStorage.removeItem(KEY); } catch (e) { /* privater Modus */ }
}

/* ---------------- Mitschreiben ---------------- */

/**
 * Ein neuer Eintrag, sobald das Spiel steht. Zusammengeworfene Blätter
 * kommen nicht hinein — gespielt wurde dort nichts.
 *
 * @param ansagen  in der Reihenfolge des Reizens (`seatOrder(geber)`),
 *   je Sitz die Ansage oder null für „weiter"
 * @param stufe    die Stufe der drei Bots; Sitz 0 ist der Mensch
 */
export function neuerEintrag({ name, stufe, geber, orig, ansagen }) {
  return {
    id: "p" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36),
    zeit: Date.now(),
    name: name || "",
    stufe,
    geber,
    blatt: orig.map((h) => h.join("")).join(""),
    ansagen: ansagen.map((b) => (b ? { ...b } : null)),
    /* [Sitz, Zahl der Karten, die da schon lagen] — die Spritze geht
       nur, bis die zweite Karte liegt, also steht dort 0 oder 1. */
    kontra: [],
    karten: "",
    /* Index der Karte → was der Hinweis vor diesem Zug sagte. Das ist
       ein Ereignis am Tisch, kein Urteil: was der Spieler sah, bleibt,
       auch wenn das Buch später anders spielt. */
    tipps: {},
    angesehen: false,
  };
}

export const gelegt = (e) => e.karten.length / 2;
export const fertig = (e) => e.karten.length === 64;

export function karteMitschreiben(e, card, tipp) {
  if (tipp) e.tipps[gelegt(e)] = { karte: tipp.karte, abgeraten: tipp.abgeraten || [] };
  e.karten += card;
}

export function kontraMitschreiben(e, p) {
  e.kontra.push([p, gelegt(e)]);
}

/* ---------------- Nachspielen ---------------- */

const karten = (s) => s.match(/../g) || [];

/**
 * Baut aus dem rohen Eintrag das Blatt wieder auf, Zug für Zug.
 *
 * @returns `st` — der Zustand nach der letzten protokollierten Karte —
 *   und `entscheidungen`, genau in der Form, die `buildReview` aus der
 *   Oberfläche bekommt: der Zustand vor jedem Zug des Menschen, seine
 *   Karte und der Hinweis, falls er offen war.
 * @throws wenn eine Karte im nachgespielten Zustand nicht erlaubt ist —
 *   dann passt das Protokoll nicht zur Engine, und jedes Urteil darüber
 *   wäre erfunden.
 */
export function nachspielen(e) {
  const blatt = karten(e.blatt);
  const hands = [0, 1, 2, 3].map((i) => blatt.slice(i * 8, i * 8 + 8));
  let st = { ...newDeal(e.geber, () => 0), hands, orig: hands.map((h) => h.slice()) };

  const reihe = [1, 2, 3, 4].map((i) => (e.geber + i) % 4);
  const bids = e.ansagen.map((bid, i) => ({ p: reihe[i], bid }));
  let best = null;
  for (const b of bids) if (bidRank(b.bid) > bidRank(best && best.bid)) best = b;
  if (!best) throw new Error(`Protokoll ${e.id}: niemand hat angesagt`);
  st = applyGame(st, best.bid, best.p, reizung(bids, (p) => (p === 0 ? null : e.stufe)));

  const entscheidungen = [];
  const gespielt = karten(e.karten);
  for (let k = 0; k <= gespielt.length; k++) {
    for (const [p, nach] of e.kontra) if (nach === k) st = gibKontra(st, p);
    if (k === gespielt.length) break;
    const p = st.turn, card = gespielt[k];
    if (legalCards(st, p).indexOf(card) < 0) {
      throw new Error(`Protokoll ${e.id}: ${card} ist in Zug ${k + 1} für Sitz ${p} nicht erlaubt`);
    }
    if (p === 0) entscheidungen.push({ state: st, p, card, tipp: e.tipps[k] || null });
    st = playCard(st, p, card);
  }
  return { st, entscheidungen };
}

/** Welche Rolle der Mensch hatte und ob seine Seite gewann. */
export function ausgang(st) {
  const rolle = st.declarer === 0 ? "spielmacher"
    : st.game.type === "sauspiel" && st.partner === 0 ? "partner" : "gegen";
  return { rolle, gewonnen: settle(st).declWins === isDeclarerSide(st, 0) };
}

/* Die Stelle eines Zuges im Protokoll — aus dem Zustand davor. */
export const zugIndex = (st) => st.tricks.length * 4 + st.trick.length;

/* ---------------- Statistik ---------------- */

export const ROLLEN = [
  { id: "spielmacher", name: "Spielmacher" },
  { id: "partner", name: "Partner" },
  { id: "gegen", name: "Gegenspieler" },
];

/**
 * Die Auswertung über viele Blätter — rein aus den gespeicherten
 * Urteilen, ohne zu rechnen.
 *
 * Eine Fehlerart ist ein Grundsatz aus `tacticalNotes`. Gezählt wird
 * gegen die **Gelegenheiten**: die Züge, in denen er überhaupt zwischen
 * den Karten unterschied (`grundsaetzeVorDemZug`, dieselbe Prüfung wie
 * der Hinweisknopf). „Zehnmal gegen den Grundsatz" heißt wenig ohne
 * „in wie vielen Zügen ging es darum".
 *
 * Vor und nach der Nachbesprechung: ab dem ersten Blatt, dessen
 * Auswertung der Spieler geöffnet hat und in dem er gegen den Grundsatz
 * verstieß, zählen die folgenden Blätter als „nachher". Das Blatt
 * selbst zählt noch zu vorher — gespielt war es, bevor er es las.
 *
 * Fehlermaß gibt es hier keines, nur Zählungen. Ein Spieler mit dreißig
 * Blättern hat für eine Wahrscheinlichkeit zu wenig, und die Oberfläche
 * sagt die Zahlen deshalb als „3 von 40", nicht als Prozent.
 */
export function statistik(liste, name) {
  const wer = name || "";
  const eigene = liste.filter((e) => (e.name || "") === wer);
  const fertige = eigene.filter(fertig);
  const bewertet = fertige.filter((e) => e.urteil && e.urteil.stand === URTEIL_STAND);
  const s = {
    blaetter: bewertet.length,
    unbewertet: fertige.length - bewertet.length,
    abgebrochen: eigene.length - fertige.length,
    andereNamen: liste.length - eigene.length,
    gewonnen: 0,
    zuege: 0, teuer: 0, verlust: 0,
    rollen: Object.fromEntries(ROLLEN.map((r) => [r.id, { blaetter: 0, gewonnen: 0, zuege: 0, teuer: 0, verlust: 0 }])),
    ohneGrundsatz: 0,
    buch: { griff: 0, gefolgt: 0 },
    mitHinweis: 0,
    arten: [],
  };
  const arten = new Map();
  const art = (id) => {
    if (!arten.has(id)) {
      arten.set(id, { id, gelegenheiten: 0, verstoesse: 0, teuer: 0, gelesen: false, vorher: { g: 0, v: 0 }, nachher: { g: 0, v: 0 } });
    }
    return arten.get(id);
  };
  for (const e of bewertet) {
    const u = e.urteil;
    const r = s.rollen[u.rolle];
    s.gewonnen += u.gewonnen ? 1 : 0;
    r.blaetter++;
    r.gewonnen += u.gewonnen ? 1 : 0;
    s.mitHinweis += Object.keys(e.tipps || {}).length;
    /* Erst zählen, dann erst als gelesen markieren: das Blatt mit der
       ersten Nachbesprechung gehört noch zu vorher. */
    const neuGelesen = [];
    for (const z of u.zuege) {
      s.zuege++; r.zuege++;
      s.verlust += z.v; r.verlust += z.v;
      if (z.f) { s.teuer++; r.teuer++; }
      if (z.r) { s.buch.griff++; if (z.g) s.buch.gefolgt++; }
      const verstossen = z.ids.filter((id) => z.m.indexOf(id) >= 0);
      if (z.f && !verstossen.length) s.ohneGrundsatz++;
      for (const id of z.m) {
        const a = art(id);
        const v = verstossen.indexOf(id) >= 0;
        const phase = a.gelesen ? a.nachher : a.vorher;
        a.gelegenheiten++; phase.g++;
        if (v) {
          a.verstoesse++; phase.v++;
          if (z.f) a.teuer++;
          if (e.angesehen && !a.gelesen) neuGelesen.push(a);
        }
      }
    }
    for (const a of neuGelesen) a.gelesen = true;
  }
  s.arten = [...arten.values()]
    .filter((a) => a.verstoesse > 0)
    .sort((a, b) => b.teuer - a.teuer || b.verstoesse - a.verstoesse || b.gelegenheiten - a.gelegenheiten);
  return s;
}
