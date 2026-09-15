import {
  newDeal, playCard, legalCards, botBid, bidRank, botPlay, settle, calledCard,
  darfKontra, gibKontra,
} from "./engine.js";
import { buchSauspiel } from "./knowledge/strategy.js";
import { buchAlleinspiel } from "./knowledge/alleinspiel.js";
import { pimcZug } from "./pimc.js";
import { buchZug } from "./knowledge/play-rules.js";
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
 * soloStrength(). Der Wenz geht weiterhin über botBid, dafür steht im
 * Buch bisher keine Ansageregel. Stufe 0 bleibt unverändert die
 * mutige, ungeschulte.
 *
 * @param vorSpielwunsch  hat vor diesem Spieler schon jemand angesagt?
 */
function waehleAnsage(hand, level, vorSpielwunsch, sitz) {
  const eigen = botBid(hand, level);
  if (level === 0) return eigen;

  const allein = buchAlleinspiel(hand, vorSpielwunsch);
  if (allein && allein.ansage) return allein.ansage;
  /* Wenz und Farbwenz kommen weiter aus botBid — für sie hat das Buch
     keine Stichrechnung, sondern nur die Abwägung aus 4.14. */
  if (eigen && (eigen.type === "wenz" || eigen.type === "farbwenz")) return eigen;

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
    const b = buchZug(st, p, ohne);
    if (b) return b.card;
  }
  return botPlay(st, p, level, rng);
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

export function applyGame(st, game, declarer) {
  return {
    ...st,
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
  const { winner } = runBidding(st, (p, hand, best, sitz) => bidFor(hand, levels[p], best, sitz));
  if (!winner) return null; // zusammengeworfen
  st = applyGame(st, winner.bid, winner.p);
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
