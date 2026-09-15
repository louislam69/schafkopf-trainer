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

import { legalCards, determinize, isDeclarerSide } from "./engine.js";
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
