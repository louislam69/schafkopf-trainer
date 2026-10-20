/* ============================================================
   PIMC — Perfect Information Monte Carlo

   Der Spieler, der aus dem Löser wird. Das Verfahren ist alt und
   bewährt: es steckt in GIB (Bridge) und in Kermit, dem stärksten
   Skat-Programm, das auf Expertenniveau spielt.

     1. Viele Verteilungen der unbekannten Karten auswürfeln, die zu
        allem passen, was am Tisch beobachtet wurde.
     2. Jede davon exakt lösen, als lägen alle Blätter offen.
     3. Die Karte spielen, die über alle Verteilungen am häufigsten
        zum Sieg führt.

   Gemessen wird pro Verteilung eine Ja/Nein-Frage — „reicht es noch
   für 61?" —, nicht ein Augenwert. Das ist die Frage, die das Spiel
   stellt, und sie lässt sich viel schneller beantworten. Über viele
   Verteilungen gemittelt wird daraus wieder eine feine Abstufung:
   der Anteil der Welten, in denen diese Karte gewinnt.

   WO ES GREIFT. Ein volles Blatt zu lösen kostet rund 470 ms, mit
   sechs offenen Stichen noch 13 ms, mit fünf eine Millisekunde. Die
   ersten beiden Stiche sind also teuer — und dort nützt das Lösen am
   wenigsten, weil bei acht unbekannten Karten je Gegner eine Handvoll
   Verteilungen ohnehin nichts über die wahre Lage sagt. Deshalb
   spielt PIMC ab dem dritten Stich und überlässt die Eröffnung der
   Heuristik und den Buchregeln.

   WAS ES NICHT KANN. PIMC hält in jeder einzelnen Welt alle Karten
   für offen und übersieht deshalb zweierlei: dass die Gegner in
   Wahrheit raten müssen (sie spielen hier zu gut), und dass die
   eigenen Karten kein Signal mehr geben müssen, weil in dieser Welt
   ohnehin alles bekannt ist. Die Fachbegriffe dafür sind „strategy
   fusion" und „non-locality". Für die Endstiche, um die es hier
   geht, wiegt beides wenig.
   ============================================================ */

import {
  legalCards, determinize, isDeclarerSide, playCard, rollout, sidePoints, withSampledPartner,
} from "./engine.js";
import { tabellen, loeser } from "./dds.js";

/* Die Tabellen hängen nur an der Spielart, nicht am Blatt — einmal
   je Spielart genügt für alle Verteilungen aller Partien. */
const tabellenCache = new Map();
function tabellenFuer(g) {
  const schluessel = g.type + (g.suit || "") + (g.tout ? "T" : "");
  let t = tabellenCache.get(schluessel);
  if (!t) { t = tabellen(g); tabellenCache.set(schluessel, t); }
  return t;
}

/** Ab wann sich das Lösen lohnt: höchstens so viele offene Stiche. */
export const PIMC_AB_STICH = 6;

/**
 * Die Schwelle, auf die in dieser Stellung gespielt wird.
 *
 * Normalerweise sind es 61 Augen. Steht der Sieg schon fest, spielt
 * die Spielerpartei auf den Schneider weiter; ist er nicht mehr zu
 * erreichen, geht es nur noch darum, ihn selbst zu vermeiden. Beides
 * zählt in der Abrechnung, und ein Löser, der auf eine längst
 * entschiedene Frage antwortet, gäbe sonst allen Karten denselben
 * Wert.
 */
export function schwelleFuer(schon, gegen) {
  const offen = 120 - schon - gegen;
  if (schon >= 61) return Math.max(1, 91 - schon);          // gewonnen: Schneider anstreben
  if (schon + offen < 61) return Math.max(1, 31 - schon);   // verloren: Schneider vermeiden
  return 61 - schon;
}

/**
 * Die beste Karte für `p` nach PIMC — oder null, wenn die Stellung
 * dafür noch zu früh ist. Der Aufrufer spielt dann weiter wie bisher.
 */
