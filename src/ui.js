import {
  newDeal, playCard, legalCards, settle, botBid, botPlay, sortHand, isTrump, calledCard, bidRank,
  SUITNAME, cardName, points, isDeclarerSide, sauspielOptions, trumpSuitOf,
  darfKontra, gibKontra, kontraName, toutMoeglich,
} from "./engine.js";
import { runBidding, applyGame, mulberry32, seatOrder, bidFor, playFor, kontraFor } from "./table.js";
import { cardHtml, suitSvg, backHtml } from "./cards.js";
import { buildReview, judge, load, save, reset, saveDrill, randomDrill, allPrinciples } from "./coach.js";
import { RULES } from "./knowledge/principles.js";
import { ALLE_REGELN } from "./knowledge/strategy.js";
import { STELLUNGEN, REGELN as BUCH_REGELN } from "./knowledge/buecher.js";
import { GLOSSAR } from "./knowledge/glossar.js";
import { BOOK, hasBook } from "./knowledge/book.js";

const NAMES = ["Du", "Sepp", "Resi", "Anderl"];
/* Stufe 3 rechnet ab dem dritten Stich mit dem Loeser (src/pimc.js)
   und braucht dafuer je Zug einen Moment. Voreingestellt bleibt 1:
   die Nachbesprechung vergleicht gegen die Buchregeln, und dafuer
   soll der Tisch nach dem Buch spielen, nicht nach der Rechnung. */
const LEVELS = ["Anfänger", "Fortgeschritten", "Experte", "Meister (rechnet)"];
const $ = (sel) => document.querySelector(sel);

const store = load();
const rng = mulberry32((Date.now() ^ 0x5f3a) >>> 0);

const app = {
  st: null,
  dealer: 3,
  bidding: null,
  decisions: [],
  lastTrick: null,
  review: null,
  result: null,
  busy: false,
  drill: null,
  tab: "spiel",
  /* Vorgemerkte Karte: angetippt, während noch die Bots dran sind.
     Sie wird gelegt, sobald ich an der Reihe bin — vorausgesetzt,
     sie ist dann noch erlaubt (siehe tick()). */
  armed: null,
  /* Nur beim frisch gegebenen Blatt fliegen die Karten ein. Ohne
     dieses Merkmal liefe die Gebeanimation nach jedem Stich neu. */
  frischeHand: false,
  /* Liegt der letzte Stich gerade offen auf dem Filz? Reine
     Anzeigesache — die Engine weiss davon nichts, gespeichert wird
     es auch nicht. Solange es steht, haelt der Takt an. */
  rueckschau: false,
};

/* ============================ Blattablauf ============================ */

function newHand() {
  app.st = newDeal(app.dealer, rng);
  app.decisions = [];
  app.lastTrick = null;
  app.review = null;
  app.result = null;
  app.armed = null;
  app.frischeHand = true;
  app.rueckschau = false;
  clearTimeout(spritzUhr);
  spritzUhr = null;
  clearTimeout(taktUhr);
  taktUhr = null;
  app.spritzWeiter = null;
  app.bidding = { order: seatOrder(app.dealer), i: 0, bids: [], best: null };
  render();
  /* Die Karten fliegen ein, während schon gereizt wird — die
     Animation hält nichts auf, sie läuft nur nebenher. 900 ms, weil
     `geben` 450 ms dauert und die achte Karte 7x55 ms später anfängt;
     bei 700 ms wurde ihr die Schranke unter dem Flug weggezogen. Das
     render() gehört dazu: das Merkmal steht an der Hand, und an die
     Hand kommt es nur über renderHand(). */
  setTimeout(() => { app.frischeHand = false; render(); }, 900);
  setTimeout(bidStep, 420);
}

function bidStep() {
  const b = app.bidding;
  if (!b) return;
  if (b.i >= b.order.length) return finishBidding();
  const p = b.order[b.i];
  if (p === 0) return askHumanBid();
  /* Der Sitz gehört mit übergeben, sonst greifen die Sitzregeln aus
     Kapitel 1.7/1.8 nur in autoDeal und in den Tests — am Tisch aber
     nie. runBidding macht es genauso; die Oberfläche reizt nur in
     einer eigenen Schleife, weil sie zwischendurch den Menschen
     fragen muss. */
  const bid = bidFor(app.st.hands[p], levelOf(p), b.best,
    { position: b.i, alleWeiter: !b.best && b.i === 3 });
  registerBid(p, bid);
  render();
  setTimeout(bidStep, 420);
}

/* Gerangt wird mit bidRank aus der Engine, nicht mit einer eigenen
   Abstufung: die hier stehende kannte den Tout nicht, ein Solo Tout
   überbot am Tisch also kein einfaches Solo — in runBidding aber
   schon. Zwei Ranglisten für dieselbe Frage sind eine zu viel. */
function registerBid(p, bid) {
  const b = app.bidding;
  b.bids.push({ p, bid });
  if (bidRank(bid) > bidRank(b.best && b.best.bid)) b.best = { p, bid };
  b.i++;
}

function finishBidding() {
  const b = app.bidding;
  app.bidding = null;
  if (!b.best) {
    banner("Alle weiter — zusammengeworfen.", [{ label: "Neu geben", act: "neu" }]);
    app.dealer = (app.dealer + 1) % 4;
    return;
  }
  app.st = applyGame(app.st, b.best.bid, b.best.p);
  banner(`${NAMES[b.best.p]} spielt ${gameLabel(b.best.bid)}.`, []);
  render();
  setTimeout(() => kontraRunde(() => planeTakt(tick, 400)), 800);
}

