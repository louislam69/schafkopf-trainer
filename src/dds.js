/* ============================================================
   DOPPELKOPF-LÖSER (double dummy) — die exakte Lösung eines
   Blattes, dessen vier Hände offen liegen.

   Warum das nötig ist: `mcEvaluate` verteilt die unbekannten Karten
   zwar sauber (Farbzwang und Rufsau werden beachtet), spielt die
   Stellung danach aber mit `heuristicPick` zu Ende — also mit genau
   der Spielweise, die es eigentlich verbessern soll. Was die
   Heuristik nicht sieht, sieht auch keine noch so große Stichprobe
   davon. Ein Löser dagegen rechnet die Fortsetzung aus.

   Aus dem Löser wird in `pimc.js` ein Spieler: viele Verteilungen
   auswürfeln, jede exakt lösen, die Ergebnisse mitteln. Das ist das
   Verfahren, mit dem auch die starken Skat-Programme spielen.

   Umgesetzt ist eine Alpha-Beta-Suche über Punkte:

   - Hände sind 32-Bit-Masken, eine Karte ein Bit. Kein Kopieren,
     kein Allozieren; gespielt und zurückgenommen wird auf denselben
     Feldern.
   - Der Wert eines Knotens sind die Augen, die die SPIELERPARTEI von
     hier an noch macht. Wer am Zug ist, maximiert oder minimiert das.
   - Gleichwertige Karten werden zusammengefasst: liegen zwischen
     zwei Karten derselben Farbe keine weiteren mehr im Spiel und
     zählen beide gleich viele Augen, ist es einerlei, welche ich
     lege. Das schrumpft die Verzweigung erheblich — die drei
     Nullkarten einer Farbe werden zu einer, die vier Ober oft auch.
   - Eine Transpositionstabelle merkt sich gelöste Stellungen. Sie
     wird nur zu Stichbeginn befragt: dort ist die Stellung durch die
     vier Handmasken vollständig beschrieben.
   ============================================================ */

import { makeDeck, isTrump, effSuit, power, points, calledCard, trumpSuitOf } from "./engine.js";

const ALLE = makeDeck();
const NR = {};
ALLE.forEach((c, i) => (NR[c] = i));

const TRUMPF = 4;   // Farbcode für Trumpf; 0..3 sind E G H S
const FARBNR = { E: 0, G: 1, H: 2, S: 3, T: TRUMPF };

/**
 * Alles, was nur von der Spielart abhängt, einmal ausrechnen.
 * Für eine Partie wird das genau einmal gebraucht, für jede
 * Verteilung derselben Partie wieder verwendet.
 */
export function tabellen(g) {
  const EFF = new Int8Array(32);
  const PW = new Int16Array(32);
  const PT = new Int8Array(32);
  const FARBE = new Int32Array(5);
  for (let i = 0; i < 32; i++) {
    const c = ALLE[i];
    EFF[i] = FARBNR[effSuit(c, g)];
    PW[i] = power(c, g);
    PT[i] = points(c);
    FARBE[EFF[i]] |= 1 << i;
  }
  /* Je Farbe die Kartennummern von hoch nach tief — die Reihenfolge,
     in der die Gleichwertigkeit geprüft wird. */
  const REIHE = [];
  for (let f = 0; f < 5; f++) {
    const l = [];
    for (let i = 0; i < 32; i++) if (EFF[i] === f) l.push(i);
    l.sort((a, b) => PW[b] - PW[a]);
    REIHE.push(Int8Array.from(l));
  }
  const ruf = calledCard(g);
  const rufFarbe = g.type === "sauspiel" ? FARBNR[g.suit] : -1;
  return {
    g, EFF, PW, PT, FARBE, REIHE,
    SAU: ruf ? NR[ruf] : -1,
    RUFFARBE: rufFarbe,
    /* Die Fehlkarten der Ruffarbe — die Ober und Unter darin sind
       Trumpf und gehören nicht dazu. */
    RUFMASKE: rufFarbe >= 0 ? FARBE[rufFarbe] : 0,
    trumpf: trumpSuitOf(g),
  };
}

const zaehle = (m) => {
  let n = 0;
  while (m) { m &= m - 1; n++; }
  return n;
};

/**
 * Ein Löser für eine feste Verteilung.
 *
 * `hands` sind vier Kartenlisten, `trick` der angefangene Stich als
 * [{p, card}], `turn` wer am Zug ist. `spielerseite` sagt für jeden
 * Sitz, ob er zur Spielerpartei gehört — in einer ausgewürfelten
 * Verteilung steht das fest, auch wenn es am Tisch niemand weiß.
 */
