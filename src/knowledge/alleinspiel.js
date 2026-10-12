/* ============================================================
   ANSAGE EINES ALLEINSPIELS NACH DEM BUCH
   Buch 3, Kapitel 4.1 (Seite 113) und 4.3 (Seite 117).

   Das Buch zählt nicht Trümpfe, sondern Stiche: „Gebe ich unter
   Zugrundelegung einer normalen Kartenverteilung nicht mehr als
   drei Stiche ab, ziehe ich grundsätzlich ein Alleinspiel in
   Betracht." Und es zählt sie getrennt, weil in den drei Farben
   75 der 120 Augen liegen und im Trumpf nur 45: bei gleicher
   Stichzahl ist die Variante besser, bei der mehr davon
   Trumpfstiche sind.

   Beides steht hier als Rechnung. Sie ist eine Schätzung, keine
   Wahrheit — wie genau sie ist, misst test/buchsolo.js.
   ============================================================ */

import { SUITS, RANKVAL, makeDeck, isTrump, power, trumpSuitOf, countTrumps, toutMoeglich } from "../engine.js";

/**
 * Trumpfstiche, die voraussichtlich an die Gegner gehen.
 *
 * Meine Trümpfe und die fehlenden werden absteigend nebeneinander
 * gelegt. Mein höchster deckt ihren höchsten, mein zweiter ihren
 * zweiten und so fort; jedes Paar, bei dem ihre Karte die höhere
 * ist, kostet einen Stich. Haben sie mehr Trümpfe als ich, zählt
 * jeder überzählige ebenfalls, denn den kann ich nicht mehr decken.
 */
export function trumpfstiche(hand, g) {
  const alle = makeDeck().filter((c) => isTrump(c, g));
  const stark = (a, b) => power(b, g) - power(a, g);
  const meine = hand.filter((c) => isTrump(c, g)).sort(stark);
  const ihre = alle.filter((c) => hand.indexOf(c) < 0).sort(stark);
  let verluste = 0;
  for (let i = 0; i < ihre.length; i++) {
    if (i >= meine.length || power(ihre[i], g) > power(meine[i], g)) verluste++;
  }
  return verluste;
}

/**
 * Farbstiche, die voraussichtlich an die Gegner gehen.
 *
 * In einer Farbe hält der oberste Lauf von der Sau abwärts die
 * Stiche — Sau, dann die Zehn nur mit der Sau dahinter und so
 * weiter. Alles darunter ist ein Verlustkandidat. Mehr als zwei
 * Runden hält eine Farbe selten durch, ehe jemand frei ist,
 * deshalb zählen je Farbe höchstens zwei Verluste. Eine Farbe,
 * die ich gar nicht habe, kostet keinen Farbstich: dort steche
 * ich ein (was Kapitel 4.4 bis 4.6 behandeln).
 */
export function farbstiche(hand, g) {
  let verluste = 0;
  for (const s of SUITS) {
    if (s === trumpSuitOf(g)) continue;
    const meine = hand.filter((c) => c[0] === s && !isTrump(c, g))
      .sort((a, b) => RANKVAL[b[1]] - RANKVAL[a[1]]);
    if (!meine.length) continue;
    const hoechste = makeDeck().filter((c) => c[0] === s && !isTrump(c, g))
      .sort((a, b) => RANKVAL[b[1]] - RANKVAL[a[1]]);
    let lauf = 0;
    while (lauf < meine.length && meine[lauf] === hoechste[lauf]) lauf++;
    verluste += Math.min(meine.length - lauf, 2);
  }
  return verluste;
}

/** Die Stichrechnung des Buches für ein bestimmtes Alleinspiel. */
export function stichschaetzung(hand, g) {
  const t = trumpfstiche(hand, g);
  const f = farbstiche(hand, g);
  return { trumpfstiche: t, farbstiche: f, gesamt: t + f };
}

export const ALLEINSPIEL_REGELN = [
  {
    id: "alleinspiel-wagen",
    seite: 113,
    titel: "Höchstens drei abgegebene Stiche",
    kurz: "Ein Alleinspiel kommt in Frage, wenn ich bei normaler Verteilung nicht mehr als drei Stiche hergeben muss.",
  },
  {
    id: "trumpfstiche-billiger-als-farbstiche",
    seite: 117,
    titel: "Bei gleicher Stichzahl die Variante mit mehr Trumpfstichen",
    kurz: "Abgegebene Trumpfstiche kosten im Schnitt weniger Augen als abgegebene Farbstiche.",
  },
  {
    id: "kein-herz-solo-nach-spielwunsch",
    seite: 125,
    titel: "Kein knappes Herz-Spiel nach fremdem Spielwunsch",
    kurz: "Hat jemand vor mir schon Spiellust gezeigt, lasse ich ein nicht ganz sicheres Solo oder Wenz in Herz sein.",
  },
];

const GRENZE = 3; // Kapitel 4.1
const SICHER = 2; // „nicht ganz sicher" im Sinne von Kapitel 4.7

/**
 * Ansage eines Alleinspiels nach dem Buch.
 *
 * @param hand            acht Karten
 * @param vorSpielwunsch  hat ein Spieler vor mir bereits angesagt?
 * @returns { ansage, schaetzung, regel } oder null für „weiter"
 */