/* ---------------------- Die Spritze ----------------------
   Das Fenster steht offen, bis die zweite Karte liegt. Reihum
   entscheiden erst die Bots, dann — solange das Fenster offen ist —
   der Mensch. Der fragt kein Dialog mehr: die Spritze liegt als
   Knopf neben dem Fächer und gilt genau so lange, wie die Regel es
   erlaubt. Zwei Dialoge hintereinander — einer vor der ersten Karte,
   einer danach — fragten dieselbe Sache zweimal und hielten dafür
   jedes Mal den Tisch an.

   Damit der Knopf nicht schon wieder weg ist, bevor man ihn gesehen
   hat, hält der Tisch an den beiden Stellen, an denen sich das
   Fenster öffnet, kurz inne. Wer drückt, spart die Restzeit. */
const SPRITZ_FENSTER = 1600;
let spritzUhr = null;

function kontraRunde(weiter) {
  let st = app.st;
  for (let i = 0; i < 4; i++) {
    const p = (st.leader + i) % 4;
    if (p === 0 || !darfKontra(st, p)) continue;
    if (kontraFor(st, p, levelOf(p))) {
      st = gibKontra(st, p);
      app.st = st;
      banner(`${NAMES[p]}: ${kontraName(st.kontra)}!`, []);
    }
  }
  render();
  if (!darfKontra(app.st, 0)) return weiter();
  app.spritzWeiter = weiter;
  renderSpritze(true);
  clearTimeout(spritzUhr);
  spritzUhr = setTimeout(() => { spritzUhr = null; weiterNachSpritze(); }, SPRITZ_FENSTER);
}

/* Die Bedenkzeit ist um oder der Knopf ist gedrückt — in beiden
   Fällen geht es genau einmal weiter. */
function weiterNachSpritze() {
  clearTimeout(spritzUhr);
  spritzUhr = null;
  const w = app.spritzWeiter;
  app.spritzWeiter = null;
  /* Die Leiste zeigt die eingeräumte Bedenkzeit, nicht das
     Regelfenster — ist sie um, verschwindet sie, der Knopf bleibt
     aber, bis die zweite Karte liegt. */
  $("#spritze").classList.remove("laeuft");
  renderSpritze();
  if (w) w();
}

function gibSpritze() {
  if (!app.st || !darfKontra(app.st, 0)) return;
  app.st = gibKontra(app.st, 0);
  banner(`Du: ${kontraName(app.st.kontra)}!`, []);
  render();
  weiterNachSpritze();
}

/* Kurzschrift für die Ansageknöpfe: die Spielart steht schon über
   der Gruppe, auf dem Knopf steht nur noch die Farbe. */
function chipLabel(b) {
  if (b.type === "wenz") return b.tout ? "Wenz Tout" : "Wenz";
  if (b.type === "sauspiel") return `${SUITNAME[b.suit]}-Sau`;
  return SUITNAME[b.suit];
}

function askHumanBid() {
  const hand = app.st.hands[0];
  const opts = [{ label: "Weiter", bid: null }];
  const gruppen = [];
  /* Weiter steht immer an Stelle 0 — darauf verlässt sich auch
     test/ui.smoke.js, das mit bids[0] weitergeht. */
  const gruppe = (titel, bids) => {
    if (!bids.length) return;
    const von = opts.length;
    for (const b of bids) opts.push({ label: chipLabel(b), bid: b });
    gruppen.push({ titel, von, bis: opts.length });
  };

  const farben = ["E", "G", "H", "S"];
  const solos = farben.map((s) => ({ type: "solo", suit: s }));
  const wenze = [{ type: "wenz" }, ...farben.map((s) => ({ type: "farbwenz", suit: s }))];

  gruppe("Sauspiel", sauspielOptions(hand).map((s) => ({ type: "sauspiel", suit: s })));
  gruppe("Wenz", wenze);
  gruppe("Solo", solos);
  /* Der Tout steht nur dort, wo er überhaupt zu halten ist — sonst
     füllt sich die Liste mit Ansagen, die das Blatt nicht trägt. */
  gruppe("Tout", [...wenze, ...solos].filter((b) => toutMoeglich(hand, b)).map((b) => ({ ...b, tout: true })));

  const knopf = (i) => `<button type="button" class="bid chip" data-bid="${i}">${opts[i].label}</button>`;
  /* Dieselbe Regel wie am Platz: zu überbieten ist nur die eine
     Ansage, die gerade steht. */
  const fuehrt = app.bidding.best;

  /* Das Blatt stand einmal im Dialog selbst nach — eine zweite,
     kleinere Kopie derselben acht Karten. Der Dialog steht jetzt oben
     und der echte Fächer darunter bleibt hell; die Kopie zeigte also
     nur noch dasselbe zweimal und schob den Dialog dabei so weit nach
     unten, dass er wieder auf dem Fächer lag. */
  modal(`
    <h2>Was sagst du an?</h2>
    <p class="muted">${fuehrt ? `${NAMES[fuehrt.p]} hat angesagt: ${verdeckteAnsage(fuehrt.bid)}` : "Vor dir hat noch niemand angesagt."}</p>
    <button type="button" class="bid weiter" data-bid="0">Weiter</button>
    ${gruppen.map((g) => `
      <div class="bid-gruppe">
        <span class="bid-titel">${g.titel}</span>
        <span class="bid-chips">${Array.from({ length: g.bis - g.von }, (_, k) => knopf(g.von + k)).join("")}</span>
      </div>`).join("")}
  `, "ansage");
  $("#modal").querySelectorAll(".bid").forEach((el) =>
    el.addEventListener("click", () => {
      closeModal();
      registerBid(0, opts[Number(el.dataset.bid)].bid);
      render();
      setTimeout(bidStep, 300);
    })
  );
}

function levelOf() {
  return store.settings.level;
}

/* Der Takt am Tisch. Kurz genug, dass es flüssig bleibt, lang genug,
   dass man den Stich noch mitliest. Die Streuung nimmt den Bots das
   Metronomhafte — vier Spieler, die alle exakt gleich schnell legen,
   wirken wie eine Maschine. */
const STICH_PAUSE = 850;
const denkzeit = () => 340 + Math.floor(Math.random() * 260);

