import {
  newDeal, playCard, legalCards, botBid, bidRank, botPlay, settle, calledCard,
  darfKontra, gibKontra, setzeAnsagePruefer, ANSAGE,
} from "./engine.js";
import { buchSauspiel } from "./knowledge/strategy.js";
import { buchAlleinspiel, buchWenz } from "./knowledge/alleinspiel.js";
import { pimcZug } from "./pimc.js";
import { buchZug, TEURE_REGELN } from "./knowledge/play-rules.js";
import { buchSpritze } from "./knowledge/spritze.js";

/** deterministischer Zufall — gleiche Saat, gleiches Blatt */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const seatOrder = (dealer) => [1, 2, 3, 4].map((i) => (dealer + i) % 4);

/** Reihum ansagen; decide(p, hand, best) liefert eine Ansage oder null */
export function runBidding(st, decide) {
  const order = seatOrder(st.dealer);
  const bids = [];
  let winner = null;
  for (let i = 0; i < order.length; i++) {
    const p = order[i];
    /* Der Sitz zählt in der Reihenfolge des Reizens: 0 ist der
       Ausspieler, 3 die Hinterhand. Die Kapitel 1.7 und 1.8 hängen
       daran, ebenso wie daran, ob vor mir schon jemand spielen wollte. */
    const bid = decide(p, st.hands[p], winner, { position: i, alleWeiter: !winner && i === 3 });
    bids.push({ p, bid });
    if (bidRank(bid) > bidRank(winner && winner.bid)) winner = { p, bid };
  }
  return { bids, winner };
}

/**
 * Was dieses Blatt hergeben würde — noch ohne Rücksicht darauf, ob es
 * damit auch drankommt. Ab Stufe 1 kommt das Farbsolo aus der
 * Stichrechnung von Buch 3 (Kapitel 4.1/4.3/4.7) und nicht mehr aus
 * soloStrength(). Den reinen Wenz sagt ab Stufe 1 eine eigene
 * Stichrechnung an (`buchWenz`, Aufgabe 11); Farbwenz und sicherer Tout
 * kommen weiter aus botBid. Stufe 0 bleibt unverändert die
 * mutige, ungeschulte.
 *
 * @param vorSpielwunsch  hat vor diesem Spieler schon jemand angesagt?
 */
function waehleAnsage(hand, level, vorSpielwunsch, sitz) {
  const eigen = botBid(hand, level);
  if (level === 0) return eigen;

  const allein = buchAlleinspiel(hand, vorSpielwunsch);
  if (allein && allein.ansage) return allein.ansage;
  /* Farbwenz und Wenz-Tout kommen weiter aus botBid — für den Farbwenz
     hat das Buch keine Stichrechnung, sondern nur die Abwägung aus
     4.14. Den reinen Wenz sagt botBid ab Stufe 1 nicht mehr an
     (`ANSAGE.wenz`), das tut die Stichrechnung danach. */
  if (eigen && (eigen.type === "wenz" || eigen.type === "farbwenz")) return eigen;
  const wenz = buchWenz(hand, ANSAGE.wenzStiche[level]);
  if (wenz) return wenz;

  const buch = buchSauspiel(hand, sitz);
  if (buch && buch.ansage) return buch.ansage;
  if (buch && buch.sperre) return null;
  return eigen && eigen.type === "sauspiel" ? eigen : null;
}

/**
 * Ansage eines Bots — die, mit der er auch drankäme.
 *
 * @param stand  die stehende Ansage als { p, bid }, oder null
 */
export function bidFor(hand, level, stand = null, sitz) {
  const ansage = waehleAnsage(hand, level, !!stand, sitz);
  /* Wer nicht überbieten kann, sagt auch nichts an — ein Sauspiel geht
     nicht über ein Sauspiel. Am Ausgang ändert diese Schranke nichts:
     bidRank vergleicht mit strengem >, der erste Sitz behält den
     Zuschlag ohnehin. Sie räumt nur eine Anzeige weg, die es am Tisch
     nie gab — drei Spieler, die alle "Sauspiel" gesagt haben, von
     denen aber nur einer spielen konnte. */
  return bidRank(ansage) > bidRank(stand && stand.bid) ? ansage : null;
}

/**
 * Zug eines Bots. Ab Stufe 1 bekommen die Buchregeln den Vortritt;
 * greift keine, entscheidet die eingebaute Spielweise.
 */
/** Wie viele Verteilungen PIMC je Zug auswuerfelt. */
export const PIMC_WELTEN = 20;

