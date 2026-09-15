/* ============================================================
   SCHAFKOPF ENGINE
   Karte = "EA" (Eichel-Sau), "GO" (Gras-Ober) ...
   Farben: E Eichel, G Gras, H Herz, S Schellen
   ============================================================ */

const SUITS = ["E", "G", "H", "S"];
const SUITNAME = { E: "Eichel", G: "Gras", H: "Herz", S: "Schellen" };
const RANKS = ["A", "X", "K", "O", "U", "9", "8", "7"];
const RANKNAME = { A: "Sau", X: "Zehner", K: "König", O: "Ober", U: "Unter", "9": "Neuner", "8": "Achter", "7": "Siebener" };
const PTS = { A: 11, X: 10, K: 4, O: 3, U: 2, "9": 0, "8": 0, "7": 0 };
const RANKVAL = { A: 7, X: 6, K: 5, O: 4, "9": 3, "8": 2, "7": 1 };

const cardName = (c) => SUITNAME[c[0]] + "-" + RANKNAME[c[1]];
const points = (c) => PTS[c[1]];

function makeDeck() {
  const d = [];
  for (const s of SUITS) for (const r of RANKS) d.push(s + r);
  return d;
}

function shuffled(rng) {
  const d = makeDeck();
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = d[i]; d[i] = d[j]; d[j] = t;
  }
  return d;
}

/* Spielarten: sauspiel, solo (Farbsolo), wenz, farbwenz.
   Der Farbwenz kommt bisher nur in Buchstellungen vor — angesagt
   wird er nicht. Trumpf sind dort die vier Unter und die Trumpffarbe,
   in der die Ober ganz gewöhnliche Farbkarten zwischen König und
   Neuner sind. */
const trumpSuitOf = (g) => (g.type === "wenz" ? null : g.type === "sauspiel" ? "H" : g.suit);

function isTrump(c, g) {
  if (g.type === "wenz") return c[1] === "U";
  if (g.type === "farbwenz") return c[1] === "U" || c[0] === g.suit;
  return c[1] === "O" || c[1] === "U" || c[0] === trumpSuitOf(g);
}

const effSuit = (c, g) => (isTrump(c, g) ? "T" : c[0]);

function power(c, g) {
  if (!isTrump(c, g)) return RANKVAL[c[1]];
  if (g.type === "wenz") return 100 - SUITS.indexOf(c[0]);
  if (g.type === "farbwenz") return c[1] === "U" ? 190 - SUITS.indexOf(c[0]) : 100 + RANKVAL[c[1]];
  if (c[1] === "O") return 200 - SUITS.indexOf(c[0]);
  if (c[1] === "U") return 190 - SUITS.indexOf(c[0]);
  return 100 + RANKVAL[c[1]];
}

function trumpOrder(g) {
  return makeDeck().filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
}

function sortHand(hand, g) {
  const gg = g || { type: "sauspiel", suit: "E" };
  return hand.slice().sort((a, b) => {
    const ta = isTrump(a, gg), tb = isTrump(b, gg);
    if (ta !== tb) return ta ? -1 : 1;
    if (ta) return power(b, gg) - power(a, gg);
    if (a[0] !== b[0]) return SUITS.indexOf(a[0]) - SUITS.indexOf(b[0]);
    return RANKVAL[b[1]] - RANKVAL[a[1]];
  });
}

function trickWinner(plays, g) {
  const lead = effSuit(plays[0].card, g);
  let best = plays[0];
  for (let i = 1; i < plays.length; i++) {
    const x = plays[i];
    const bT = isTrump(best.card, g), xT = isTrump(x.card, g);
    if (xT && !bT) best = x;
    else if (xT === bT && effSuit(x.card, g) === effSuit(best.card, g) && effSuit(x.card, g) === (bT ? "T" : lead) && power(x.card, g) > power(best.card, g)) best = x;
  }
  return best.p;
}

const calledCard = (g) => (g.type === "sauspiel" ? g.suit + "A" : null);

function legalCards(st, p) {
  const g = st.game, hand = st.hands[p], trick = st.trick;
  const called = calledCard(g);
  const hasSau = !!called && hand.indexOf(called) >= 0;
  const isRuf = (c) => !!called && c[0] === g.suit && !isTrump(c, g);

  if (trick.length === 0) {
    if (hasSau && !st.sauFree) {
      const cnt = hand.filter(isRuf).length;
      if (cnt < 4) return hand.filter((c) => c === called || !isRuf(c));
    }
    return hand.slice();
  }
  const lead = effSuit(trick[0].card, g);
  const follow = hand.filter((c) => effSuit(c, g) === lead);
  if (follow.length) {
    if (hasSau && !st.sauFree && lead === g.suit) return [called];
    return follow;
  }
  if (hasSau && !st.sauFree) {
    const o = hand.filter((c) => c !== called);
    if (o.length) return o;
  }
  return hand.slice();
}