/* Der ganze Takt hängt an einer einzigen Uhr. Vorher lagen fünf
   nackte setTimeout(tick) verstreut herum; solange nichts sie
   anhalten musste, ging das gut. Die Rückschau muss es aber — und
   anhalten kann man nur, was man auch kennt. Die Zusage dieser
   Variablen: es ist immer höchstens ein Takt unterwegs. */
let taktUhr = null;
const planeTakt = (fn, ms) => { clearTimeout(taktUhr); taktUhr = setTimeout(fn, ms); };

function tick() {
  const st = app.st;
  if (!st || st.phase !== "play") return;
  /* Solange der letzte Stich offen liegt, legt niemand nach. Am Tisch
     wartet man auch, bis der Nachbar den Stich wieder hingelegt hat;
     zeigeRueckschau(false) startet den Takt danach neu. */
  if (app.rueckschau) return;
  if (st.trick.length === 0 && app.lastTrick && app.lastTrick.fresh) {
    app.lastTrick.fresh = false;
    render();
    return void planeTakt(tick, STICH_PAUSE);
  }
  if (st.turn === 0) {
    app.busy = false;
    render();
    return void spieleVorgemerkte();
  }
  app.busy = true;
  render();
  planeTakt(() => {
    const p = app.st.turn;
    if (app.st.phase !== "play") return;
    const card = playFor(app.st, p, levelOf(p), rng);
    if (!card) return;
    commit(p, card);
  }, denkzeit());
}

/* Eine vorgemerkte Karte kommt auf den Tisch, sobald ich dran bin —
   aber nur, wenn sie dann noch erlaubt ist. Das kann sich ändern:
   wer eine Farbe vormerkt und danach bedienen muss, darf sie nicht
   mehr legen. In dem Fall wird die Vormerkung verworfen und gefragt,
   statt stillschweigend eine andere Karte zu spielen. */
function spieleVorgemerkte() {
  const card = app.armed;
  if (!card) return;
  app.armed = null;
  if (legalCards(app.st, 0).indexOf(card) < 0) {
    renderHand();
    $("#handnote").textContent = `${cardName(card)} geht jetzt nicht mehr — du musst bedienen.`;
    return;
  }
  /* Zwischen Vormerkung und Zug liegt ein Lidschlag — in dem ich
     auch noch selbst eine andere Karte anklicken kann. Deshalb vor
     dem Legen erneut prüfen, ob der Zug überhaupt noch mir gehört
     und die Karte noch auf der Hand liegt. */
  setTimeout(() => {
    if (!app.st || app.st.phase !== "play" || app.st.turn !== 0) return;
    if (legalCards(app.st, 0).indexOf(card) < 0) return;
    commit(0, card);
  }, 200);
}

function commit(p, card) {
  const before = app.st;
  if (p === 0) app.decisions.push({ state: before, p, card });
  app.st = playCard(before, p, card);
  if (app.st.trick.length === 0) {
    const t = app.st.tricks[app.st.tricks.length - 1];
    app.lastTrick = { plays: t.plays, winner: t.winner, points: t.points, fresh: true };
  }
  render();
  if (app.st.phase === "done") return setTimeout(finishHand, 1000);
  if (app.st.tricks.length === 0 && app.st.trick.length === 1) {
    return setTimeout(() => kontraRunde(() => planeTakt(tick, 170)), 170);
  }
  planeTakt(tick, 170);
}

/* Ein Klick auf eine Handkarte bedeutet zweierlei, je nachdem, ob
   ich dran bin: sofort legen — oder vormerken. Nochmal auf dieselbe
   Karte tippen hebt die Vormerkung wieder auf. */
function handClick(card) {
  const st = app.st;
  if (!st || st.phase !== "play") return;
  if (st.turn === 0 && !app.busy) {
    if (legalCards(st, 0).indexOf(card) < 0) return;
    app.armed = null;
    return commit(0, card);
  }
  app.armed = app.armed === card ? null : card;
  renderHand();
}

function finishHand() {
  const st = app.st;
  const res = settle(st);
  app.result = res;
  res.delta.forEach((v, p) => (store.scores[p] += v));
  store.hands += 1;
  app.review = buildReview(app.decisions, rng);
  store.stats.decisions += app.review.items.length;
  store.stats.loss += app.review.items.reduce((a, i) => a + i.loss, 0);
  save(store);
  app.dealer = (app.dealer + 1) % 4;

  const wir = isDeclarerSide(st, 0);
  const meine = res.declWins === wir;
  const seite = st.game.type === "sauspiel"
    ? `${NAMES[st.declarer]} und ${NAMES[st.partner]}`
    : NAMES[st.declarer];
  modal(`
    <h2>${meine ? "Gewonnen" : "Verloren"}</h2>
    <p>${seite} ${res.declWins ? "gewinnt" : "verliert"} mit ${res.dPts} zu ${res.oPts} Augen.
    ${res.flags.length ? res.flags.join(", ") + "." : ""}</p>
    <p class="tally">${res.delta.map((v, p) => `<span>${NAMES[p]} <b class="${v >= 0 ? "plus" : "minus"}">${v > 0 ? "+" : ""}${v}</b></span>`).join("")}</p>
    <p class="muted">${app.review.mistakes.length
      ? `${app.review.mistakes.length} Stellen zum Nachschauen — im Durchschnitt ${app.review.avgLoss.toFixed(1)} Augen pro Zug daneben.`
      : "Sauber gespielt, nichts Auffälliges gefunden."}</p>
    <div class="row">
      <button type="button" class="primary" data-act="neu">Nächstes Blatt</button>
      <button type="button" data-act="auswertung">Auswertung ansehen</button>
    </div>
  `);
  $("#modal").querySelectorAll("[data-act]").forEach((el) =>
    el.addEventListener("click", () => {
      closeModal();
      if (el.dataset.act === "neu") newHand();
      else { showTab("auswertung"); render(); }
    })
  );
  render();
}

/* ============================ Anzeige ============================ */

