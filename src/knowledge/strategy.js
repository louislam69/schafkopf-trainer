/* ============================================================
   STRATEGIE AUS DEM BUCH

   Eine Regel steht genau einmal hier und wird von drei Stellen
   gelesen: von den Bots (so spielen sie), von der Auswertung (so
   wird ein Zug begründet) und vom Regelteil (so wird nachgeschlagen).
   Dadurch kann der Trainer nichts erklären, was die Bots nicht tun.

   Stand: Buch 1, Seiten 8–11 und 20–23.

   Die Blattmuster auf S. 9 und die Sperre auf S. 11 gelten
   unabhängig vom Sitz. Die Kapitel 1.7 und 1.8 sagen aber, dass
   dieselben Karten je nach Platz ein Spiel oder ein „Weiter“ sind —
   dafür ist `SITZREGELN` da. Wer `buchSauspiel()` ohne `sitz`
   aufruft, bekommt weiter die sitzlose Beurteilung.
   ============================================================ */

import { isTrump, countTrumps, sauspielOptions, points } from "../engine.js";

const SAU = (suit) => ({ type: "sauspiel", suit });
const OBER_HOCH = ["EO", "GO", "HO"]; // die drei laufenden Ober

/** Merkmale eines Blattes, in der Sprache des Buches */
export function blattmerkmale(hand, suit) {
  const g = SAU(suit);
  const truempfe = countTrumps(hand, g);
  const hoheOber = OBER_HOCH.filter((c) => hand.indexOf(c) >= 0).length;
  const farben = ["E", "G", "S"].filter((s) => s !== suit);
  const freieFarben = farben.filter((s) => hand.filter((c) => c[0] === s && !isTrump(c, g)).length === 0).length;
  const farbSauen = farben.filter((s) => hand.indexOf(s + "A") >= 0).length;
  // Schmiertrumpf: ein Trumpf mit Augen, den man in einen sicheren Stich geben kann
  const schmiertrumpf = hand.filter((c) => isTrump(c, g) && points(c) >= 10).length;
  return { truempfe, hoheOber, freieFarben, farbSauen, schmiertrumpf, kontrolle: freieFarben + farbSauen };
}

/* ---------------- Ansage: Sauspiel ---------------- */

export const SAUSPIEL_REGELN = [
  {
    id: "urtyp-sauspiel",
    seite: 9,
    titel: "Der Urtyp des soliden Rufspiels",
    kurz: "Fünf Trümpfe, davon einer der drei höchsten Ober, dazu ein Schmiertrumpf und eine freie Farbe.",
    passt: (m) => m.truempfe >= 5 && m.hoheOber >= 1 && m.schmiertrumpf >= 1 && m.freieFarben >= 1,
  },
  {
    id: "variante-zweiter-ober",
    seite: 9,
    titel: "Zusätzlicher Ober statt Schmiertrumpf",
    kurz: "Fünf Trümpfe mit zwei hohen Obern und einer freien Farbe.",
    passt: (m) => m.truempfe >= 5 && m.hoheOber >= 2 && m.freieFarben >= 1,
  },
  {
    id: "variante-farbsau",
    seite: 9,
    titel: "Farb-Sau statt freier Farbe",
    kurz: "Fünf Trümpfe mit hohem Ober und Schmiertrumpf, dazu eine Farb-Sau.",
    passt: (m) => m.truempfe >= 5 && m.hoheOber >= 1 && m.schmiertrumpf >= 1 && m.farbSauen >= 1,
  },
  {
    id: "variante-vier-hohe",
    seite: 9,
    titel: "Nur vier, dafür hohe Trümpfe",
    kurz: "Vier hohe Trümpfe, eine freie Farbe und zusätzlich eine Farb-Sau.",
    passt: (m) => m.truempfe === 4 && m.hoheOber >= 2 && m.freieFarben >= 1 && m.farbSauen >= 1,
  },
  {
    id: "variante-sechs-ohne-ober",
    seite: 9,
    titel: "Sechs Trümpfe ohne laufenden Ober",
    kurz: "Keiner der drei hohen Ober, dafür sechs Trümpfe und zwei freie Farben oder eine Farb-Sau.",
    passt: (m) => m.truempfe >= 6 && m.hoheOber === 0 && (m.freieFarben >= 2 || m.farbSauen >= 1),
  },
];

/* ---------------- Der Sitz am Tisch ---------------- */

