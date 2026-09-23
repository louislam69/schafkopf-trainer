import {
  tacticalNotes, legalCards, cardName, newDeal, playCard, botPlay,
} from "./engine.js";
import { infoWerte, vorsprung, echtErreicht } from "./pimc.js";
import { byId, PRINCIPLES } from "./knowledge/principles.js";
import { bookFor } from "./knowledge/book.js";
import { buchZug, buchRegel } from "./knowledge/play-rules.js";
import { runBidding, applyGame, mulberry32, bidFor } from "./table.js";

/* Ab wann ein Zug als Fehler gilt: er muss mindestens SCHWELLE an
   Gewinnchance kosten, und der Abstand muss größer sein als zwei
   Standardfehler — sonst ist er von den ausgewürfelten Welten nicht zu
   unterscheiden. Die 5 Prozentpunkte sind gesetzt, nicht gemessen.
   Die Zahl der Welten ist ein Kompromiss aus Dauer und Schärfe: 100
   kosten rund 75 ms je Entscheidung, bei 200 sind es 150 ms, und von
   301 Urteilen kippen mit einer anderen Saat 29 bzw. 20 — fast alle
   knapp an der Schwelle. Die Übung prüft nur einen Zug und leistet
   sich deshalb die doppelte Zahl. */
const SCHWELLE = 0.05;
const WELTEN_AUSWERTUNG = 100;
const WELTEN_UEBUNG = 200;

/**
 * Ein Zug, beurteilt über die Verteilungen, die der Spieler für möglich
 * halten musste (`infoWerte`, Kopfkommentar in pimc.js). `loss` ist die
 * verschenkte Gewinnchance in Prozentpunkten, `augen` dasselbe in Augen.
 *
 * Dazu der Blick auf die echten Karten, aber nur als Zeile über Glück
 * und Pech — wie GNU Backgammon Glück getrennt vom Fehler ausweist:
 * ein richtiger Zug, der am echten Blatt verlor, war Pech; ein falscher,
 * der durchging, Glück.
 */
function bewerte(state, p, card, welten, rng) {
  const ev = infoWerte(state, p, welten, rng);
  const best = ev[0];
  const mine = ev.find((e) => e.card === card) || best;
  const v = vorsprung(best, mine);
  const fehler = v.diff >= SCHWELLE && v.diff > 2 * v.fehler;
  /* Das ± gehört zum Abstand, der angezeigt wird. War die eigene Karte
     die beste, ist das der Abstand zur zweitbesten — gegen sich selbst
     stünde dort immer ± 0. */
  const gegen = mine === best && ev.length > 1 ? vorsprung(best, ev[1]) : v;
  return {
    ev, best, mine, fehler,
    loss: 100 * v.diff,
    genauigkeit: 100 * 2 * gegen.fehler,
    augen: best.augen - mine.augen,
    glueck: glueckUndPech(state, p, card, ev, fehler, rng),
  };
}

function glueckUndPech(state, p, card, ev, fehler, rng) {
  const echt = new Map(ev.map((e) => [e.card, echtErreicht(state, p, e.card, rng)]));
  const pct = (e) => Math.round(100 * e.anteil) + " %";
  const mine = ev.find((e) => e.card === card);
  if (!mine) return null;
  if (!fehler && !echt.get(card)) {
    const andere = ev.find((e) => e.card !== card && echt.get(e.card));
    if (andere) {
      return { art: "pech", text: `Mit den echten Karten hätte ${cardName(andere.card)} gereicht — ` +
        `aber nur in ${pct(andere)} der Verteilungen, die zu deinem Wissen passten (deine Karte: ${pct(mine)}). Das war Pech, kein Fehler.` };
    }
  }
  if (fehler && echt.get(card)) {
    return { art: "glueck", text: `Diesmal ging es gut — aber ${cardName(card)} reicht nur in ${pct(mine)} ` +
      `der möglichen Verteilungen, ${cardName(ev[0].card)} in ${pct(ev[0])}.` };
  }
  return null;
}

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
  const items = [];
  for (const d of decisions) {
    if (legalCards(d.state, d.p).length <= 1) continue;
    const b = bewerte(d.state, d.p, d.card, WELTEN_AUSWERTUNG, rng);
    const notes = tacticalNotes(d.state, d.p, d.card);
    const ids = notes.map((n) => n[0]);
    items.push({
      trick: d.state.tricks.length + 1,
      card: d.card,
      best: b.best.card,
      loss: b.loss,
      fehler: b.fehler,
      augen: b.augen,
      genauigkeit: b.genauigkeit,
      anteil: b.mine.anteil,
      anteilBest: b.best.anteil,
      glueck: b.glueck,
      notes,
      alternatives: b.ev.slice(0, 3),
      state: d.state,
      p: d.p,
      /* Ein Fehler ist nur, was messbar Gewinnchance kostet. Ein
         Merksatz, der auf einen Zug ohne messbaren Verlust passt, bleibt
         sichtbar — aber als Hinweis, nicht als Fehler: anders zu spielen
         hätte am Ausgang hier kaum etwas geändert. */
      schwer: b.fehler,
      hinweis: !b.fehler && ids.length > 0,
      lessons: ids.map(lessonFor).filter(Boolean),
      buchregel: buchregelFuer(d.state, d.p, d.card),
    });
  }
  const mistakes = items.filter((i) => i.schwer).sort((a, b) => b.loss - a.loss);
  const hinweise = items.filter((i) => i.hinweis);
  const avgLoss = items.length ? items.reduce((a, i) => a + i.loss, 0) / items.length : 0;
  return { items, mistakes, hinweise, avgLoss };
}

/** eine Entscheidung prüfen (Übungsmodus) */
export function judge(state, p, card, rng) {
  const b = bewerte(state, p, card, WELTEN_UEBUNG, rng);
  const notes = tacticalNotes(state, p, card);
  return {
    ok: !b.fehler,
    loss: b.loss,
    genauigkeit: b.genauigkeit,
    anteil: b.mine.anteil,
    anteilBest: b.best.anteil,
    glueck: b.glueck,
    best: b.best.card,
    bestText: cardName(b.best.card),
    ranking: b.ev,
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
    /* Seit dem 21.09.2026 in Prozentpunkten Gewinnchance; ältere
       Einträge tragen Augen und keine Einheit. */
    verlust: Math.round(item.loss),
    einheit: "prozent",
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
    reizung: st.reizung || null,
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