function gameLabel(g) {
  if (!g) return "weiter";
  const tout = g.tout ? " Tout" : "";
  if (g.type === "sauspiel") return `Sauspiel auf die ${SUITNAME[g.suit]}-Sau`;
  if (g.type === "wenz") return "Wenz" + tout;
  if (g.type === "farbwenz") return `${SUITNAME[g.suit]}-Wenz` + tout;
  return `${SUITNAME[g.suit]}-Solo` + tout;
}

function render() {
  renderStatus();
  renderTable();
  renderRueckschau();
  renderHand();
  renderSpritze();
  if (app.tab === "auswertung") renderReview();
  if (app.tab === "uebung") renderDrillPanel();
}

function renderStatus() {
  const st = app.st;
  const g = st && st.game;
  $("#status").innerHTML = `
    <div class="status-line">
      <span class="pill">${g ? gameLabel(g) : app.bidding ? "Ansage läuft" : "—"}</span>
      ${g ? `<span class="pill ghost">Trumpf: ${g.type === "wenz" ? "nur Unter" : g.type === "farbwenz" ? SUITNAME[g.suit] + " + Unter" : SUITNAME[trumpSuitOf(g)] + " + Ober/Unter"}</span>` : ""}
      ${st && st.game ? `<span class="pill ghost">Augen ${sidePointsText(st)}</span>` : ""}
      ${st && st.kontra ? `<span class="pill warn">${kontraName(st.kontra)} — Spielwert x${Math.pow(2, st.kontra)}</span>` : ""}
    </div>`;
  $("#scoreboard").innerHTML = store.scores
    .map((v, p) => `<span class="sc"><i>${NAMES[p]}</i><b class="${v >= 0 ? "plus" : "minus"}">${v > 0 ? "+" : ""}${v}</b></span>`)
    .join("");
}

function sidePointsText(st) {
  const wir = [0, 1, 2, 3].filter((p) => isDeclarerSide(st, p) === isDeclarerSide(st, 0)).reduce((a, p) => a + st.won[p], 0);
  return `${wir} : ${120 - wir}`;
}

/* Am Platz ist kein Raum für „Sauspiel auf die Eichel-Sau" — dort
   steht die Kurzform. Die volle Ansage steht oben in der Leiste. */
function kurzAnsage(b) {
  if (!b) return "weiter";
  if (b.type === "sauspiel") return `${SUITNAME[b.suit]}-Sau`;
  return gameLabel(b);
}

/* Beim Reizen sagt am Tisch niemand, *was* er spielen wollte — es
   heißt „i hätt a Spui", die Farbe fällt erst, wenn das Spiel steht.
   Wer überboten wurde, darf seine Sau also nicht verraten: sonst
   weiß der Mensch vor dem ersten Stich, wo Anderls Ass sitzt.
   Die Spielart bleibt sichtbar, die braucht man zum Überbieten. */
function verdeckteAnsage(b) {
  if (!b) return "weiter";
  const tout = b.tout ? " Tout" : "";
  if (b.type === "sauspiel") return "Sauspiel";
  if (b.type === "wenz") return "Wenz" + tout;
  if (b.type === "farbwenz") return "Farbwenz" + tout;
  return "Solo" + tout;
}

/* Angesagt hat immer nur einer: der, der gerade vorne liegt. Vorher
   stand unter jedem Sitz, was er gereizt hätte — drei Kästen mit
   "Sauspiel" untereinander, obwohl ein Sauspiel kein Sauspiel überbietet
   und nur einer von ihnen je spielen konnte. Wer weiter sagt oder
   überboten wird, sagt am Tisch gar nichts. */
function fuehrendeAnsage() {
  if (app.bidding) return app.bidding.best;
  const st = app.st;
  return st && st.game ? { p: st.declarer, bid: st.game } : null;
}

function seatBox(p) {
  const st = app.st;
  const fuehrt = fuehrendeAnsage();
  const bid = fuehrt && fuehrt.p === p ? fuehrt : null;
  const isDecl = st && st.game && st.declarer === p;
  const isPart = st && st.game && st.partnerKnown && st.partner === p && st.game.type === "sauspiel";
  const active = st && st.phase === "play" && st.turn === p;
  return `<div class="seat ${active ? "active" : ""}">
    <div class="who">${NAMES[p]}${isDecl ? ' <span class="tag">spielt</span>' : ""}${isPart ? ' <span class="tag partner">Partner</span>' : ""}</div>
    <div class="backs">${st ? st.hands[p].map((c, i) => backHtml(i)).join("") : ""}</div>
    ${bid ? `<div class="said">${isDecl ? kurzAnsage(bid.bid) : verdeckteAnsage(bid.bid)}</div>` : ""}
  </div>`;
}

/* "Du sticht" wäre falsch — der eigene Sitz braucht die zweite Person.
   Tisch und Rückschau sagen denselben Satz, also steht er einmal da. */
const stichSatz = (p) => (p === 0 ? "Du stichst" : `${NAMES[p]} sticht`);

/* Ein Platz in der Raute. Tisch und Rückschau legen dieselbe Karte an
   dieselbe Stelle — der Unterschied steckt allein in den Klassen. */
const POS = ["s", "w", "n", "e"];
function slotHtml(x, klassen, game) {
  return `<div class="slot slot-${POS[x.p]}${klassen}">${cardHtml(x.card, { small: true, trump: game && isTrump(x.card, game) })}</div>`;
}