/* Kapitel 1.7 und 1.8. Beide Regeln brauchen etwas, das die Muster
   oben nicht kennen: wo ich sitze und was vor mir gesagt wurde.

   1.7 ist dabei eine Sperre, die die Muster oben schon von selbst
   einhalten — mit zwei Farb-Sauen kann keine der beiden anderen
   Farben mehr frei sein, und `variante-vier-hohe` verlangt genau
   das. Sie steht trotzdem hier: sie ist der Grund, warum das Blatt
   liegen bleibt, und ohne sie stünde er nirgends. */
export const SITZREGELN = [
  {
    id: "weiter-mit-zwei-sauen",
    seite: 21,
    kapitel: "1.7",
    titel: "Als Ausspieler sich lieber rufen lassen",
    kurz: "Mit vier Trümpfen und zwei Farb-Sauen sage ich in Vorhand auch einmal „Weiter“ und hoffe, von einem starken Partner gerufen zu werden.",
    art: "sperre",
    greift: (m, sitz) => sitz.position === 0 && m.truempfe <= 4 && m.farbSauen >= 2,
  },
  {
    id: "hinterhand-vier-truempfe",
    seite: 23,
    kapitel: "1.8",
    titel: "In Hinterhand nach drei „Weiter“",
    kurz: "Haben alle drei Vorderleute „Weiter“ gesagt, reichen in Hinterhand auch vier Trümpfe — vorausgesetzt, meine Partei kontrolliert alle drei Farben.",
    art: "freigabe",
    greift: (m, sitz) => sitz.position === 3 && sitz.alleWeiter && m.truempfe === 4 && m.kontrolle >= 2,
  },
];

/** Sperren — Blätter, die das Buch ausdrücklich ablehnt */
export const SAUSPIEL_SPERREN = [
  {
    id: "kontrolle-zwei-farben",
    seite: 9,
    titel: "Kontrolle über mindestens zwei Farben",
    kurz: "Neben der Ruffarbe braucht es eine zweite Farbe, die man frei ist oder mit der Sau hält.",
    greift: (m) => m.kontrolle < 1,
  },
  {
    id: "drei-farben-ohne-sauen",
    seite: 11,
    titel: "Drei Farben ohne Sauen",
    kurz: "Wer alle drei Farben bedienen muss und keine Sau hält, gewinnt oft auch mit fünf Trümpfen nicht.",
    greift: (m) => m.freieFarben === 0 && m.farbSauen === 0,
  },
];

/**
 * Ansage nach dem Buch. Liefert die beste Ruffarbe samt Begründung
 * oder null für „weiter".
 *
 * `sitz` ist optional: { position, alleWeiter }. `position` zählt in
 * der Reihenfolge des Reizens, 0 ist der Ausspieler und 3 die
 * Hinterhand; `alleWeiter` sagt, ob vor mir niemand spielen wollte.
 * Ohne `sitz` bleibt alles wie vorher — die Sitzregeln greifen dann
 * einfach nicht.
 */
export function buchSauspiel(hand, sitz) {
  const s = sitz || {};
  const hatSitz = typeof s.position === "number";
  let beste = null;
  for (const suit of sauspielOptions(hand)) {
    const m = blattmerkmale(hand, suit);
    const sperre = SAUSPIEL_SPERREN.find((x) => x.greift(m)) ||
      (hatSitz ? SITZREGELN.find((x) => x.art === "sperre" && x.greift(m, s)) : undefined);
    if (sperre) { if (!beste) beste = { ansage: null, sperre, suit, m }; continue; }
    const freigabe = hatSitz ? SITZREGELN.find((x) => x.art === "freigabe" && x.greift(m, s)) : undefined;
    const regel = SAUSPIEL_REGELN.find((r) => r.passt(m)) || freigabe;
    if (!regel) continue;
    const rang = m.truempfe + m.hoheOber + m.kontrolle;
    if (!beste || !beste.regel || rang > beste.rang) beste = { ansage: { type: "sauspiel", suit }, regel, suit, m, rang };
  }
  return beste && beste.ansage ? beste : beste ? { ...beste, ansage: null } : null;
}

export const ALLE_REGELN = [...SAUSPIEL_REGELN, ...SAUSPIEL_SPERREN, ...SITZREGELN];
export const regelById = (id) => ALLE_REGELN.find((r) => r.id === id) || null;