/* ---------------- Blatt / Zustand ---------------- */

function newDeal(dealer, rng) {
  const d = shuffled(rng);
  const hands = [0, 1, 2, 3].map((i) => d.slice(i * 8, i * 8 + 8));
  return {
    dealer,
    hands,
    orig: hands.map((h) => h.slice()),
    game: null,
    declarer: -1,
    partner: -1,
    partnerKnown: false,
    trick: [],
    leader: (dealer + 1) % 4,
    turn: (dealer + 1) % 4,
    tricks: [],
    won: [0, 0, 0, 0],
    sauFree: false,
    voids: [{}, {}, {}, {}],
    /* Spritze und Retour-Spritze. `kontra` ist die Zahl der Verdopplungen,
       `kontraVon` der Sitz, der die letzte gegeben hat. */
    kontra: 0,
    kontraVon: -1,
    phase: "bidding",
  };
}

/* ============================================================
   DIE SPRITZE (Glossar S. 242, Kapitel 6.5)

   „Eine weit verbreitete Regel erlaubt Spritzen und Retour-Spritzen,
   solange die zweite Karte noch nicht auf dem Tisch liegt.“ Genau
   dieses Fenster bildet `darfKontra` ab.

   Geben darf, wer nicht sicher weiß, dass er zur Spielerpartei
   gehört — im Sauspiel sind das alle außer dem Spielmacher und dem
   Halter der Rufsau. Die Retour kommt umgekehrt nur von der
   Spielerpartei. Jede Verdopplung zählt in `settle` als Faktor 2.
   ============================================================ */

function darfKontra(st, p) {
  const g = st.game;
  if (!g || st.phase !== "play" || st.kontra >= 2) return false;
  if (st.tricks.length > 0 || st.trick.length > 1) return false;
  if (st.kontra === 0) return !knowsOwnSide(st, p);
  return knowsOwnSide(st, p);
}

function gibKontra(st, p) {
  if (!darfKontra(st, p)) return st;
  return { ...st, kontra: st.kontra + 1, kontraVon: p };
}

/** Wie die Verdopplung heißt: „Spritze“, dann „Retour“. */
const kontraName = (n) => (n >= 2 ? "Retour" : n === 1 ? "Spritze" : "");

function isDeclarerSide(st, p) {
  if (!st.game) return false;
  if (st.game.type !== "sauspiel") return p === st.declarer;
  return p === st.declarer || p === st.partner;
}

function sameSide(st, a, b) {
  if (a === b) return true;
  return isDeclarerSide(st, a) === isDeclarerSide(st, b);
}

/** Partei aus eigener Sicht — die eigene Seite kennt jeder Spieler immer */
function ownSide(st, p) {
  const g = st.game;
  if (g.type !== "sauspiel") return p === st.declarer;
  return p === st.declarer || st.partner === p || st.hands[p].indexOf(calledCard(g)) >= 0;
}

/** Weiß p sicher, dass q auf seiner Seite spielt? */
function knownSameSide(st, p, q) {
  if (p === q) return true;
  const g = st.game;
  if (g.type !== "sauspiel") return p !== st.declarer && q !== st.declarer;
  if (st.partnerKnown) return isDeclarerSide(st, p) === isDeclarerSide(st, q);
  if (st.hands[p].indexOf(calledCard(g)) >= 0) return q === st.declarer;
  return false;
}

/** Was `viewer` über `other` sicher weiß: 1 Partner, -1 Gegner, 0 unbekannt */
function relation(st, viewer, other) {
  if (viewer === other) return 1;
  const g = st.game;
  if (!g) return 0;
  if (g.type !== "sauspiel") return viewer === st.declarer || other === st.declarer ? -1 : 1;
  if (st.partnerKnown) return sameSide(st, viewer, other) ? 1 : -1;
  const holdsSau = st.hands[viewer].indexOf(calledCard(g)) >= 0;
  if (holdsSau) return other === st.declarer ? 1 : -1;
  if (viewer === st.declarer) return 0;
  return other === st.declarer ? -1 : 0;
}