export function loeser(t, hands, trick, turn, sauFree, spielerseite) {
  const { EFF, PW, PT, FARBE, REIHE, SAU, RUFFARBE, RUFMASKE } = t;

  const h = new Int32Array(4);
  for (let p = 0; p < 4; p++) for (const c of hands[p]) h[p] |= 1 << NR[c];

  /* Der laufende Stich als flache Felder statt als Objektliste. */
  const tc = new Int8Array(4), tp = new Int8Array(4);
  let tlen = 0;
  for (const x of trick) { tp[tlen] = x.p; tc[tlen] = NR[x.card]; tlen++; }

  let frei = !!sauFree;
  let amZug = turn;
  let offen = 0;
  for (let p = 0; p < 4; p++) offen += zaehle(h[p]);

  /* Die Augen, die ueberhaupt noch zu holen sind — auch die, die im
     laufenden Stich schon liegen. Damit lassen sich ganze Aeste
     abschneiden, ohne sie zu betreten: mehr als das kann die
     Spielerpartei nicht mehr bekommen, weniger als nichts nicht. */
  let restAugen = 0;
  for (let p = 0; p < 4; p++) {
    let m = h[p];
    while (m) { const i = 31 - Math.clz32(m & -m); restAugen += PT[i]; m &= m - 1; }
  }
  for (let i = 0; i < tlen; i++) restAugen += PT[tc[i]];

  const seite = [0, 0, 0, 0];
  for (let p = 0; p < 4; p++) seite[p] = spielerseite[p] ? 1 : 0;

  const tt = new Map();
  let knoten = 0;
  /* Killerzuege: was auf gleicher Tiefe schon einmal einen Schnitt
     erzwungen hat, wird zuerst probiert. Kostet zwei Zahlen je Tiefe
     und spart einen erheblichen Teil des Baumes. */
  const killer1 = new Int8Array(40).fill(-1);
  const killer2 = new Int8Array(40).fill(-1);

  /** Welche Karten darf `p` legen? Als Maske. */
  function erlaubt(p) {
    const hand = h[p];
    const hatSau = SAU >= 0 && !frei && (hand & (1 << SAU)) !== 0;
    if (tlen === 0) {
      if (hatSau) {
        const ruf = hand & RUFMASKE;
        /* Mit weniger als vier Karten der Ruffarbe darf ich sie nur
           spielen, indem ich die Sau selbst lege. Mit vier oder mehr
           läuft man davon und darf jede bringen. */
        if (zaehle(ruf) < 4) return hand & ~(ruf & ~(1 << SAU));
      }
      return hand;
    }
    const lead = EFF[tc[0]];
    const bedient = hand & FARBE[lead];
    if (bedient) {
      if (hatSau && lead === RUFFARBE) return 1 << SAU;
      return bedient;
    }
    if (hatSau) {
      const rest = hand & ~(1 << SAU);
      if (rest) return rest;   // die Rufsau wird nicht abgeworfen
    }
    return hand;
  }

  /**
   * Aus der erlaubten Maske die Züge machen, die sich wirklich
   * unterscheiden. Zwei Karten sind austauschbar, wenn sie in
   * derselben Farbe unmittelbar aufeinander folgen — es liegt keine
   * lebende Karte dazwischen — und gleich viele Augen zählen.
   */
  function zuege(maske, aus) {
    const lebend = h[0] | h[1] | h[2] | h[3];
    let n = 0;
    for (let f = 0; f < 5; f++) {
      if (!(maske & FARBE[f])) continue;
      const reihe = REIHE[f];
      let vorher = -1;
      for (let k = 0; k < reihe.length; k++) {
        const i = reihe[k];
        const bit = 1 << i;
        if (!(lebend & bit)) continue;          // längst gespielt
        if (maske & bit) {
          if (vorher >= 0 && PT[vorher] === PT[i]) { vorher = i; continue; }
          aus[n++] = i;
          vorher = i;
        } else vorher = -1;                      // Kette unterbrochen
      }
    }
    return n;
  }

  function stichSieger() {
    const lead = EFF[tc[0]];
    let b = 0;
    for (let i = 1; i < 4; i++) {
      const a = tc[i], v = tc[b];
      const aT = EFF[a] === TRUMPF, vT = EFF[v] === TRUMPF;
      if (aT && !vT) b = i;
      else if (aT === vT && EFF[a] === EFF[v] && EFF[a] === (vT ? TRUMPF : lead) && PW[a] > PW[v]) b = i;
    }
    return tp[b];
  }

  /**
   * Augen, die die Spielerpartei von hier an noch macht, bei
   * beiderseits bestem Spiel. Fail-soft Alpha-Beta.
   */
  function ab(alpha, beta, tiefe) {
    if (offen === 0) return 0;
    /* Die beiden billigen Schranken zuerst: mehr als `restAugen` ist
       nicht zu holen, weniger als 0 nicht zu verhindern. */
    if (restAugen <= alpha) return restAugen;
    if (beta <= 0) return 0;
    knoten++;

    let schluessel = null, besterBekannt = -1;
    if (tlen === 0) {
      /* Alle vier Masken gehoeren in den Schluessel. h[3] ist NICHT
         aus den anderen dreien ableitbar: dazu muesste man wissen,
         welche Karten schon gespielt sind, und genau darin
         unterscheiden sich die Stellungen, die sonst kollidieren. */
      schluessel = h[0] + "|" + h[1] + "|" + h[2] + "|" + h[3] + "|" + amZug + (frei ? "f" : "");
      const e = tt.get(schluessel);
      if (e !== undefined) {
        if (e.art === 0) return e.wert;
        if (e.art === 1 && e.wert >= beta) return e.wert;    // untere Schranke
        if (e.art === 2 && e.wert <= alpha) return e.wert;   // obere Schranke
        besterBekannt = e.zug;
      }
    }

    const p = amZug;
    const max = seite[p] === 1;
    const alpha0 = alpha, beta0 = beta;
    const kandidaten = new Int8Array(8);
    const n = zuege(erlaubt(p), kandidaten);

    /* Zugsortierung: wer Augen will, probiert erst die teuren und
       hohen Karten; wer sie verhindern will, erst die billigen. Gute
       Reihenfolge ist bei Alpha-Beta der halbe Gewinn. */
    const liste = Array.prototype.slice.call(kandidaten, 0, n);
    liste.sort((a, b) => (max ? (PT[b] - PT[a] || PW[b] - PW[a]) : (PT[a] - PT[b] || PW[a] - PW[b])));
    /* Nach vorne, was sich schon bewaehrt hat: erst der in dieser
       Stellung bekannte beste Zug, dann die beiden Killer. */
    const vorziehen = (c) => {
      const i = liste.indexOf(c);
      if (i > 0) { liste.splice(i, 1); liste.unshift(c); }
    };
    if (killer2[tiefe] >= 0) vorziehen(killer2[tiefe]);
    if (killer1[tiefe] >= 0) vorziehen(killer1[tiefe]);
    if (besterBekannt >= 0) vorziehen(besterBekannt);

    let best = max ? -1 : 1000, besterZug = -1;
    for (let k = 0; k < n; k++) {
      const c = liste[k];
      const bit = 1 << c;

      /* --- ziehen --- */
      const freiVorher = frei;
      if (SAU >= 0 && !frei) {
        if (c === SAU) frei = true;
        else if (tlen === 0 && (h[p] & (1 << SAU)) && (bit & RUFMASKE)) frei = true;  // davongelaufen
      }
      h[p] &= ~bit;
      tc[tlen] = c; tp[tlen] = p; tlen++;
      offen--;

      let wert;
      if (tlen === 4) {
        const w = stichSieger();
        let pts = 0;
        for (let i = 0; i < 4; i++) pts += PT[tc[i]];
        const gewinn = seite[w] === 1 ? pts : 0;
        const merkeZug = amZug;
        /* Der naechste Stich schreibt in dieselben Felder tc/tp. Ohne
           diese Sicherung stuenden nach der Rueckkehr die Karten des
           Kindstichs darin, und die naechste Zugalternative baute auf
           einem Stich auf, den es nie gab. */
        const s0 = tc[0], s1 = tc[1], s2 = tc[2], s3 = tc[3];
        const q0 = tp[0], q1 = tp[1], q2 = tp[2], q3 = tp[3];
        tlen = 0; amZug = w; restAugen -= pts;
        wert = gewinn + ab(alpha - gewinn, beta - gewinn, tiefe + 1);
        restAugen += pts; amZug = merkeZug; tlen = 4;
        tc[0] = s0; tc[1] = s1; tc[2] = s2; tc[3] = s3;
        tp[0] = q0; tp[1] = q1; tp[2] = q2; tp[3] = q3;
      } else {
        const merkeZug = amZug;
        amZug = (p + 1) % 4;
        wert = ab(alpha, beta, tiefe + 1);
        amZug = merkeZug;
      }

      /* --- zurücknehmen --- */
      offen++;
      tlen--;
      h[p] |= bit;
      frei = freiVorher;

      if (max) { if (wert > best) { best = wert; besterZug = c; } if (best > alpha) alpha = best; }
      else { if (wert < best) { best = wert; besterZug = c; } if (best < beta) beta = best; }
      if (alpha >= beta) {
        if (killer1[tiefe] !== c) { killer2[tiefe] = killer1[tiefe]; killer1[tiefe] = c; }
        break;
      }
    }

    if (schluessel !== null) {
      const art = best <= alpha0 ? 2 : best >= beta0 ? 1 : 0;
      tt.set(schluessel, { wert: best, art, zug: besterZug });
    }
    return best;
  }

  return {
    /**
     * Erreicht die Spielerpartei von hier an noch `k` Augen?
     *
     * Bewusst eine Ja/Nein-Frage. Genau das fragt auch das Spiel: bei
     * 61 Augen ist gewonnen, der genaue Wert daneben zaehlt nur fuer
     * Schneider und Schwarz. Und ein Nullfenster schneidet die Suche
     * um Groessenordnungen staerker als die Jagd nach dem exakten
     * Wert — der Loeser rechnet dieselbe Stellung damit in
     * Millisekunden statt in Sekunden.
     */
    schafft(k) { return ab(k - 1, k, 0) >= k; },

    /** Der genaue Augenwert. Teuer; gedacht fuer die Pruefungen. */
    genau() { return ab(-1, 1000, 0); },

    /**
     * Fuer jede erlaubte Karte: bleibt die Schwelle `k` danach noch
     * erreichbar? Aus Sicht dessen, der am Zug ist — 1 heisst gut
     * fuer ihn, gleich ob er Spieler oder Gegenspieler ist.
     */
    zugwerte(k) {
      const p = amZug;
      const meineSeite = seite[p] === 1;
      const kandidaten = new Int8Array(8);
      const maske = erlaubt(p);
      const n = zuege(maske, kandidaten);
      const out = [];
      for (let j = 0; j < n; j++) {
        const c = kandidaten[j];
        const bit = 1 << c;
        const freiVorher = frei;
        if (SAU >= 0 && !frei) {
          if (c === SAU) frei = true;
          else if (tlen === 0 && (h[p] & (1 << SAU)) && (bit & RUFMASKE)) frei = true;
        }
        h[p] &= ~bit;
        tc[tlen] = c; tp[tlen] = p; tlen++;
        offen--;

        let erreicht;
        if (tlen === 4) {
          const w = stichSieger();
          let pts = 0;
          for (let i = 0; i < 4; i++) pts += PT[tc[i]];
          const gewinn = seite[w] === 1 ? pts : 0;
          const s0 = tc[0], s1 = tc[1], s2 = tc[2], s3 = tc[3];
          const q0 = tp[0], q1 = tp[1], q2 = tp[2], q3 = tp[3];
          tlen = 0; amZug = w; restAugen -= pts;
          const rest = k - gewinn;
          erreicht = gewinn + ab(rest - 1, rest, 1) >= k;
          restAugen += pts; amZug = p; tlen = 4;
          tc[0] = s0; tc[1] = s1; tc[2] = s2; tc[3] = s3;
          tp[0] = q0; tp[1] = q1; tp[2] = q2; tp[3] = q3;
        } else {
          amZug = (p + 1) % 4;
          erreicht = ab(k - 1, k, 1) >= k;
          amZug = p;
        }

        offen++;
        tlen--;
        h[p] |= bit;
        frei = freiVorher;

        out.push({ card: ALLE[c], value: (erreicht === meineSeite) ? 1 : 0 });
      }

      /* Die als gleichwertig weggelassenen Karten nachtragen, damit
         der Aufrufer zu jeder erlaubten Karte einen Wert bekommt. Der
         Vertreter ist die in der Staerke naechstliegende Karte
         gleicher Farbe und gleicher Augenzahl. */
      const drin = new Set(out.map((x) => x.card));
      for (let i = 0; i < 32; i++) {
        if (!(maske & (1 << i)) || drin.has(ALLE[i])) continue;
        let beste = null, abstand = Infinity;
        for (const x of out) {
          const j = NR[x.card];
          if (EFF[j] !== EFF[i] || PT[j] !== PT[i]) continue;
          const d = Math.abs(PW[j] - PW[i]);
          if (d < abstand) { abstand = d; beste = x; }
        }
        if (beste) out.push({ card: ALLE[i], value: beste.value });
      }
      return out.sort((a, b) => b.value - a.value);
    },
    knoten: () => knoten,
  };
}