function renderTable() {
  const st = app.st;
  for (const p of [1, 2, 3]) $("#seat-" + p).innerHTML = seatBox(p);
  const plays = st && st.trick.length ? st.trick : app.lastTrick ? app.lastTrick.plays : [];
  const winner = st && st.trick.length ? -1 : app.lastTrick ? app.lastTrick.winner : -1;
  /* Jedes .slot bringt seine Einwurf-Animation mit. Weil der Stich bei
     jedem Zug komplett neu geschrieben wurde, lief sie auch für die
     Karten, die längst lagen — die zuckten bei jedem Bot-Zug in die
     Mitte und wieder heraus, bis der Stich voll war. Wer schon liegt,
     bekommt deshalb "liegt" und damit keine Animation mehr. */
  const kiste = $("#trick");
  const lag = kiste._gelegt || [];
  const stichHtml = plays
    .map((x) => {
      const schonDa = lag.indexOf(x.p + x.card) >= 0 ? " liegt" : "";
      return slotHtml(x, `${schonDa}${x.p === winner ? " won" : ""}`, st.game);
    })
    .join("");
  /* Dieselbe Sperre wie bei der Hand: nur schreiben, wenn sich etwas
     geändert hat. Verglichen wird aber nicht das Markup, sondern nur,
     welche Karten liegen und wer den Stich hält — sonst zählt das
     frisch gesetzte "liegt" der letzten Karte schon als Änderung, und
     der Stichgewinner bekommt seinen Schwung zweimal. */
  const schluessel = plays.map((x) => x.p + x.card).join(",") + "|" + winner;
  if (kiste._schluessel !== schluessel) {
    kiste._schluessel = schluessel;
    kiste.innerHTML = stichHtml;
    kiste._gelegt = plays.map((x) => x.p + x.card);
  }
  const led = st && st.trick.length ? st.trick[0].card : null;
  $("#tricknote").textContent = st && st.game
    ? app.lastTrick && !st.trick.length
      ? `${stichSatz(app.lastTrick.winner)} — ${app.lastTrick.points} Augen`
      : led
        ? `${st.game && isTrump(led, st.game) ? "Trumpf" : SUITNAME[led[0]]} ist angespielt`
        : st.turn === 0 ? "Du spielst an" : `${NAMES[st.turn]} spielt an`
    : "";
}

/* ---------------------- Der letzte Stich ----------------------
   Regel 3.1.4 der Schafkopfschule: „Jeder Stich darf von jedem
   Spieler noch einmal aufgedeckt werden, solange nicht der nächste
   Stich umgedreht wurde." Umgedreht wird ein Stich, wenn er voll ist
   und der Sieger ihn zu sich nimmt — das Fenster reicht also bis zur
   vierten Karte des laufenden Stichs.

   Davor braucht es den Knopf nicht: bis jemand anspielt, liegt der
   fertige Stich ohnehin noch auf dem Filz (siehe renderTable und
   app.lastTrick). Der Knopf schliesst genau die Lücke danach.

   Kein Hinweis aufs Spiel, nur ein Gedächtnisstützpunkt — die Regel
   „erst der eigene Zug, dann die Erklärung" bleibt unberührt. */
function darfRueckschau(st) {
  return !!(st && st.phase === "play" && st.tricks.length > 0 && st.trick.length > 0);
}


function zeigeRueckschau(an) {
  if (an && !darfRueckschau(app.st)) return;
  app.rueckschau = an;
  /* Der Tisch hält an, solange der Stich offen liegt — sonst ist das
     Fenster zu, bevor man gelesen hat, wer was gelegt hat. */
  if (an) clearTimeout(taktUhr);
  render();
  if (!an) planeTakt(tick, 0);
}

function renderRueckschau() {
  const knopf = $("#letzterstich");
  const kasten = $("#rueckschau");
  const st = app.st;
  const moeglich = darfRueckschau(st);
  /* Fällt das Fenster zu, während die Rückschau steht — vorgemerkte
     Karte, oder selbst gelegt —, räumt sie sich selbst ab. */
  if (!moeglich) app.rueckschau = false;
  knopf.hidden = !moeglich;
  knopf.title = "Regel 3.1.4: Der letzte Stich darf angeschaut werden, solange der laufende nicht voll ist.";
  kasten.hidden = !app.rueckschau;
  if (!app.rueckschau) return;
  const t = st.tricks[st.tricks.length - 1];
  const html = `<div class="trick">${t.plays.map((x) => slotHtml(x, x.p === t.winner ? " liegt sieger" : " liegt", st.game)).join("")}</div>
    <p class="rueckschau-note">${st.tricks.length}. Stich — ${stichSatz(t.winner)}, ${t.points} Augen</p>
    <button type="button" class="ghostbtn">Zurück</button>`;
  if (kasten._html === html) return;
  kasten._html = html;
  kasten.innerHTML = html;
}

function renderHand() {
  const st = app.st;
  if (!st) return;
  const g = st.game;
  const meinZug = st.phase === "play" && st.turn === 0 && !app.busy;
  const legal = meinZug ? legalCards(st, 0) : [];
  /* Bin ich dran, sind nur die erlaubten Karten aktiv — ein
     ungültiger Zug soll gar nicht erst anklickbar sein. Bin ich
     nicht dran, bleiben alle aktiv: dann merkt der Klick vor. */
  const html = sortHand(st.hands[0], g)
    .map((c, i) => cardHtml(c, {
      button: true,
      i,
      disabled: meinZug && legal.indexOf(c) < 0,
      trump: g && isTrump(c, g),
      armed: app.armed === c,
    }))
    .join("");
  const box = $("#hand");
  box.classList.toggle("is-frisch", app.frischeHand);
  /* Ob ich am Zug bin, steht jetzt an der Hand selbst. Seit eine
     Karte auch vorgemerkt werden kann, sagt „anklickbar" allein
     nicht mehr, dass ich dran bin — test/ui.smoke.js liest das. */
  box.classList.toggle("mein-zug", meinZug);
  /* Nur neu schreiben, wenn sich wirklich etwas geändert hat. Sonst
     zuckt die Hand bei jedem Bot-Zug und verliert den Mauszustand. */
  if (box._html !== html) { box._html = html; box.innerHTML = html; }

  const called = g && calledCard(g);
  $("#handnote").textContent = st.phase !== "play"
    ? ""
    : called && st.hands[0].indexOf(called) >= 0 && !st.partnerKnown
      ? `Du hast die gerufene ${SUITNAME[g.suit]}-Sau — du spielst mit ${NAMES[st.declarer]}.`
      : meinZug ? "Du bist dran."
        : app.armed ? `${cardName(app.armed)} ist vorgemerkt.`
          : "";
}