/** weiß der Spieler selbst, dass er zur Spielerpartei gehört? */
function knowsOwnSide(st, p) {
  const g = st.game;
  if (!g) return false;
  if (g.type !== "sauspiel") return p === st.declarer;
  return p === st.declarer || st.hands[p].indexOf(calledCard(g)) >= 0 || (st.partnerKnown && p === st.partner);
}

function playCard(st, p, card) {
  const g = st.game;
  const s = {
    ...st,
    hands: st.hands.map((h) => h.slice()),
    trick: st.trick.slice(),
    tricks: st.tricks.slice(),
    voids: st.voids.map((v) => ({ ...v })),
    won: st.won.slice(),
  };
  const called = calledCard(g);

  if (s.trick.length) {
    const lead = effSuit(s.trick[0].card, g);
    if (effSuit(card, g) !== lead) s.voids[p][lead] = true;
  } else if (called && card[0] === g.suit && !isTrump(card, g) && card !== called && s.hands[p].indexOf(called) >= 0) {
    s.sauFree = true; // davongelaufen
  }

  s.hands[p] = s.hands[p].filter((c) => c !== card);
  s.trick.push({ p, card });
  if (called && card === called) { s.partner = p; s.partnerKnown = true; s.sauFree = true; }

  if (s.trick.length === 4) {
    const w = trickWinner(s.trick, g);
    const pts = s.trick.reduce((a, x) => a + points(x.card), 0);
    s.tricks = s.tricks.concat([{ plays: s.trick, winner: w, points: pts }]);
    s.won[w] += pts;
    s.trick = [];
    s.leader = w;
    s.turn = w;
    if (s.tricks.length === 8) s.phase = "done";
  } else {
    s.turn = (p + 1) % 4;
  }
  return s;
}

/* ---------------- Abrechnung ---------------- */

function laufende(st) {
  const g = st.game;
  const order = trumpOrder(g);
  const sideOf = (c) => isDeclarerSide(st, st.orig.findIndex((h) => h.indexOf(c) >= 0));
  const first = sideOf(order[0]);
  let n = 0;
  for (const c of order) { if (sideOf(c) === first) n++; else break; }
  const min = g.type === "wenz" || g.type === "farbwenz" ? 2 : 3;
  return n >= min ? n : 0;
}

function settle(st) {
  const g = st.game;
  const decl = [0, 1, 2, 3].filter((p) => isDeclarerSide(st, p));
  const opp = [0, 1, 2, 3].filter((p) => !isDeclarerSide(st, p));
  const dPts = decl.reduce((a, p) => a + st.won[p], 0);
  const oPts = 120 - dPts;
  const flags = [];

  /* Beim Tout zählen nicht die Augen, sondern die Stiche: der
     Alleinspieler hat angesagt, alle acht zu machen. Schneider und
     Schwarz entfallen dabei — sie sind im Tout schon enthalten. */
  const tout = !!g.tout;
  const alleStiche = st.tricks.every((t) => t.winner === st.declarer);
  const declWins = tout ? alleStiche : dPts >= 61;
  let value = tout ? 100 : g.type === "sauspiel" ? 20 : 50;
  if (tout) flags.push("Tout");
  if (!tout) {
    const loserSide = declWins ? opp : decl;
    const loserPts = declWins ? oPts : dPts;
    const noTrick = loserSide.every((p) => !st.tricks.some((t) => t.winner === p));
    if (noTrick) { value += 20; flags.push("Schwarz"); }
    else if (loserPts <= 30) { value += 10; flags.push("Schneider"); }
  }
  const l = laufende(st);
  if (l) { value += 10 * l; flags.push(l + " Laufende"); }
  if (st.kontra) {
    value *= Math.pow(2, st.kontra);
    flags.push(st.kontra >= 2 ? "Retour" : "Spritze");
  }

  const delta = [0, 0, 0, 0];
  const sign = declWins ? 1 : -1;
  if (g.type === "sauspiel") {
    decl.forEach((p) => (delta[p] = sign * value));
    opp.forEach((p) => (delta[p] = -sign * value));
  } else {
    delta[st.declarer] = sign * 3 * value;
    opp.forEach((p) => (delta[p] = -sign * value));
  }
  return { dPts, oPts, declWins, value, flags, delta, laufende: l, tout, kontra: st.kontra };
}

/* ---------------- Ansage ---------------- */

function countTrumps(hand, g) { return hand.filter((c) => isTrump(c, g)).length; }

