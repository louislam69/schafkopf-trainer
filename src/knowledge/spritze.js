/* ============================================================
   WANN GEBE ICH EINE SPRITZE?

   Die Spritze verdoppelt den Spielwert. Sie ist damit die einzige
   Entscheidung im Spiel, die nichts mit einer Karte zu tun hat und
   trotzdem so viel kostet wie ein halbes Solo — entsprechend eng
   fasst das Buch die Voraussetzungen.

     3.5   Für eine Spritze kontrolliere ich möglichst zwei Farben
           und habe berechtigte Hoffnung auf vier Stiche.
     3.12  Zwei absehbare punktreiche Farbstiche und ein sicherer
           Trumpfstich reichen ebenfalls.

   Beide Regeln stehen im Kapitel über das Sauspiel. Gegen ein
   Alleinspiel sagt das Buch nichts Eigenes; dort gilt hier dieselbe
   Rechnung, nur strenger — wer gegen einen Alleinspieler spritzt,
   verdoppelt ein Spiel, das ohnehin schon 50 zählt.

   Alles hier ist aus der eigenen Sicht entscheidbar: eigene Karten,
   die Spielart, der bereits liegende Stich. Was ein Spieler nicht
   wissen kann, geht auch nicht ein.
   ============================================================ */

import {
  isTrump, countTrumps, power, points, makeDeck, calledCard,
  knowsOwnSide, trumpSuitOf, darfKontra,
} from "../engine.js";

/** Karten, die weder auf meiner Hand liegen noch gespielt sind. */
function draussen(st, p) {
  const weg = {};
  st.hands[p].forEach((c) => (weg[c] = 1));
  st.tricks.forEach((t) => t.plays.forEach((x) => (weg[x.card] = 1)));
  st.trick.forEach((x) => (weg[x.card] = 1));
  return makeDeck().filter((c) => !weg[c]);
}

/**
 * Wie viele Stiche darf ich mir zutrauen?
 *
 * Gezählt wird nur, was ich selbst in der Hand halte und was mir
 * niemand mehr nehmen kann: die ununterbrochene Folge der höchsten
 * noch lebenden Trümpfe, dazu in jeder Fehlfarbe der Bock. Das ist
 * bewusst die vorsichtige Schätzung — „berechtigte Hoffnung“ heißt
 * im Buch nicht „vielleicht“.
 */
export function stichhoffnung(st, p) {
  const g = st.game;
  const hand = st.hands[p];
  const fremd = draussen(st, p);

  let trumpfstiche = 0;
  const meine = hand.filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
  const fremdeTruempfe = fremd.filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
  for (const c of meine) {
    if (fremdeTruempfe.length && power(fremdeTruempfe[0], g) > power(c, g)) break;
    trumpfstiche++;
  }

  let farbstiche = 0;
  for (const s of ["E", "G", "H", "S"]) {
    if (s === trumpSuitOf(g)) continue;
    const meineFarbe = hand.filter((c) => c[0] === s && !isTrump(c, g));
    if (!meineFarbe.length) continue;
    const hoechste = meineFarbe.sort((a, b) => power(b, g) - power(a, g))[0];
    const fremdeFarbe = fremd.filter((c) => c[0] === s && !isTrump(c, g));
    if (!fremdeFarbe.some((c) => power(c, g) > power(hoechste, g))) farbstiche++;
  }
  return { trumpfstiche, farbstiche, gesamt: trumpfstiche + farbstiche };
}

/**
 * Kontrolliere ich zwei Farben? Eine Farbe kontrolliere ich, wenn
 * ich sie frei bin (dann steche ich dort ein) oder ihren Bock halte.
 * Die Ruffarbe zählt nicht mit — die gehört der Gegenpartei.
 */
export function farbkontrolle(st, p) {
  const g = st.game;
  const hand = st.hands[p];
  const ruf = g.type === "sauspiel" ? g.suit : null;
  let n = 0;
  for (const s of ["E", "G", "H", "S"]) {
    if (s === trumpSuitOf(g) || s === ruf) continue;
    const meine = hand.filter((c) => c[0] === s && !isTrump(c, g));
    if (!meine.length) { n++; continue; }
    if (meine.some((c) => c[1] === "A")) n++;
  }
  return n;
}