/* Der Spritzknopf steht neben dem Fächer, solange die Regel sie
   zulässt — nicht länger und nicht kürzer. `frisch` startet die
   Ablaufleiste neu; sie zeigt die Bedenkzeit, die der Tisch dem
   Menschen einräumt, nicht das Regelfenster selbst. */
function renderSpritze(frisch) {
  const btn = $("#spritze");
  if (!btn) return;
  const moeglich = !!(app.st && darfKontra(app.st, 0));
  btn.hidden = !moeglich;
  if (!moeglich) {
    btn.classList.remove("laeuft");
    return;
  }
  const wort = kontraName(app.st.kontra + 1);
  const html = `<b>${wort}!</b><span>Spielwert x2</span>`;
  btn.title = `${wort} verdoppelt den Spielwert — möglich, solange die zweite Karte nicht liegt.`;
  if (btn._html !== html) { btn._html = html; btn.innerHTML = html; }
  if (!frisch) return;
  /* Die Leiste läuft nur, wenn sie neu gestartet wird — ohne den
     erzwungenen Umbruch behält sie die alte Animation. */
  btn.classList.remove("laeuft");
  if (btn.style) btn.style.setProperty("--frist", SPRITZ_FENSTER + "ms");
  void btn.offsetWidth;
  btn.classList.add("laeuft");
}

function banner(text, actions) {
  $("#banner").innerHTML = `<span>${text}</span>` +
    (actions || []).map((a) => `<button type="button" data-act="${a.act}">${a.label}</button>`).join("");
  $("#banner").classList.toggle("on", !!text);
  $("#banner").querySelectorAll("[data-act]").forEach((el) =>
    el.addEventListener("click", () => { if (el.dataset.act === "neu") { $("#banner").classList.remove("on"); newHand(); } })
  );
  if (!actions || !actions.length) setTimeout(() => $("#banner").classList.remove("on"), 2600);
}

/* ============================ Auswertung ============================ */

/* Die Buchregel zu einem besprochenen Zug — dieselbe Kennung, nach der
   die Bots ziehen. Erscheint nur in der Auswertung und in der Uebung,
   nie waehrend des Spiels: erst der eigene Zug, dann die Erklaerung. */
function buchregelHtml(b) {
  if (!b) return "";
  return b.gefolgt
    ? `<p class="buchregel gefolgt">Buchregel S.&nbsp;${b.seite}: ${b.kurz} <em>Genau das hast du gespielt.</em></p>`
    : `<p class="buchregel">Buchregel S.&nbsp;${b.seite}: ${b.kurz} <em>Danach käme ${b.kartenName}.</em></p>`;
}

function renderReview() {
  const box = $("#view-auswertung");
  if (!app.review) {
    box.innerHTML = `<div class="empty"><h2>Noch nichts auszuwerten</h2><p>Spiel ein Blatt zu Ende — danach steht hier jeder Zug, der Augen gekostet hat, mit dem passenden Prinzip.</p></div>`;
    return;
  }
  const r = app.review;
  const list = r.mistakes.length ? r.mistakes : r.items.slice(0, 3);
  box.innerHTML = `
    <h2>Auswertung</h2>
    <p class="muted">${r.items.length} echte Entscheidungen, im Schnitt ${r.avgLoss.toFixed(1)} Augen unter dem besten Zug.</p>
    ${list.map((m, i) => `
      <article class="lesson">
        <header>
          <span class="stich">${m.trick}. Stich</span>
          <span class="verlust ${m.loss >= 6 ? "hoch" : m.loss >= 2 ? "mittel" : "klein"}">${m.loss.toFixed(1)} Augen</span>
        </header>
        <div class="lesson-cards">
          <div><small>gespielt</small>${cardHtml(m.card, { small: true })}</div>
          ${m.best !== m.card ? `<div><small>besser</small>${cardHtml(m.best, { small: true })}</div>` : ""}
        </div>
        ${m.notes.map((n) => `<p class="note">${n[1]}</p>`).join("")}
        ${buchregelHtml(m.buchregel)}
        ${m.lessons.map((l) => `<details class="prinzip"><summary>${l.titel}</summary><p>${l.lang}</p>${l.buch ? `<p class="buch">Buch: ${l.buch.kapitel}${l.buch.seite ? ", S. " + l.buch.seite : ""} — ${l.buch.kern}</p>` : ""}</details>`).join("")}
        <button type="button" class="ghostbtn" data-drill="${i}">Als Übung merken</button>
      </article>`).join("")}
  `;
  box.querySelectorAll("[data-drill]").forEach((el) =>
    el.addEventListener("click", () => {
      saveDrill(store, list[Number(el.dataset.drill)]);
      el.textContent = "Gemerkt ✓";
      el.disabled = true;
    })
  );
}

/* ============================ Übung ============================ */