function sauspielOptions(hand) {
  const out = [];
  for (const s of ["E", "G", "S"]) {
    if (hand.indexOf(s + "A") >= 0) continue;
    const own = hand.filter((c) => c[0] === s && c[1] !== "O" && c[1] !== "U");
    if (own.length === 0) continue;
    out.push(s);
  }
  return out;
}

function topRun(hand, g) {
  let n = 0;
  for (const c of trumpOrder(g)) { if (hand.indexOf(c) >= 0) n++; else break; }
  return n;
}

function soloStrength(hand, g) {
  const t = countTrumps(hand, g);
  const aces = hand.filter((c) => c[1] === "A" && !isTrump(c, g)).length;
  const blanks = SUITS.filter((s) => s !== trumpSuitOf(g) && hand.filter((c) => c[0] === s && !isTrump(c, g)).length === 0).length;
  return t * 1.0 + topRun(hand, g) * 1.6 + aces * 0.9 + blanks * 0.7;
}

function wenzStrength(hand) {
  const unter = hand.filter((c) => c[1] === "U").length;
  const aces = hand.filter((c) => c[1] === "A").length;
  const tens = hand.filter((c) => c[1] === "X").length;
  const shortSuits = SUITS.filter((s) => hand.filter((c) => c[0] === s && c[1] !== "U").length <= 1).length;
  return unter * 2.2 + aces * 1.3 + tens * 0.5 + shortSuits * 0.8;
}

/* Kapitel 4.14: „Auch wenn ein Farbwenz verlockend erscheint, ist ein
   normaler Wenz manchmal die bessere Wahl.“ Die harte Bedingung, die
   das Buch dort nennt, ist die Trumpfzahl — der Farbwenz hat nur zehn
   Trümpfe statt vierzehn und braucht deshalb mindestens sechs davon. */
function farbwenzStrength(hand, g) {
  if (countTrumps(hand, g) < 6) return 0;
  return soloStrength(hand, g);
}

/* Reicht das Blatt für einen Tout — also für alle acht Stiche?
   Geprüft wird die sichere Seite, nicht die hoffnungsvolle:

   - die eigenen höchsten Trümpfe müssen in ununterbrochener Folge
     ausreichen, um sämtliche gegnerischen Trümpfe zu ziehen;
   - jede Fehlfarbe muss von oben lückenlos besetzt sein, sonst
     gehört der Stich nach dem Trumpfziehen jemand anderem.

   Damit werden Blätter abgelehnt, die einen Tout gewinnen könnten.
   Das ist Absicht: ein verlorener Tout kostet das Doppelte eines
   gewonnenen Solos. */
function toutMoeglich(hand, g) {
  const alle = trumpOrder(g);
  const meine = hand.filter((c) => isTrump(c, g));
  if (topRun(hand, g) < alle.length - meine.length) return false;
  for (const s of SUITS) {
    const farbe = makeDeck().filter((c) => c[0] === s && !isTrump(c, g))
      .sort((a, b) => RANKVAL[b[1]] - RANKVAL[a[1]]);
    const meineFarbe = hand.filter((c) => c[0] === s && !isTrump(c, g));
    for (let i = 0; i < meineFarbe.length; i++) {
      if (meineFarbe.indexOf(farbe[i]) < 0) return false;
    }
  }
  return true;
}

function sauspielStrength(hand, suit) {
  const g = { type: "sauspiel", suit };
  const t = countTrumps(hand, g);
  const obers = hand.filter((c) => c[1] === "O").length;
  const aces = hand.filter((c) => c[1] === "A" && !isTrump(c, g) && c[0] !== suit).length;
  const short = hand.filter((c) => c[0] === suit && !isTrump(c, g)).length === 1 ? 0.6 : 0;
  return t * 0.9 + obers * 0.8 + topRun(hand, g) * 0.8 + aces * 0.8 + short;
}

