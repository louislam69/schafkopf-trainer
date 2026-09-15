import {
  reviewDecisions, perfectEvaluate, tacticalNotes, legalCards, cardName, newDeal, playCard, botPlay,
} from "./engine.js";
import { byId, PRINCIPLES } from "./knowledge/principles.js";
import { bookFor } from "./knowledge/book.js";
import { buchZug, buchRegel } from "./knowledge/play-rules.js";
import { runBidding, applyGame, mulberry32, bidFor } from "./table.js";

const LOSS_LIMIT = 4; // ab wie vielen verlorenen Augen ein Zug besprochen wird

/**
 * Die Buchregel, die auf diese Stellung gepasst haette — dieselbe, nach
 * der die Bots spielen.
 *
 * Bis hierher liefen zwei Wissensbestaende nebeneinander: die Bots
 * zogen nach `SPIELREGELN`, die Nachbesprechung zitierte `PRINCIPLES`.
 * Beide stammen aus denselben Buechern, aber niemand hielt sie
 * zusammen — der Spieler sah nie, nach welcher Regel der Bot gerade
 * gespielt hatte, und bekam zu seinem eigenen Zug einen Rat, der mit
 * dem Verhalten am Tisch nichts zu tun haben musste. Ein Satz, zwei
 * Quellen, und niemand merkt, wenn sie auseinanderlaufen.
 *
 * Deshalb haengt an jedem besprochenen Zug jetzt die Regelkennung
 * selbst. `gefolgt` sagt, ob der Spieler dieselbe Karte gewaehlt hat.
 * Das ist ausdruecklich eine Aussage *nach* dem Zug — waehrend des
 * Spiels bleibt sie unsichtbar, das ist der Sinn des Trainers.
 */
export function buchregelFuer(state, p, card) {
  const b = buchZug(state, p);
  if (!b) return null;
  const r = buchRegel(b.regelId);
  return {
    id: b.regelId, seite: b.seite, kurz: r ? r.kurz : "",
    karte: b.card, kartenName: cardName(b.card), gefolgt: b.card === card,
  };
}

export function lessonFor(id) {
  const p = byId(id);
  if (!p) return null;
  return { ...p, buch: bookFor(id) };
}

/** Analyse eines gespielten Blattes → Liste von Lernpunkten */
export function buildReview(decisions, rng) {
  const raw = reviewDecisions(decisions, rng);
  const items = raw.map((r) => {
    const ids = r.notes.map((n) => n[0]);
    return {
      ...r,
      schwer: r.loss >= LOSS_LIMIT || ids.length > 0,
      lessons: ids.map(lessonFor).filter(Boolean),
      buchregel: buchregelFuer(r.state, r.p, r.card),
    };
  });
  const mistakes = items.filter((i) => i.schwer).sort((a, b) => b.loss - a.loss);
  const avgLoss = items.length ? items.reduce((a, i) => a + i.loss, 0) / items.length : 0;
  return { items, mistakes, avgLoss };
}

/** eine Entscheidung prüfen (Übungsmodus) */
export function judge(state, p, card, rng) {
  const ev = perfectEvaluate(state, p, 16, rng);
  const best = ev[0];
  const mine = ev.find((e) => e.card === card);
  const loss = best.value - (mine ? mine.value : 0);
  const notes = tacticalNotes(state, p, card);
  return {
    ok: loss < 1.5,
    loss,
    best: best.card,
    bestText: cardName(best.card),
    ranking: ev,
    lessons: notes.map((n) => lessonFor(n[0])).filter(Boolean),
    notes: notes.map((n) => n[1]),
    buchregel: buchregelFuer(state, p, card),
  };
}

/* ---------------- Speicher ---------------- */

const KEY = "schafkopf.v1";
const emptyStore = () => ({ scores: [0, 0, 0, 0], hands: 0, drills: [], settings: { level: 1, sound: false }, stats: { decisions: 0, loss: 0 } });

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore();
  } catch (e) {
    return emptyStore();
  }
}
export function save(store) {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* privater Modus */ }
}
export function reset() {
  try { localStorage.removeItem(KEY); } catch (e) { /* egal */ }
}

export function saveDrill(store, item) {
  const drill = {
    id: "d" + Date.now() + Math.floor(Math.random() * 1000),
    quelle: "eigene Partie",
    state: stripState(item.state),
    p: item.p,
    gespielt: item.card,
    besser: item.best,
    verlust: Math.round(item.loss * 10) / 10,
    ids: item.notes.map((n) => n[0]),
  };
  store.drills = [drill, ...store.drills].slice(0, 60);
  save(store);
  return drill;
}

/** nur die Felder behalten, die die Engine braucht */
function stripState(st) {
  return {
    dealer: st.dealer, hands: st.hands, orig: st.orig, game: st.game, declarer: st.declarer,
    partner: st.partner, partnerKnown: st.partnerKnown, trick: st.trick, leader: st.leader,
    turn: st.turn, tricks: st.tricks, won: st.won, sauFree: st.sauFree, voids: st.voids, phase: st.phase,
  };
}

/* ---------------- Übungsstellungen erzeugen ---------------- */

/** spielt ein Blatt bis zu einer Stelle, an der Sitz 0 echte Wahl hat */
export function randomDrill(seed) {
  const rng = mulberry32(seed);
  for (let tries = 0; tries < 40; tries++) {
    let st = newDeal(Math.floor(rng() * 4), rng);
    const { winner } = runBidding(st, (p, hand, best) => bidFor(hand, 1, best));
    if (!winner) continue;
    st = applyGame(st, winner.bid, winner.p);
    const stop = 1 + Math.floor(rng() * 5); // nach 1–5 Stichen
    while (st.phase !== "done") {
      if (st.turn === 0 && st.tricks.length >= stop && legalCards(st, 0).length >= 3) {
        return { state: stripState(st), p: 0, quelle: "Zufallsstellung" };
      }
      st = playCard(st, st.turn, botPlay(st, st.turn, 1, rng));
    }
  }
  return null;
}

export const allPrinciples = () => PRINCIPLES.map((p) => ({ ...p, buch: bookFor(p.id) }));