export const SPRITZ_REGELN = [
  {
    id: "spritze-voraussetzung",
    kapitel: "3.5",
    seite: 70,
    kurz: "Zwei kontrollierte Farben und berechtigte Hoffnung auf vier Stiche.",
    /* Das Buch beschreibt den Zuschnitt genauer, als der Merksatz
       verrät: „Fünf Trümpfe, darunter zwei Ober und ein
       Schmiertrumpf, dazu eine zweite freie Farbe." Vorher stand hier
       `hoffnung.gesamt >= 4` — vier bombensichere Stiche. Die hat man
       fast nie, und entsprechend feuerte die Regel dreimal in
       viertausend Partien. Vier Stiche sind der Erwartungswert des
       Blattes, nicht seine Garantie; das Blatt selbst ist die
       verlässlichere Beschreibung. */
    passt: (k) => k.kontrolle >= 2 && k.truempfe >= 5 && k.ober >= 2 && k.schmiertrumpf,
  },
  {
    id: "spritze-nach-farbanspiel",
    kapitel: "3.12",
    seite: 84,
    kurz: "Zwei absehbare punktreiche Farbstiche und ein sicherer Trumpfstich.",
    /* Die Regel heißt „nach Anspiel einer freien Farbe" und prüfte
       davon: nichts. Sie feuerte auf Blätter, in denen noch gar keine
       Karte lag. Das Buch nennt vier Voraussetzungen, und alle vier
       stehen jetzt in `k`: es wurde eine Farbe angespielt, ohne zu
       suchen; ich bin diese Farbe frei; ich habe einen hohen Ober,
       um den Stich sofort zu nehmen; und ich kann anschließend
       selbst suchen.

       Von den „zwei punktreichen Farbstichen" ist einer der Stich,
       der gerade auf dem Tisch liegt — zwei EIGENE fette Farben kann
       es hier gar nicht geben: von den vier Farben ist eine Trumpf,
       eine die Ruffarbe (deren Sau der Gegner hält), und die
       angespielte bin ich frei. Es bleibt genau eine übrig. */
    passt: (k) => k.freieFarbeAngespielt && k.hoherOber && k.kannSuchen
      && k.fetteFarbstiche >= 1,
  },
];

/**
 * Soll `p` jetzt eine Spritze geben? Liefert die Regel, nach der es
 * geschieht, oder null.
 */
export function buchSpritze(st, p) {
  if (!darfKontra(st, p)) return null;
  const g = st.game;
  const hoffnung = stichhoffnung(st, p);
  const kontrolle = farbkontrolle(st, p);

  /* Punktreich heißt: der Bock einer Farbe, zu dem noch Augen
     kommen können — eine blanke Sau bringt elf, eine Sau mit
     Begleitung mehr. */
  const fetteFarbstiche = ["E", "G", "H", "S"].filter((s) => {
    if (s === trumpSuitOf(g)) return false;
    const meine = st.hands[p].filter((c) => c[0] === s && !isTrump(c, g));
    return meine.some((c) => c[1] === "A") && meine.reduce((a, c) => a + points(c), 0) >= 11;
  }).length;

  const hand = st.hands[p];
  const truempfe = countTrumps(hand, g);
  const ober = hand.filter((c) => isTrump(c, g) && c[1] === "O").length;
  const tf = trumpSuitOf(g);
  const schmiertrumpf = hand.some((c) => isTrump(c, g) && c[0] === tf && (c[1] === "A" || c[1] === "X"));

  /* Die Stellung, von der 3.12 spricht: eine Farbe liegt, es ist
     nicht die Ruffarbe (es wird also nicht gesucht), und ich bin sie
     frei. */
  const gefuehrt = st.tricks.length === 0 && st.trick.length === 1 ? st.trick[0].card : null;
  const freieFarbeAngespielt = !!gefuehrt && !isTrump(gefuehrt, g)
    && gefuehrt[0] !== (g.type === "sauspiel" ? g.suit : null)
    && !hand.some((c) => c[0] === gefuehrt[0] && !isTrump(c, g));
  const hoherOber = ["EO", "GO", "HO"].some((c) => hand.indexOf(c) >= 0);
  /* „und anschließend selbst suchen" — dafür brauche ich eine Karte
     der Ruffarbe. Ohne sie kann ich den Stich zwar nehmen, aber nicht
     das tun, worauf die ganze Rechnung hinausläuft. */
  const kannSuchen = g.type === "sauspiel" && hand.some((c) => c[0] === g.suit && !isTrump(c, g));

  const k = {
    hoffnung, kontrolle, fetteFarbstiche, truempfe, ober, schmiertrumpf,
    freieFarbeAngespielt, hoherOber, kannSuchen,
  };

  /* Gegen ein Alleinspiel steht der doppelte Grundwert auf dem
     Spiel. Dort verlangt dieselbe Rechnung einen Stich mehr. */
  const allein = g.type !== "sauspiel";
  if (allein && hoffnung.gesamt < 5) return null;
  if (allein && countTrumps(st.hands[p], g) < 4) return null;

  return SPRITZ_REGELN.find((r) => r.passt(k)) || null;
}

/** Nach einer Spritze tauschen die Parteien die Rollen (2.10, 1.13). */
export function rollentausch(st, p) {
  if (!st.kontra) return false;
  return knowsOwnSide(st, p) ? "wie ein Nichtspieler" : "wie ein Spieler";
}