/** level 0 = mutig/schwach, 2 = solide */
/**
 * Ab welcher Blattstaerke ein Sauspiel angesagt wird, je Spielstufe.
 *
 * Die Zahl entscheidet nicht ueber die Spielstaerke, sondern darueber,
 * wie der Tisch aussieht: eine hohe Schwelle laesst nur sichere
 * Blaetter durch, und dann gewinnt der Spielmacher fast immer. Genau
 * das war lange der Fall — 79 % gewonnene Sauspiele, waehrend ein auf
 * jedem Blatt erzwungenes Sauspiel bei 51,8 % liegt. Als Feld statt
 * als eingebaute Zahl, damit `test/ansageschwelle.js` sie durchfahren
 * kann.
 *
 * Fruecher stieg die Schwelle mit der Stufe: der starke Bot war der,
 * der am seltensten ansagte. Das ist keine Spielstaerke, sondern
 * Zurueckhaltung — und es erzeugte den Tisch, an dem der Spielmacher
 * 78 % gewann und nur zwei Drittel der Blaetter ueberhaupt gespielt
 * wurden. Jetzt gilt umgekehrt: die Schwelle haelt den Tisch bei
 * realistischen 60 bis 65 %, und die Staerke steckt allein im Spiel.
 *
 * Sie faellt mit der Stufe, weil besseres Spiel der Spielerpartei
 * mehr nuetzt als der Gegenpartei — die kennt ihren Partner, die
 * andere nicht. Gemessen (test/ansageschwelle.js):
 *
 *   Stufe 1, Schwelle 4,4   95,5 % gespielt, Spielmacher 63,3 %
 *   Stufe 3, Schwelle 4,4   94,7 % gespielt, Spielmacher 68,0 %
 *   Stufe 3, Schwelle 4,0   98,3 % gespielt, Spielmacher 62,8 %
 *
 * Stufe 0 und 2 sind dazwischen geschaetzt, nicht gemessen.
 */
const ANSAGE = { sauspiel: [4.4, 4.4, 4.2, 4.0] };

function botBid(hand, level) {
  let best = null;
  for (const s of SUITS) {
    const v = soloStrength(hand, { type: "solo", suit: s });
    if (v >= 11.5 && (!best || v > best.v)) best = { v, bid: { type: "solo", suit: s } };
  }
  const wv = wenzStrength(hand);
  if (hand.filter((c) => c[1] === "U").length >= 2 && wv >= 10.8 && (!best || wv > best.v)) best = { v: wv, bid: { type: "wenz" } };
  /* Kapitel 4.14: der Farbwenz ist keine eigene Ansage, sondern eine
     Abwägung gegen den Wenz. Er kommt nur in Frage, wo ein Wenz schon
     dransteht — „wenige Sauen und gute Unter sprechen für den
     Farbwenz, der aber mindestens sechs Trümpfe braucht“. */
  if (best && best.bid.type === "wenz") {
    /* wenzStrength() und soloStrength() rechnen in verschiedenen
       Einheiten; sie gegeneinander zu stellen sagt nichts. Das Buch
       entscheidet ohnehin nicht mit einer Zahl, sondern mit einer
       Beschreibung — die steht hier direkt. */
    const unter = hand.filter((c) => c[1] === "U").length;
    const guteUnter = unter >= 3 || (unter >= 2 && hand.indexOf("EU") >= 0);
    for (const s of SUITS) {
      const g = { type: "farbwenz", suit: s };
      if (countTrumps(hand, g) < 6) continue;
      const sauen = hand.filter((c) => c[1] === "A" && !isTrump(c, g)).length;
      if (guteUnter && sauen <= 1) { best = { v: best.v, bid: g }; break; }
    }
  }
  if (best) return toutMoeglich(hand, best.bid) ? { ...best.bid, tout: true } : best.bid;

  let bs = null;
  for (const s of sauspielOptions(hand)) {
    const v = sauspielStrength(hand, s);
    if (!bs || v > bs.v) bs = { v, s };
  }
  const thr = ANSAGE.sauspiel[level] !== undefined ? ANSAGE.sauspiel[level] : ANSAGE.sauspiel[1];
  if (bs && bs.v >= thr) return { type: "sauspiel", suit: bs.s };
  return null;
}

const bidRank = (b) => (!b ? 0 : b.tout ? 3 : b.type === "sauspiel" ? 1 : 2);

/* ---------------- Spielweise ---------------- */