export function buchAlleinspiel(hand, vorSpielwunsch = false) {
  /* Nur Farbsolo. Die Stichrechnung des Buches steht in einem
     Kapitel über das Farbsolo; unverändert auf den Wenz übertragen
     sagt sie deutlich zu oft an. Der Wenz hat deshalb seine eigene
     Zählung, `wenzstiche` weiter unten. */
  /* Nur Farbsolo — und das aus einem gemessenen Grund. Die
     Stichrechnung zählt abgegebene Stiche; wie viele das sind, hängt
     an der Zahl der Trümpfe. Ein Farbwenz hat nur zehn statt
     vierzehn und schneidet in dieser Rechnung deshalb systematisch
     zu gut ab: probeweise mit aufgenommen, wurde er in 600 Blättern
     57-mal angesagt gegen 24 Farbsoli. Die Rechnung darf Blätter
     innerhalb einer Spielart vergleichen, nicht Spielarten
     untereinander. Über den Farbwenz entscheidet deshalb Kapitel
     4.14 in botBid(), über den Wenz `buchWenz`. */
  const kandidaten = SUITS.map((s) => ({ type: "solo", suit: s }));
  let beste = null, ausFarbe = false, verworfenHerz = false;
  for (const g of kandidaten) {
    const sch = stichschaetzung(hand, g);
    if (sch.gesamt > GRENZE) continue;
    // Kapitel 4.7: die Trümpfe des Vordermanns stehen bei einem
    // Herz-Spiel geschlossen gegen mich.
    if (vorSpielwunsch && g.type === "solo" && g.suit === "H" && sch.gesamt > SICHER) {
      verworfenHerz = true;
      continue;
    }
    if (!beste || sch.gesamt < beste.schaetzung.gesamt) {
      beste = { ansage: g, schaetzung: sch };
      ausFarbe = false;
    } else if (sch.gesamt === beste.schaetzung.gesamt && sch.farbstiche < beste.schaetzung.farbstiche) {
      // Kapitel 4.3: bei gleicher Stichzahl die Variante mit den
      // wenigeren Farbstichen.
      beste = { ansage: g, schaetzung: sch };
      ausFarbe = true;
    }
  }
  if (!beste) return verworfenHerz ? { ansage: null, regel: ALLEINSPIEL_REGELN[2] } : null;
  /* Trägt das Blatt alle acht Stiche, wird aus dem Spiel ein Tout.
     `toutMoeglich` prüft dafür die sichere Seite: genug Laufende, um
     sämtliche gegnerischen Trümpfe zu ziehen, und lückenlos besetzte
     Fehlfarben. Ein verlorener Tout kostet doppelt — die Schwelle
     darf also nicht hoffnungsvoll sein. */
  const ansage = toutMoeglich(hand, beste.ansage) ? { ...beste.ansage, tout: true } : beste.ansage;
  return { ...beste, ansage, regel: ALLEINSPIEL_REGELN[ausFarbe ? 1 : 0] };
}

/**
 * Die Stichrechnung für den reinen Wenz (Aufgabe 11).
 *
 * Die des Farbsolos auf den Wenz übertragen sagt viel zu oft an
 * (`npm run wenz`: bis drei Stiche 2468 Wenz statt 1048, und jeder
 * kostet): sie hält eine blanke Farbe für einen Einstich und kappt
 * die Verluste je Farbe bei zwei. Mit vier Trümpfen, zwei davon beim
 * Gegner, sticht man nicht ein, und eine Farbe ohne Sau läuft auch in
 * der dritten Runde nicht. Gezählt wird deshalb so:
 *
 *   - die Unterstiche wie beim Solo (`trumpfstiche`);
 *   - jede Farbkarte unter dem obersten Lauf von der Sau abwärts,
 *     ohne Kappung;
 *   - ein Stich mehr mit nur zwei Untern: die anderen beiden stechen
 *     die Farben, sobald meine gezogen sind;
 *   - ein Stich weniger mit drei Sauen.
 *
 * Die beiden letzten Posten sind nicht gelesen, sondern gemessen: mit
 * drei Untern oder drei Sauen bringt dasselbe Blatt im Mittel so viel
 * mehr, wie ein Stich weniger ausmacht (ARBEITSSTAND, „Die Ansage des
 * Wenz").
 */
export function wenzstiche(hand) {
  const g = { type: "wenz" };
  const unter = hand.filter((c) => c[1] === "U").length;
  let farbe = 0, sauen = 0;
  for (const s of SUITS) {
    const meine = hand.filter((c) => c[0] === s && !isTrump(c, g))
      .sort((a, b) => RANKVAL[b[1]] - RANKVAL[a[1]]);
    if (!meine.length) continue;
    const hoechste = makeDeck().filter((c) => c[0] === s && !isTrump(c, g))
      .sort((a, b) => RANKVAL[b[1]] - RANKVAL[a[1]]);
    let lauf = 0;
    while (lauf < meine.length && meine[lauf] === hoechste[lauf]) lauf++;
    farbe += meine.length - lauf;
    if (lauf) sauen++;
  }
  const t = trumpfstiche(hand, g);
  return { trumpfstiche: t, farbstiche: farbe, unter, sauen, gesamt: t + farbe + (unter === 2 ? 1 : 0) - (sauen >= 3 ? 1 : 0) };
}

/**
 * Der reine Wenz nach dieser Stichrechnung.
 *
 * @param grenze  höchstens so viele abgegebene Stiche; negativ heißt
 *                „nie" — dann entscheidet wenzStrength() in botBid().
 * @returns die Ansage oder null
 */
export function buchWenz(hand, grenze) {
  if (!(grenze >= 0)) return null;
  const g = { type: "wenz" };
  const sch = wenzstiche(hand);
  if (sch.unter < 2 || sch.gesamt > grenze) return null;
  return toutMoeglich(hand, g) ? { ...g, tout: true } : g;
}