export function pimcZug(st, p, welten, rng) {
  if (!st.game || st.phase !== "play") return null;
  const legal = legalCards(st, p);
  if (legal.length < 2) return legal[0] || null;
  if (8 - st.tricks.length > PIMC_AB_STICH) return null;

  const t = tabellenFuer(st.game);
  const summe = new Map();
  legal.forEach((c) => summe.set(c, 0));

  for (let i = 0; i < welten; i++) {
    const d = determinize(st, p, rng);
    const seite = [0, 1, 2, 3].map((q) => isDeclarerSide(d, q));
    let schon = 0, gegen = 0;
    for (let q = 0; q < 4; q++) (seite[q] ? (schon += d.won[q]) : (gegen += d.won[q]));

    const l = loeser(t, d.hands, d.trick, p, d.sauFree, seite);
    for (const w of l.zugwerte(schwelleFuer(schon, gegen))) {
      if (summe.has(w.card)) summe.set(w.card, summe.get(w.card) + w.value);
    }
  }

  let beste = legal[0], bester = -1;
  for (const c of legal) {
    const v = summe.get(c);
    if (v > bester) { bester = v; beste = c; }
  }
  return beste;
}

/**
 * Wie sicher ist sich PIMC? Liefert für jede erlaubte Karte den
 * Anteil der Verteilungen, in denen sie zum Ziel führt — für die
 * Nachbesprechung und zum Prüfen.
 */
export function pimcWerte(st, p, welten, rng) {
  const legal = legalCards(st, p);
  const t = tabellenFuer(st.game);
  const summe = new Map();
  legal.forEach((c) => summe.set(c, 0));
  for (let i = 0; i < welten; i++) {
    const d = determinize(st, p, rng);
    const seite = [0, 1, 2, 3].map((q) => isDeclarerSide(d, q));
    let schon = 0, gegen = 0;
    for (let q = 0; q < 4; q++) (seite[q] ? (schon += d.won[q]) : (gegen += d.won[q]));
    const l = loeser(t, d.hands, d.trick, p, d.sauFree, seite);
    for (const w of l.zugwerte(schwelleFuer(schon, gegen))) {
      if (summe.has(w.card)) summe.set(w.card, summe.get(w.card) + w.value);
    }
  }
  return legal
    .map((c) => ({ card: c, anteil: summe.get(c) / welten }))
    .sort((a, b) => b.anteil - a.anteil);
}

/* ============================================================
   DER SCHIEDSRICHTER DER NACHBESPRECHUNG

   Bis zum 21.09.2026 urteilte die Nachbesprechung mit
   `perfectEvaluate`: jede Karte auf dem *echten* Blatt zu Ende
   gespielt, gezählt in Augen. Das ist ein Urteil mit dem Wissen
   hinterher. Ein richtiger Zug, der in die eine schlechte Verteilung
   läuft, galt als Fehler — und 36 % aller Züge wurden markiert, nicht
   aus Rauschen (eine zweite Saat kippte ein einziges von 301 Urteilen),
   sondern weil der Bezugspunkt falsch war. Im Bridge ist das bekannt:
   die Analyse mit offenen Karten taugt nicht als Maßstab für ein
   einzelnes Blatt.

   Hier wird deshalb über die Verteilungen geurteilt, die der Spieler
   für möglich halten musste — ausgewürfelt mit `determinize`, also
   passend zu Farbfreiheit, Rufsau, Ruffarbe und Reizung. Drei
   Entscheidungen gehören dazu:

   GEPAART. Jede Karte wird auf *denselben* Welten gespielt. Der
   Unterschied zweier Karten stammt dann aus der Karte, nicht aus der
   Verteilung — dieselbe Regel, nach der `npm run sieg` misst.

   SIEG STATT AUGEN. Gezählt wird, ob die eigene Partei ihr Ziel
   erreicht: 61, oder — steht es schon fest — Schneider machen bzw.
   vermeiden (`schwelleFuer`), beim Tout alle Stiche. Die Augen laufen
   nebenher mit. Zehn Augen bei 75 sind nicht zehn Augen bei 55;
   Schach bewertet aus demselben Grund in Gewinnwahrscheinlichkeit
   statt in Bauerneinheiten.

   AUSGESPIELT WIRD MIT DER HEURISTIK, NICHT MIT DEM LÖSER. Der Löser
   unterstellt nach dem Zug in jeder Welt perfektes Spiel mit offenen
   Karten (strategy fusion). Ab dem dritten Stich wäre er bezahlbar,
   aber dann hießen 70 % im zweiten Stich etwas anderes als im vierten.
   Ein Maßstab für die ganze Partie ist wichtiger als ein schärferer
   für ihr Ende. Der Preis: „beste Karte" heißt, beste, wenn danach
   alle auf Stufe 1 weiterspielen.
   ============================================================ */