function heuristicPick(st, p, rng) {
  const g = st.game;
  const legal = legalCards(st, p);
  if (legal.length === 1) return legal[0];
  const r = rng || Math.random;
  const lowest = (cs) => cs.slice().sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0];
  const fattest = (cs) => cs.slice().sort((a, b) => points(b) - points(a) || power(b, g) - power(a, g))[0];

  if (st.trick.length === 0) {
    const trumps = legal.filter((c) => isTrump(c, g));
    if (knowsOwnSide(st, p) && countTrumps(st.hands[p], g) >= 4 && trumps.length) {
      return trumps.slice().sort((a, b) => power(b, g) - power(a, g))[0];
    }
    const aces = legal.filter((c) => c[1] === "A" && !isTrump(c, g));
    if (aces.length) return aces[Math.floor(r() * aces.length)];
    const plain = legal.filter((c) => !isTrump(c, g));
    if (plain.length) return lowest(plain);
    return lowest(legal);
  }

  const cur = trickWinner(st.trick, g);
  const pot = st.trick.reduce((a, x) => a + points(x.card), 0);
  const last = st.trick.length === 3;
  const partnerAhead = cur !== p && relation(st, p, cur) === 1;
  const wins = legal.filter((c) => trickWinner(st.trick.concat([{ p, card: c }]), g) === p);

  if (partnerAhead) {
    const curCard = st.trick.filter((x) => x.p === cur)[0].card;
    const safe = last || power(curCard, g) > 150;
    if (safe) {
      const plain = legal.filter((c) => !isTrump(c, g));
      return fattest(plain.length ? plain : legal);
    }
    return lowest(legal);
  }
  if (wins.length && (pot >= 4 || last || isTrump(st.trick[0].card, g))) {
    return wins.slice().sort((a, b) => power(a, g) - power(b, g))[0];
  }
  return lowest(legal);
}

/* ============================================================
   DIE GEGENSEITE DES SIGNALS (Kapitel 2.6 und 1.12)

   `voids` sammelt, was jemand nachweislich nicht mehr hat: wer eine
   Farbe nicht bedient, ist sie frei. Das Buch kennt aber eine zweite,
   weichere Quelle — die *Absicht* hinter einer Karte.

   Bringt der gerufene Partner statt Trumpf eine Fehlfarbe, die nicht
   die Ruffarbe ist, dann sagt er damit: „ich bin die dritte Farbe
   frei und würde dort für uns stechen“. Welche das ist, ist eindeutig
   — von den drei Fehlfarben sind die Ruffarbe und die gespielte
   vergeben, es bleibt genau eine übrig.

   Bis hierher hat nur die sendende Seite existiert (`freie-farbe-
   anzeigen` in play-rules.js). Ohne den Empfänger war das Signal
   wertlos: der Partner spielte die Farbe an, und niemand am Tisch
   zog daraus einen Schluss.

   Die Vermutung ist ausdrücklich eine Vermutung — der Partner kann
   die Farbe auch nur mangels Trumpf gebracht haben. Das Buch hält
   das für verschmerzbar: die Farbe käme ohnehin irgendwann auf den
   Tisch. Widerlegt ist sie erst, wenn er die Farbe später selbst
   bedient; das prüft `signalFreieFarbe` mit.
   ============================================================ */

/** Fehlfarben eines Sauspiels — Herz ist Trumpf und zählt nicht mit. */
const fehlfarben = (g) => SUITS.filter((f) => f !== trumpSuitOf(g));

/**
 * Welche Farbe hat `q` durch sein Anspiel als frei angezeigt?
 * Aus der Sicht von `viewer`, sonst null.
 */
function signalFreieFarbe(st, viewer, q) {
  const g = st.game;
  if (!g || g.type !== "sauspiel" || q === viewer) return null;
  if (relation(st, viewer, q) !== 1) return null;   // nur beim sicheren Partner
  if (q === st.declarer && viewer === st.declarer) return null;

  for (const t of st.tricks.slice(0, 3)) {
    const eroeffnung = t.plays[0];
    if (eroeffnung.p !== q) continue;
    const c = eroeffnung.card;
    if (isTrump(c, g) || c[0] === g.suit) continue;  // Trumpf oder Ruffarbe sagt nichts
    const rest = fehlfarben(g).filter((f) => f !== g.suit && f !== c[0]);
    if (rest.length !== 1) continue;
    const frei = rest[0];
    /* Widerlegt, sobald er die Farbe doch bedient hat. */
    const bedient = st.tricks.concat([{ plays: st.trick }]).some((x) =>
      x.plays.some((y) => y.p === q && y.card[0] === frei && !isTrump(y.card, g)));
    if (!bedient) return frei;
  }
  return null;
}

/** Alle Sitze, die `viewer` eine freie Farbe angezeigt haben. */
function gelesenesSignal(st, viewer) {
  for (let q = 0; q < 4; q++) {
    const f = signalFreieFarbe(st, viewer, q);
    if (f) return { sitz: q, farbe: f };
  }
  return null;
}