export function playFor(st, p, level, rng, ohne) {
  /* Ab Stufe 3 rechnet der Bot selbst. Die Buchregeln bleiben dann
     aussen vor — sie sind hier nicht Ratgeber, sondern der Gegner,
     gegen den gemessen wird. Fuer die ersten beiden Stiche liefert
     PIMC nichts (dort ist das Loesen teuer und die Verteilung noch
     nichtssagend); dann greift wie bisher die Stichprobe. */
  if (level >= 3) {
    const c = pimcZug(st, p, PIMC_WELTEN, rng || Math.random);
    if (c) return c;
    return botPlay(st, p, 2, rng);
  }
  if (level > 0) {
    /* Der Fortgeschrittene lässt die Regeln aus, die am Buchtisch
       kosten; der Experte spielt jede (siehe TEURE_REGELN). */
    const aus = level === 1 && TEURE_REGELN.size ? new Set([...(ohne || []), ...TEURE_REGELN]) : ohne;
    const b = buchZug(st, p, aus);
    if (b) return b.card;
  }
  return botPlay(st, p, level, rng, ohne);
}

/**
 * Gibt ein Bot jetzt eine Spritze? Erst ab Stufe 1 — die ungeschulte
 * Stufe 0 kennt sie nicht, wie sie auch die Buchregeln nicht kennt.
 */
export function kontraFor(st, p, level) {
  if (level < 1) return null;
  return buchSpritze(st, p);
}

/**
 * Das Spritzfenster: solange die zweite Karte nicht liegt, darf
 * reihum gespritzt und retour gespritzt werden. `frage` entscheidet
 * für einen Sitz und liefert eine Regel oder null.
 */
export function kontraRunde(st, frage) {
  let s = st;
  for (let i = 0; i < 4; i++) {
    const p = (s.leader + i) % 4;
    if (!darfKontra(s, p)) continue;
    if (frage(s, p)) s = gibKontra(s, p);
  }
  return s;
}

/**
 * Die Reizung, wie sie `determinize` später nachprüft: je Sitz die
 * Ansage und die Stufe, mit der sie zustande kam. Ein Mensch hat keine
 * Stufe (`null`) — seine Ansage ist kein Code und wird nicht geprüft.
 */
export function reizung(bids, stufeVon) {
  return bids.map((b) => ({ p: b.p, bid: b.bid, level: stufeVon(b.p) }));
}

const gleicheAnsage = (a, b) => (!a && !b) ||
  (!!a && !!b && a.type === b.type && (a.suit || null) === (b.suit || null) && !!a.tout === !!b.tout);

/**
 * Was ein Mensch mit seiner Ansage verrät (Aufgabe 10).
 *
 * Die Ansage eines Bots ist Code, eine Welt, in der er anders gereizt
 * hätte, gibt es nicht. Die Ansage eines Menschen ist kein Code — aber
 * auch kein Zufall: wer ein Solo ansagt, hat meist ein Blatt, auf dem
 * auch das Buch eines sagen würde. Geprüft wird deshalb gegen die
 * Ansage der Stufe `stufe`, und eine Welt, in der die anders ausfiele,
 * zählt nur mit dem Bruchteil `gewicht`. 1 heißt: der Mensch verrät
 * nichts (so war es bis zum 11.10.2026).
 *
 * Gewählt ist 0 — dieselbe Probe wie gegen einen Bot. Weich bleibt sie
 * trotzdem: passt in 100 Versuchen keine Welt, nimmt `determinize` eine,
 * die nur die harten Regeln erfüllt. Gemessen (`npm run inferenz`, der
 * Mensch ist ein Bot, dessen Stufe die anderen nicht kennen; Gegner auf
 * Stufe 2, Spielmacher gewinnt in Pp. gegen das Gewicht 1, Saat
 * 20260909 / 4242, Fehlermaß ± 1,1 bis 1,2):
 *
 *                              0,3           0,1           0
 *   reizt wie das Modell    −0,2 / −1,2   −1,3 / −1,5   −2,1 / −2,4
 *   reizt wie Stufe 0       −0,3 / −0,6   −0,3 / −0,5   −0,4 / −1,6
 *
 * Mit Gegnern auf Stufe 3 (PIMC) beim Gewicht 0: −6,6 / −5,5 und
 * −2,9 / −3,0, je ± 1,4 bis 1,5. Ein falsches Modell kostet also nichts,
 * es bringt nur weniger. Ein Mensch reizt irgendwo dazwischen.
 */
export const MENSCH = { gewicht: 0, stufe: 1 };