/** Hat die Partei des Spielmachers am Ende ihr Ziel erreicht? */
function spielerErreicht(end, ziel) {
  if (end.game.tout) return end.tricks.every((t) => isDeclarerSide(end, t.winner));
  return sidePoints(end, end.declarer) >= ziel;
}

/** Das Ziel der Spielerpartei in dieser Welt, in Augen am Ende. */
function zielFuer(welt) {
  let schon = 0, gegen = 0;
  for (let q = 0; q < 4; q++) (isDeclarerSide(welt, q) ? (schon += welt.won[q]) : (gegen += welt.won[q]));
  return schon + schwelleFuer(schon, gegen);
}

/**
 * Jede erlaubte Karte von `p` auf denselben `welten` Verteilungen.
 * Liefert je Karte den Anteil der Welten, in denen `p`s Partei ihr
 * Ziel erreicht, die mittleren Augen und die Ergebnisse je Welt (für
 * den gepaarten Vergleich). Beste Karte zuerst.
 */
export function infoWerte(st, p, welten, rng) {
  const legal = legalCards(st, p);
  const reihen = legal.map(() => ({ siege: new Uint8Array(welten), augen: 0 }));
  for (let i = 0; i < welten; i++) {
    const d = determinize(st, p, rng);
    const ziel = zielFuer(d);
    for (let k = 0; k < legal.length; k++) {
      const end = rollout(playCard(d, p, legal[k]), rng);
      reihen[k].siege[i] = isDeclarerSide(end, p) === spielerErreicht(end, ziel) ? 1 : 0;
      reihen[k].augen += sidePoints(end, p);
    }
  }
  return legal
    .map((card, k) => ({
      card,
      anteil: reihen[k].siege.reduce((a, x) => a + x, 0) / welten,
      augen: reihen[k].augen / welten,
      siege: reihen[k].siege,
    }))
    .sort((a, b) => b.anteil - a.anteil || b.augen - a.augen);
}

/**
 * Wie viel besser ist `a` als `b`, gepaart über dieselben Welten —
 * mit Standardfehler. Ohne den ist ein Unterschied keine Aussage.
 */
export function vorsprung(a, b) {
  const n = a.siege.length;
  let s = 0, s2 = 0;
  for (let i = 0; i < n; i++) { const d = a.siege[i] - b.siege[i]; s += d; s2 += d * d; }
  const mittel = s / n;
  const varianz = n > 1 ? (s2 - n * mittel * mittel) / (n - 1) : 0;
  return { diff: mittel, fehler: Math.sqrt(Math.max(0, varianz) / n) };
}

/**
 * Wie die Karte auf dem echten Blatt ausgegangen wäre — der Blick mit
 * dem Wissen hinterher. Er urteilt nicht, er liefert die Zeile über
 * Glück und Pech: eine Karte, die nur hier gewonnen hätte, war kein
 * Fehler, sondern hätte Glück gebraucht.
 */
export function echtErreicht(st, p, card, rng) {
  const real = withSampledPartner(st);
  const end = rollout(playCard(real, p, card), rng);
  return isDeclarerSide(end, p) === spielerErreicht(end, zielFuer(real));
}