function unseenFor(st, p) {
  const seen = {};
  st.hands[p].forEach((c) => (seen[c] = 1));
  st.tricks.forEach((t) => t.plays.forEach((x) => (seen[x.card] = 1)));
  st.trick.forEach((x) => (seen[x.card] = 1));
  return makeDeck().filter((c) => !seen[c]);
}

function determinize(st, p, rng) {
  const others = [0, 1, 2, 3].filter((q) => q !== p);
  const need = {};
  others.forEach((q) => (need[q] = st.hands[q].length));
  const pool = unseenFor(st, p);
  const g = st.game;
  const called = calledCard(g);
  const forbid = (q, c) => {
    if (st.voids[q][effSuit(c, g)]) return true;
    if (called && c === called) {
      if (q === st.declarer) return true;
      if (st.partnerKnown && q !== st.partner) return true;
    }
    return false;
  };
  for (let attempt = 0; attempt < 40; attempt++) {
    const deck = pool.slice();
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    const out = {};
    others.forEach((q) => (out[q] = []));
    let ok = true;
    for (const c of deck) {
      const cands = others.filter((q) => out[q].length < need[q] && !forbid(q, c));
      if (!cands.length) { ok = false; break; }
      const q = cands[Math.floor(rng() * cands.length)];
      out[q].push(c);
    }
    if (ok) {
      const hands = st.hands.slice();
      others.forEach((q) => (hands[q] = out[q]));
      return withSampledPartner({ ...st, hands });
    }
  }
  const deck = pool.slice();
  const hands = st.hands.slice();
  others.forEach((q) => (hands[q] = deck.splice(0, need[q])));
  return withSampledPartner({ ...st, hands });
}

/** in einer ausgedachten Welt steht der Partner fest (verdeckt bleibt er trotzdem) */
function withSampledPartner(st) {
  if (st.game.type !== "sauspiel" || st.partner >= 0) return st;
  const sau = calledCard(st.game);
  const holder = st.hands.findIndex((h) => h.indexOf(sau) >= 0);
  return holder >= 0 ? { ...st, partner: holder } : st;
}

function rollout(st, rng) {
  let s = st, guard = 0;
  while (s.phase !== "done" && guard++ < 40) s = playCard(s, s.turn, heuristicPick(s, s.turn, rng));
  return s;
}

function sidePoints(end, p) {
  const side = isDeclarerSide(end, p);
  return [0, 1, 2, 3].filter((q) => isDeclarerSide(end, q) === side).reduce((a, q) => a + end.won[q], 0);
}

function mcEvaluate(st, p, samples, rng) {
  const legal = legalCards(st, p);
  const acc = legal.map((c) => ({ card: c, sum: 0, n: 0 }));
  for (let i = 0; i < samples; i++) {
    const d = determinize(st, p, rng);
    for (const a of acc) {
      const end = rollout(playCard(d, p, a.card), rng);
      a.sum += sidePoints(end, p);
      a.n++;
    }
  }
  return acc.map((a) => ({ card: a.card, value: a.n ? a.sum / a.n : 0 })).sort((x, y) => y.value - x.value);
}

function botPlay(st, p, level, rng) {
  const legal = legalCards(st, p);
  if (legal.length === 1) return legal[0];
  const r = rng || Math.random;
  if (level === 0) return r() < 0.3 ? heuristicPick(st, p, r) : legal[Math.floor(r() * legal.length)];
  if (level === 1) return heuristicPick(st, p, r);
  const left = st.hands[p].length;
  const samples = left >= 7 ? 22 : left >= 5 ? 32 : 44;
  return mcEvaluate(st, p, samples, r)[0].card;
}

/* ---------------- Nachbesprechung ---------------- */

function perfectEvaluate(st, p, samples, rng) {
  return legalCards(st, p)
    .map((c) => {
      let sum = 0;
      for (let i = 0; i < samples; i++) sum += sidePoints(rollout(playCard(st, p, c), rng), p);
      return { card: c, value: sum / samples };
    })
    .sort((a, b) => b.value - a.value);
}