function renderDrillPanel() {
  const box = $("#view-uebung");
  if (!app.drill) {
    box.innerHTML = `
      <h2>Übung</h2>
      <p class="muted">Eine Stellung, eine Entscheidung, sofort die Begründung.</p>
      <div class="row">
        <button type="button" class="primary" data-start="buch">Aus dem Buch (${STELLUNGEN.length})</button>
        <button type="button" data-start="zufall">Zufallsstellung</button>
        <button type="button" data-start="eigene" ${store.drills.length ? "" : "disabled"}>Aus eigenen Partien (${store.drills.length})</button>
      </div>
      ${store.drills.length ? `<ul class="drilllist">${store.drills.slice(0, 8).map((d) => `<li>${gameLabelSafe(d.state.game)} · ${d.verlust} Augen · gespielt ${cardName(d.gespielt)}</li>`).join("")}</ul>` : ""}`;
    box.querySelectorAll("[data-start]").forEach((el) =>
      el.addEventListener("click", () => startDrill(el.dataset.start)));
    return;
  }
  const d = app.drill;
  if (d.buch) return renderBuchDrill(d);
  const st = d.state;
  const legal = legalCards(st, d.p);
  box.innerHTML = `
    <h2>Übung</h2>
    <p class="muted">${gameLabelSafe(st.game)} · ${st.declarer === d.p ? "du spielst" : isDeclarerSide(st, d.p) ? "du bist Partner" : "du bist Gegenspieler"} · ${st.tricks.length + 1}. Stich</p>
    <div class="drill-trick">${st.trick.length
      ? st.trick.map((x) => `<div class="mini">${cardHtml(x.card, { small: true })}<small>${NAMES[x.p]}</small></div>`).join("")
      : '<p class="muted">Du spielst an.</p>'}</div>
    <div class="drill-hand">${sortHand(st.hands[d.p], st.game).map((c) =>
      cardHtml(c, { button: true, disabled: legal.indexOf(c) < 0 || !!d.answer, small: true, selected: d.answer === c })).join("")}</div>
    <div id="drill-feedback">${d.feedback || '<p class="muted">Welche Karte legst du?</p>'}</div>
    <div class="row">
      <button type="button" data-next="1">${d.answer ? "Nächste Stellung" : "Überspringen"}</button>
      <button type="button" data-close="1">Zurück</button>
    </div>`;
  box.querySelectorAll(".drill-hand [data-card]").forEach((el) =>
    el.addEventListener("click", () => answerDrill(el.dataset.card)));
  box.querySelector("[data-next]").addEventListener("click", () => startDrill(d.quelle === "eigene Partie" ? "eigene" : "zufall"));
  box.querySelector("[data-close]").addEventListener("click", () => { app.drill = null; renderDrillPanel(); });
}

const gameLabelSafe = (g) => (g ? gameLabel(g) : "—");

function renderBuchDrill(d) {
  const b = d.buch;
  const box = $("#view-uebung");
  const regel = BUCH_REGELN.find((r) => r.id === b.regelId);
  box.innerHTML = `
    <h2>Aus dem Buch</h2>
    <p class="muted">Kapitel ${regel ? regel.kapitel : ""}, Seite ${b.seite} · ${b.label || gameLabel(b.spiel)} · du bist ${b.rolle} auf Platz ${b.ich}</p>
    <p>${b.lage}</p>
    ${b.hinweis ? `<p class="buch">${b.hinweis}</p>` : ""}
    ${b.stich.length ? `<div class="drill-trick">${b.stich.map((x) => `<div class="mini">${cardHtml(x.card, { small: true })}<small>Platz ${x.sitz}</small></div>`).join("")}</div>` : ""}
    <div class="drill-hand">${sortHand(b.hand, b.spiel).map((c) =>
      cardHtml(c, { button: true, small: true, disabled: !!d.answer || !!b.optionen, selected: d.answer === c, trump: isTrump(c, b.spiel) })).join("")}</div>
    ${b.optionen ? `<div class="row">${b.optionen.map((o) => `<button type="button" class="bid" data-opt="${o}" ${d.answer ? "disabled" : ""}>${o}</button>`).join("")}</div>` : ""}
    <div>${d.feedback || `<p class="muted">${b.frage}</p>`}</div>
    <div class="row">
      <button type="button" data-next="1">${d.answer ? "Nächste Aufgabe" : "Andere Aufgabe"}</button>
      <button type="button" data-close="1">Zurück</button>
    </div>`;
  box.querySelectorAll(".drill-hand [data-card]").forEach((el) =>
    el.addEventListener("click", () => antwortBuch(el.dataset.card)));
  box.querySelectorAll("[data-opt]").forEach((el) =>
    el.addEventListener("click", () => antwortBuch(el.dataset.opt)));
  box.querySelector("[data-next]").addEventListener("click", () => startDrill("buch"));
  box.querySelector("[data-close]").addEventListener("click", () => { app.drill = null; renderDrillPanel(); });
}

function antwortBuch(card) {
  const d = app.drill;
  if (!d || d.answer) return;
  const b = d.buch;
  const richtig = b.loesung.indexOf(card) >= 0;
  const regel = BUCH_REGELN.find((r) => r.id === b.regelId);
  d.answer = card;
  d.feedback = `
    <div class="verdict ${richtig ? "gut" : "schlecht"}">${richtig ? "Richtig." : "Das Buch sagt etwas anderes."}</div>
    <p>Antwort des Buches: ${b.loesungstext}.</p>
    <p class="note">${b.begruendung}</p>
    ${regel ? `<details class="prinzip" open><summary>${regel.titel}<span class="bereich">S. ${regel.seite}</span></summary><p>${regel.lang}</p></details>` : ""}`;
  store.geloest = [...new Set([...(store.geloest || []), b.id])];
  save(store);
  renderDrillPanel();
}

function startDrill(kind) {
  if (kind === "buch") {
    const offen = STELLUNGEN.filter((x) => (store.geloest || []).indexOf(x.id) < 0);
    const pool = offen.length ? offen : STELLUNGEN;
    app.drill = { buch: pool[Math.floor(Math.random() * pool.length)] };
    return renderDrillPanel();
  }
  if (kind === "eigene" && store.drills.length) {
    const d = store.drills[Math.floor(Math.random() * store.drills.length)];
    app.drill = { state: d.state, p: d.p, quelle: "eigene Partie" };
  } else {
    const gen = randomDrill(Math.floor(Math.random() * 1e9));
    if (!gen) return;
    app.drill = gen;
  }
  renderDrillPanel();
}