/* Sagt die Ansage dasselbe über das Blatt? Für den Menschen grob: ob
   Sauspiel oder weiter, ist eine Frage des Temperaments; ob Solo, Wenz
   oder Farbwenz, und in welcher Farbe, ist eine des Blatts. */
const gleicheKlasse = (a, b) => (bidRank(a) <= 1 && bidRank(b) <= 1) ||
  (!!a && !!b && bidRank(a) >= 2 && bidRank(b) >= 2 && a.type === b.type && (a.suit || null) === (b.suit || null));

/**
 * Hätte jeder Bot in dieser ausgedachten Welt so gereizt, wie er es am
 * Tisch tat? Gereizt wurde mit acht Karten, also zählt zur Hand in der
 * Welt dazu, was der Sitz seither gespielt hat. Sitz und „alle weiter"
 * entstehen genau wie in `runBidding` aus der Reihenfolge.
 *
 * @returns das Gewicht der Welt: 0, wenn ein Bot anders gereizt hätte,
 *   sonst `MENSCH.gewicht` je Mensch, dessen Ansage nicht zum Buch passt.
 */
export function passtZurReizung(welt, betrachter) {
  /* Der Stand vor jedem Sitz kommt aus der echten Reizung, nicht aus
     der nachgespielten — weicht ein Sitz ab, fällt die Welt ohnehin.
     Damit ist die Reihenfolge der Proben frei, und der Spielmacher
     kommt zuerst: an ihm scheitern rund vier von fünf Welten, und jede
     Probe kostet einen vollen `bidFor` (rund 0,1 ms). */
  const stand = [];
  let s = null;
  for (const r of welt.reizung) {
    stand.push(s);
    if (bidRank(r.bid) > bidRank(s && s.bid)) s = { p: r.p, bid: r.bid };
  }
  const reihe = welt.reizung.map((_, i) => i)
    .sort((a, b) => (welt.reizung[b].p === welt.declarer) - (welt.reizung[a].p === welt.declarer));
  let gewicht = 1;
  for (const i of reihe) {
    const { p, bid, level } = welt.reizung[i];
    const mensch = level === null || level === undefined;
    if (p === betrachter || (mensch && MENSCH.gewicht >= 1)) continue;
    const gespielt = welt.tricks.flatMap((t) => t.plays).concat(welt.trick)
      .filter((x) => x.p === p).map((x) => x.card);
    const blatt = welt.hands[p].concat(gespielt);
    const waere = bidFor(blatt, mensch ? MENSCH.stufe : level, stand[i], { position: i, alleWeiter: !stand[i] && i === 3 });
    if (mensch) { if (!gleicheKlasse(waere, bid)) gewicht *= MENSCH.gewicht; }
    else if (!gleicheAnsage(waere, bid)) return 0;
  }
  return gewicht;
}
setzeAnsagePruefer(passtZurReizung);

/**
 * @param reizung  aus `reizung()`; nur bei echter Reizung übergeben —
 *   ein vorgegebenes Spiel (Tests, Übungsstellungen) hat keine, und
 *   dann wird auch nichts daraus geschlossen.
 */
export function applyGame(st, game, declarer, reizung = null) {
  return {
    ...st,
    reizung,
    game,
    declarer,
    partner: -1,
    partnerKnown: false,
    phase: "play",
    leader: (st.dealer + 1) % 4,
    turn: (st.dealer + 1) % 4,
  };
}

/** Ein komplettes Blatt automatisch ausspielen (für Tests und Simulationen) */
export function autoDeal(dealer, rng, levels) {
  let st = newDeal(dealer, rng);
  const { bids, winner } = runBidding(st, (p, hand, best, sitz) => bidFor(hand, levels[p], best, sitz));
  if (!winner) return null; // zusammengeworfen
  st = applyGame(st, winner.bid, winner.p, reizung(bids, (p) => levels[p]));
  st = kontraRunde(st, (s, p) => kontraFor(s, p, levels[p]));
  const trace = [];
  while (st.phase !== "done") {
    const p = st.turn;
    const legal = legalCards(st, p);
    const card = playFor(st, p, levels[p], rng);
    trace.push({ p, card, legal, before: st });
    st = playCard(st, p, card);
    /* Das Fenster bleibt offen, bis die zweite Karte liegt. */
    if (st.tricks.length === 0 && st.trick.length === 1) {
      st = kontraRunde(st, (s, q) => kontraFor(s, q, levels[q]));
    }
  }
  return { st, trace, result: settle(st), called: calledCard(st.game) };
}