function tacticalNotes(st, p, card) {
  const g = st.game, notes = [];
  const legal = legalCards(st, p);
  const pot = st.trick.reduce((a, x) => a + points(x.card), 0);
  const called = calledCard(g);

  if (st.trick.length === 0) {
    if (called && p === st.declarer && card[0] === g.suit && !isTrump(card, g) && st.tricks.length === 0 && countTrumps(st.hands[p], g) >= 5) {
      notes.push(["ruf-zu-frueh", "Mit fünf oder mehr Trümpfen zieht man erst Trumpf und sucht die Sau später — sonst schenkst du den Gegnern Zeit."]);
    }
    if (isTrump(card, g) && !knowsOwnSide(st, p) && countTrumps(st.hands[p], g) <= 2) {
      notes.push(["trumpf-dem-spieler", "Trumpf anspielen arbeitet für die Spielerpartei. Als Gegenspieler mit wenig Trumpf spielst du besser eine Farbe an."]);
    }
    if (!isTrump(card, g) && points(card) === 11 && st.hands[p].filter((c) => c[0] === card[0] && !isTrump(c, g)).length === 1 && !knowsOwnSide(st, p)) {
      notes.push(["blanke-sau", "Eine blanke Sau anspielen heißt: der nächste Stich in dieser Farbe gehört dem Gegner. Nur machen, wenn du die Augen jetzt brauchst."]);
    }
    const sig = gelesenesSignal(st, p);
    if (sig && card[0] !== sig.farbe && st.hands[p].some((c) => c[0] === sig.farbe && !isTrump(c, g))) {
      notes.push(["freie-farbe-des-partners-lesen",
        "Dein Partner hat mit seinem Anspiel angezeigt, dass er " + SUITNAME[sig.farbe] +
        " frei ist und dort für euch stechen würde. Dieses Angebot nimmt man an."]);
    }
  } else {
    const cur = trickWinner(st.trick, g);
    const partnerAhead = cur !== p && relation(st, p, cur) === 1;
    const iWin = trickWinner(st.trick.concat([{ p, card }]), g) === p;
    const wins = legal.filter((c) => trickWinner(st.trick.concat([{ p, card: c }]), g) === p);
    const last = st.trick.length === 3;

    if (!partnerAhead && !iWin && points(card) >= 10) {
      notes.push(["schmieren-an-gegner", "Hier gehen " + points(card) + " Augen an die Gegenpartei. Ohne Partner im Stich wirft man die kleine Karte ab."]);
    }
    if (partnerAhead && points(card) <= 2 && legal.some((c) => points(c) >= 10) && (last || pot >= 4)) {
      notes.push(["schmieren-verpasst", "Der Stich ist dem Partner sicher — da gehören die Augen hinein. Zehner und Sau sind zum Schmieren da, nicht zum Aufheben."]);
    }
    if (iWin && wins.length > 1) {
      const cheapest = wins.slice().sort((a, b) => power(a, g) - power(b, g))[0];
      if (card !== cheapest) notes.push(["zu-hoch-gestochen", "Der Stich wäre auch mit " + cardName(cheapest) + " deiner geblieben. Die hohen Trümpfe hebt man auf, solange die kleinen reichen."]);
    }
    if (isTrump(card, g) && !isTrump(st.trick[0].card, g) && pot <= 2 && !last) {
      notes.push(["unnoetig-getrumpft", "Für einen Stich fast ohne Augen lohnt kein Trumpf — und du gibst deine Trumpflänge auf."]);
    }
  }
  return notes;
}

function reviewDecisions(decisions, rng) {
  const out = [];
  for (const d of decisions) {
    const legal = legalCards(d.state, d.p);
    if (legal.length <= 1) continue;
    const ev = perfectEvaluate(d.state, d.p, 10, rng);
    const chosen = ev.filter((e) => e.card === d.card)[0];
    out.push({
      trick: d.state.tricks.length + 1,
      card: d.card,
      best: ev[0].card,
      loss: ev[0].value - (chosen ? chosen.value : 0),
      notes: tacticalNotes(d.state, d.p, d.card),
      alternatives: ev.slice(0, 3),
      state: d.state,
      p: d.p,
    });
  }
  return out;
}

export {
  ANSAGE, SUITS, SUITNAME, RANKS, RANKNAME, PTS, RANKVAL, makeDeck, shuffled, isTrump, effSuit, power, trumpOrder, trumpSuitOf, sortHand, trickWinner, calledCard, legalCards, newDeal, playCard, settle, laufende, botBid, bidRank, heuristicPick, botPlay, mcEvaluate, perfectEvaluate, reviewDecisions, tacticalNotes, sauspielOptions, sauspielStrength, wenzStrength, soloStrength, farbwenzStrength, signalFreieFarbe, gelesenesSignal, darfKontra, gibKontra, kontraName, toutMoeglich, isDeclarerSide, sameSide, ownSide, knownSameSide, relation, knowsOwnSide, cardName, points, countTrumps, determinize, sidePoints, topRun,
};