function answerDrill(card) {
  const d = app.drill;
  if (!d || d.answer) return;
  const v = judge(d.state, d.p, card, rng);
  d.answer = card;
  d.feedback = `
    <div class="verdict ${v.ok ? "gut" : "schlecht"}">${v.ok ? "Passt." : `Kostet ${v.loss.toFixed(1)} Augen.`}</div>
    ${v.ok ? "" : `<p>Besser wäre ${v.bestText} gewesen.</p>`}
    ${v.notes.map((n) => `<p class="note">${n}</p>`).join("")}
    ${buchregelHtml(v.buchregel)}
    ${v.lessons.map((l) => `<details class="prinzip" open><summary>${l.titel}</summary><p>${l.lang}</p>${l.buch ? `<p class="buch">Buch: ${l.buch.kapitel} — ${l.buch.kern}</p>` : ""}</details>`).join("")}
    <p class="muted small">Bewertung: ${v.ranking.slice(0, 3).map((e) => `${cardName(e.card)} ${e.value.toFixed(0)}`).join(" · ")} (erwartete Augen deiner Partei)</p>`;
  renderDrillPanel();
}

/* ============================ Regeln ============================ */

function renderRules(filter) {
  const f = (filter || "").toLowerCase();
  const hit = (t) => !f || t.toLowerCase().includes(f);
  const rules = RULES.filter((r) => hit(r.titel + r.text));
  const prins = allPrinciples().filter((p) => hit(p.titel + p.kurz + p.lang + p.bereich));
  $("#rules-body").innerHTML = `
    <section>
      <h3>Regeln</h3>
      ${rules.map((r) => `<details class="prinzip"><summary>${r.titel}</summary><p>${r.text}</p></details>`).join("") || '<p class="muted">Nichts gefunden.</p>'}
    </section>
    <section>
      <h3>Merksätze aus dem Buch</h3>
      ${BUCH_REGELN.filter((r) => hit(r.titel + r.kurz + r.lang)).map((r) => `<details class="prinzip"><summary>${r.titel}<span class="bereich">${r.kapitel}, S. ${r.seite}</span></summary><p>${r.lang}</p></details>`).join("") || '<p class="muted">Nichts gefunden.</p>'}
    </section>
    <section>
      <h3>Ansage nach dem Buch</h3>
      ${ALLE_REGELN.filter((r) => hit(r.titel + r.kurz)).map((r) => `<details class="prinzip"><summary>${r.titel}<span class="bereich">S. ${r.seite}</span></summary><p>${r.kurz}</p></details>`).join("") || '<p class="muted">Nichts gefunden.</p>'}
    </section>
    <section>
      <h3>Glossar</h3>
      ${GLOSSAR.filter((g) => hit(g.wort + g.text)).map((g) => `<details class="prinzip"><summary>${g.wort}<span class="bereich">S. 240</span></summary><p>${g.text}</p></details>`).join("") || '<p class="muted">Nichts gefunden.</p>'}
    </section>
    <section>
      <h3>Prinzipien</h3>
      ${prins.map((p) => `<details class="prinzip"><summary>${p.titel}<span class="bereich">${p.bereich}</span></summary><p>${p.lang}</p>${p.buch ? `<p class="buch">Buch: ${p.buch.kapitel}${p.buch.seite ? ", S. " + p.buch.seite : ""} — ${p.buch.kern}</p>` : ""}</details>`).join("") || '<p class="muted">Nichts gefunden.</p>'}
    </section>
    ${hasBook() ? `<p class="muted small">Buchwissen aus „${BOOK.titel}“ ist eingebunden.</p>`
      : `<p class="muted small">Noch kein Buch eingebunden — die Einträge in <code>src/knowledge/book.js</code> erscheinen automatisch hier und in der Auswertung.</p>`}`;
}

/* ============================ Rahmen ============================ */

/* `klasse` steht am Dialograhmen, nicht am Blatt darin: der
   Ansagedialog braucht eine andere Lage als der Abrechnungsdialog,
   und die Handzeile darunter muss wissen, dass sie hell bleiben
   soll (siehe styles.css, `.modal.ansage`). */
function modal(html, klasse) {
  $("#modal").innerHTML = `<div class="sheet">${html}</div>`;
  $("#modal").classList.add("on");
  if (klasse) $("#modal").classList.add(klasse);
}
function closeModal() {
  $("#modal").classList.remove("on");
  $("#modal").classList.remove("ansage");
  $("#modal").innerHTML = "";
}

function showTab(name) {
  app.tab = name;
  document.querySelectorAll("main > section").forEach((s) => s.classList.toggle("on", s.id === "view-" + name));
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === name));
  if (name === "regeln") renderRules($("#rulesearch").value);
  if (name === "auswertung") renderReview();
  if (name === "uebung") renderDrillPanel();
}

function boot() {
  document.querySelectorAll(".tabs button").forEach((b) =>
    b.addEventListener("click", () => showTab(b.dataset.tab)));
  $("#hand").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-card]");
    if (btn && !btn.disabled) handClick(btn.dataset.card);
  });
  $("#level").innerHTML = LEVELS.map((l, i) => `<option value="${i}" ${store.settings.level === i ? "selected" : ""}>${l}</option>`).join("");
  $("#level").addEventListener("change", (e) => {
    store.settings.level = Number(e.target.value);
    save(store);
  });
  $("#spritze").addEventListener("click", gibSpritze);
  $("#letzterstich").addEventListener("click", () => zeigeRueckschau(true));
  /* Ein Klick irgendwohin auf die Rückschau legt sie wieder weg — der
     "Zurück"-Knopf liegt darin und schliesst dadurch mit. So hängt
     genau ein Zuhörer an einem festen Element, statt nach jedem
     innerHTML neu gebunden zu werden. */
  $("#rueckschau").addEventListener("click", () => zeigeRueckschau(false));
  $("#newhand").addEventListener("click", () => { closeModal(); newHand(); });
  $("#resetscore").addEventListener("click", () => {
    if (!confirm("Punktestand und gemerkte Übungen löschen?")) return;
    reset();
    location.reload();
  });
  $("#rulesearch").addEventListener("input", (e) => renderRules(e.target.value));
  showTab("spiel");
  newHand();
}

boot();
