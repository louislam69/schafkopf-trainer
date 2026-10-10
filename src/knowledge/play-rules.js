/* ============================================================
   SPIELREGELN AUS DEM BUCH, DIE DIE BOTS ANWENDEN

   Jede Regel prüft eine Stellung und schlägt eine Karte vor.
   buchZug() gibt die erste passende zurück — samt id, damit die
   Auswertung später sagen kann, nach welcher Regel gespielt wurde.

   Bewusst nur Regeln, die aus der eigenen Sicht entscheidbar sind:
   was ein Bot nicht wissen kann, darf er auch nicht verwenden.

   `freie-farbe-anzeigen` und `freie-farbe-des-partners-lesen` sind die
   beiden Hälften desselben Signals — eine sendet, die andere liest.
   Solange nur die sendende Seite gebaut war, sprach der eine Bot in
   ein leeres Zimmer.
   ============================================================ */

import {
  isTrump, calledCard, legalCards, countTrumps, power, points, knowsOwnSide,
  makeDeck, trickWinner, gelesenesSignal, trumpSuitOf, relation, effSuit,
} from "../engine.js";

const HOHE_OBER = ["EO", "GO", "HO"];

/** Bedient die Karte die angespielte Farbe? */
const effektivBedient = (st, c) => {
  const lead = st.trick[0].card;
  const t = isTrump(lead, st.game);
  return t ? isTrump(c, st.game) : !isTrump(c, st.game) && c[0] === lead[0];
};

const haeltSau = (st, p) => {
  const c = calledCard(st.game);
  return !!c && st.hands[p].indexOf(c) >= 0;
};
const rufkarten = (st, p) =>
  st.hands[p].filter((c) => c[0] === st.game.suit && !isTrump(c, st.game));

/**
 * Was `viewer` über `other` weiß — so, wie das Buch es liest.
 *
 * Kapitel 2.1: „Spieler spielt Trumpf, Nichtspieler spielt Farbe." Wer
 * im Sauspiel ohne Ansage als Erstes Trumpf anspielt, gibt sich damit als
 * der Gerufene zu erkennen. Die Stellungen zu 3.8, 3.9 und 3.14 bauen
 * genau darauf: erster Stich, die Rufsau liegt noch verdeckt, und das
 * Buch folgert aus dem angespielten Trumpf, wer zu wem gehört („Spieler 1
 * scheint der Partner des Spielmachers zu sein"). `relation` kennt nur
 * gesichertes Wissen und ließ die Regeln dazu auf ihren eigenen
 * Stellungen schweigen.
 *
 * Bewusst nur hier und nicht in `relation`: Engine, Stichprobe und
 * Heuristik rechnen weiter mit dem, was sicher ist. Gezählt wird das
 * erste Anspiel jedes Nichtspielers, und das Zeichen gilt nur, wenn genau
 * einer so eröffnet hat. Nach einer Spritze gilt es nicht — dann spielt
 * der Gerufene Farbe und der Spritzengeber Trumpf (2.10, 1.13).
 */
function buchSicht(st, viewer, other) {
  const g = st.game;
  if (g.type !== "sauspiel" || st.partnerKnown || st.kontra || knowsOwnSide(st, viewer)) {
    return relation(st, viewer, other);
  }
  const erste = {};
  st.tricks.map((t) => t.plays[0]).concat(st.trick.slice(0, 1)).forEach((x) => {
    if (!(x.p in erste)) erste[x.p] = x.card;
  });
  const zeiger = Object.keys(erste).map(Number)
    .filter((q) => q !== st.declarer && q !== viewer && isTrump(erste[q], g));
  if (zeiger.length !== 1) return relation(st, viewer, other);
  return relation({ ...st, partner: zeiger[0], partnerKnown: true }, viewer, other);
}

/** Karten, die weder gespielt sind noch auf meiner Hand liegen */
function unbekannt(st, p) {
  const weg = {};
  st.hands[p].forEach((c) => (weg[c] = 1));
  st.tricks.forEach((t) => t.plays.forEach((x) => (weg[x.card] = 1)));
  st.trick.forEach((x) => (weg[x.card] = 1));
  return makeDeck().filter((c) => !weg[c]);
}

/** Bin ich Gegenspieler eines Alleinspiels (Kapitel 5)? Der Tout hat
    eigene Regeln — dort zählen Stiche, nicht Augen. */
const gegenAllein = (st, p) => st.game.type !== "sauspiel" && !st.game.tout && p !== st.declarer;

export const SPIELREGELN = [
  {
    id: "ohne-trumpf-rufsau-spielen",
    seite: 53,
    kurz: "Als gerufener Partner ohne Trumpf die Rufsau ausspielen.",
    zug(st, p, legal) {
      if (st.trick.length || !haeltSau(st, p)) return null;
      if (countTrumps(st.hands[p], st.game) > 0) return null;
      if (rufkarten(st, p).length >= 4) return null; // dann ginge Davonlaufen
      const sau = calledCard(st.game);
      return legal.indexOf(sau) >= 0 ? sau : null;
    },
  },
  {
    id: "spielplan-des-spielmachers",
    seite: 47,
    kurz: "Hat der Spielmacher Farbe angespielt, bringe ich als Partner ebenfalls Farbe.",
    zug(st, p, legal) {
      if (st.trick.length || !st.tricks.length) return null;
      /* Der Gerufene — ob er die Rufsau noch hält oder schon gespielt
         hat. Bis hierher stand hier nur `haeltSau`, und damit griff die
         Regel auf ihrer eigenen Stellung (S. 46) nie: dort hat der
         Gerufene den ersten Stich gerade mit der Sau gemacht und kommt
         heraus. Der Geltungsbereich war der umgekehrte des Kapitels. */
      if (!haeltSau(st, p) && !(st.partnerKnown && st.partner === p)) return null;
      /* Kapitel 2.5: Bringt der rufende Spieler selbst eine Farbe,
         deutet er Trumpfschwäche an und beherrscht dafür die anderen
         Farben. Ich folge seiner Spielweise statt ihm Trümpfe
         wegzuziehen, die er noch braucht. */
      const vom = st.tricks.some((t) =>
        t.plays[0].p === st.declarer && !isTrump(t.plays[0].card, st.game));
      if (!vom) return null;
      /* „mit einer WEITEREN Sau zuerst diese; ohne Sau eine KLEINE
         Farbkarte" — die Rufsau ist beides nicht. Bis hierher zählte
         sie mit: suchte der Spielmacher nicht in der Ruffarbe, sondern
         in einer anderen, spielte diese Regel die Rufsau aus — ein
         Gerufener, der sich mit Trumpf auf der Hand selbst aufdeckt,
         gestützt auf ein Kapitel, das davon nichts sagt. */
      const rufsau = calledCard(st.game);
      const eigeneSau = legal.filter((c) => !isTrump(c, st.game) && c[1] === "A" && c !== rufsau);
      if (eigeneSau.length) return eigeneSau[0];
      const farben = legal.filter((c) => !isTrump(c, st.game) && c !== rufsau);
      if (!farben.length) return null;
      /* „ohne Sau eine kleine Farbkarte, und zwar die kurze Farbe,
         wenn mein Partner direkt hinter mir sitzt, sonst eher die
         lange" — „mein Partner" ist aus Sicht des Gerufenen der
         Spielmacher. Sitzt er hinter mir, sticht er die kurze Farbe
         selbst; läuft die lange, kommt er dagegen oft nicht dazu. */
      const laenge = (f) => st.hands[p].filter((c) => !isTrump(c, st.game) && c[0] === f).length;
      const kurz = (p + 1) % 4 === st.declarer;
      const ziel = farben
        .map((c) => c[0])
        .sort((a, b) => (kurz ? laenge(a) - laenge(b) : laenge(b) - laenge(a)))[0];
      return farben
        .filter((c) => c[0] === ziel)
        .sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
    },
  },
  {
    id: "davonlaufen-abwaegen",
    seite: 41,
    kurz: "Mit der Rufsau, der Zehn und zwei weiteren Karten der Ruffarbe mit dem König davonlaufen.",
    /* Steht über den Trumpfregeln des Gerufenen, weil es die Frage vor
       ihnen beantwortet: OB Trumpf. Darunter wählt 2.7, WELCHER — und
       spielte auf der Stellung zu 2.2 (S. 40) den Herz-König, wo das
       Buch mit dem Eichel-König davonläuft. Eine bloße Schranke „mit
       vier Karten der Ruffarbe schweigt 2.7" reichte nicht: auf der
       Stellung zu 2.9 (S. 54) hält der Gerufene ebenfalls vier und soll
       trotzdem Trumpf spielen. Das Buch entscheidet an beiden Stellen
       nach einem Merkmal, nicht nach der Länge. */
    zug(st, p, legal) {
      if (st.trick.length || !haeltSau(st, p) || st.sauFree || st.kontra) return null;   // nach einer Spritze gilt 2.10
      const ruf = rufkarten(st, p);
      /* Kapitel 2.2: davonlaufen darf ich mit der Sau und drei weiteren;
         mit fünf gilt 2.3 — dann gibt es niemanden, der sucht. */
      if (ruf.length !== 4) return null;
      /* „Hier ist es richtig, weil ich die Zehn der Ruffarbe selbst
         habe." Ohne sie „überlege ich dreimal" — das ist keine
         Bedingung, sondern eine Abwägung, und die Regel schweigt. */
      if (ruf.indexOf(st.game.suit + "X") < 0) return null;
      /* Kapitel 2.9: hat der Spielmacher eine Karte der Ruffarbe
         abgeworfen, statt auf eine freie Farbe einzustechen, will er die
         Farbe loswerden — Davonlaufen gäbe ihm genau die Gelegenheit. */
      const abgeworfen = st.tricks.map((t) => t.plays).concat([st.trick]).some((plays) =>
        plays.length && effSuit(plays[0].card, st.game) !== st.game.suit
        && plays.some((x) => x.p === st.declarer && !isTrump(x.card, st.game) && x.card[0] === st.game.suit));
      if (abgeworfen) return null;
      /* „Nicht die Sieben, sondern den König": die höchste Karte unter
         der Zehn, damit die Gegenpartei einen Trumpf einsetzen muss. */
      const karte = ruf.filter((c) => c[1] !== "A" && c[1] !== "X")
        .sort((a, b) => power(b, st.game) - power(a, st.game))[0];
      return karte && legal.indexOf(karte) >= 0 ? karte : null;
    },
  },
  {
    id: "nicht-immer-hoechster-trumpf",
    seite: 51,
    kurz: "Als Partner ohne großen Ober den kleinen Trumpf anspielen.",
    /* Steht bewusst ÜBER `trumpf-spielen-als-partner`. Kapitel 2.1
       sagt selbst „bis auf wenige Ausnahmen den höchsten", und 2.7 ist
       genau diese Ausnahme — die allgemeine Regel darüber verdeckte
       also ihren eigenen Sonderfall. Auf der Buchstellung b2-2.7-s50
       antwortete buchZug() deshalb mit dem Schellen-Ober, also mit
       genau der Karte, gegen die das Kapitel argumentiert. */
    zug(st, p, legal) {
      if (st.trick.length || !haeltSau(st, p) || st.kontra) return null;   // nach einer Spritze gilt 2.10
      /* Kapitel 2.7 gilt nur, wenn der Spielmacher in Mittelhand sitzt.
         Bis hierher fragte die Regel ein Feld `st.spielmacherSitz` ab,
         das nirgends gesetzt wurde — die Bedingung lief also immer ins
         Leere und die Regel griff auf jedem Platz. Ich spiele gerade
         an, bin also Vorhand: Mittelhand sind die Plätze 1 und 2 hinter
         mir. */
      const abstand = (st.declarer - p + 4) % 4;
      if (abstand !== 1 && abstand !== 2) return null;
      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (truempfe.length < 2) return null;
      if (truempfe.some((c) => HOHE_OBER.indexOf(c) >= 0)) return null; // dann ruhig hoch
      return truempfe.sort((a, b) => power(a, st.game) - power(b, st.game))[0];
    },
  },
  {
    id: "trumpf-spielen-als-partner",
    seite: 39,
    kurz: "Als gerufener Partner im ersten Ausspiel den höchsten Trumpf bringen.",
    zug(st, p, legal) {
      if (st.trick.length || st.tricks.length || !haeltSau(st, p)) return null;
      if (st.kontra) return null;   // nach einer Spritze gilt 2.10
      /* Kapitel 2.1: „Spieler spielt Trumpf, Nichtspieler spielt
         Farbe.“ Damit gebe ich mich dem Spielmacher zu erkennen, und
         zwar mit dem höchsten — das hilft ihm, meine Stärke
         einzuschätzen. Mit vier Karten der Ruffarbe käme statt dessen
         das Davonlaufen in Frage, das regelt die Regel darunter. */
      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (!truempfe.length || rufkarten(st, p).length >= 4) return null;
      return truempfe.sort((a, b) => power(b, st.game) - power(a, st.game))[0];
    },
  },
  {
    id: "nicht-davonlaufen-bei-fuenf",
    seite: 43,
    kurz: "Mit der Rufsau und fünf Karten der Ruffarbe nicht davonlaufen, sondern Trumpf spielen.",
    zug(st, p, legal) {
      if (st.trick.length || !haeltSau(st, p) || st.kontra) return null;   // nach einer Spritze gilt 2.10
      /* Kapitel 2.3: Halte ich fünf Karten der Ruffarbe und der
         Spielmacher die sechste, liegen alle in unseren Händen — kein
         Gegner kann die Rufsau suchen. Davonlaufen schenkt ihnen dann
         nur einen mächtigen Stich. */
      if (rufkarten(st, p).length < 5) return null;
      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (!truempfe.length) return null;
      return truempfe.sort((a, b) => power(b, st.game) - power(a, st.game))[0];
    },
  },
  {
    id: "nicht-selber-suchen",
    seite: 17,
    kurz: "Als Spielmacher die Rufsau nicht selbst suchen, sondern klein Trumpf spielen.",
    zug(st, p, legal) {
      if (st.trick.length || st.tricks.length || p !== st.declarer) return null;
      if (st.game.type !== "sauspiel" || st.kontra) return null;   // nach einer Spritze gilt 1.13
      /* Kapitel 1.5: „Der Dumme sucht selber.“ Sucht der Spielmacher
         mit einer Karte der Ruffarbe selbst, wird die Sau zu 30 %
         gestochen; sucht ein Nichtspieler, nur zu 11 %. */
      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (!truempfe.length) return null;
      return truempfe.sort((a, b) => power(a, st.game) - power(b, st.game))[0];
    },
  },
  {
    id: "trumpfrunden-erzwingen",
    seite: 15,
    kurz: "Als trumpfstarker Spielmacher den Trumpf des mutmaßlichen Partners sicher übernehmen und gleich einen kleinen Trumpf nachbringen.",
    zug(st, p, legal) {
      const g = st.game;
      if (p !== st.declarer || g.type !== "sauspiel" || st.kontra) return null;   // nach einer Spritze gilt 1.13
      /* Kapitel 1.4, S. 14/15: Spieler 1 eröffnet mit Trumpf „und hat sich
         so als mein mutmaßlicher Freund gezeigt" (2.1). Gemeint ist der
         erste Stich und die „vermeintlich größere Anzahl an Trümpfen" —
         das Beispiel hält fünf. */
      const auftakt = (t) => t.length && t[0].p !== st.declarer && isTrump(t[0].card, g);
      if (!st.tricks.length) {
        if (st.trick.length !== 1 || !auftakt(st.trick)) return null;
        if (countTrumps(st.hands[p], g) < 5) return null;
        /* Übernommen wird nur, wenn der Stich sonst in Gefahr ist: kann ihn
           keiner der Gegner hinter mir überstechen, ist das die Lage von
           1.10, und dort wird gerade nicht hoch zugegeben. */
        const draussen = unbekannt(st, p).filter((c) => isTrump(c, g));
        const gelegt = power(st.trick[0].card, g);
        if (!draussen.some((c) => power(c, g) > gelegt)) return null;
        /* „So komme ich sicher ans Ausspiel": mit dem höchsten Trumpf, den
           keiner mehr schlagen kann — im Beispiel der Alte. Das Buch wägt
           auch ab, ihn zu behalten und nur den Herz-Unter zu geben, und
           entscheidet sich für den Alten. */
        const hoch = legal.filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g))[0];
        if (!hoch || draussen.some((c) => power(c, g) > power(hoch, g))) return null;
        return hoch;
      }
      /* „… und bringe dann ein kleines Herz nach": die zweite Trumpfrunde,
         gleich danach und nur diese eine. */
      if (st.trick.length || st.tricks.length !== 1) return null;
      const erster = st.tricks[0];
      if (!auftakt(erster.plays) || erster.winner !== p) return null;
      const klein = legal.filter((c) => isTrump(c, g) && points(c) < 10)
        .sort((a, b) => power(a, g) - power(b, g));
      if (!klein.length || countTrumps(st.hands[p], g) < 2) return null;
      return klein[0];
    },
  },
  {
    id: "schmiertruempfe-zurueckhalten",
    seite: 27,
    kurz: "Als Spielmacher auf den Trumpf des mutmaßlichen Partners keinen Schmiertrumpf zugeben, solange der Partner nicht feststeht.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || p !== st.declarer || g.type !== "sauspiel" || st.partnerKnown) return null;
      /* Kapitel 1.10, S. 26/27: „Der Ausspieler bringt Trumpf und muss
         folglich mein Partner sein" — gelegentlich lügt aber ein Kollege,
         besonders mit einem blanken großen Ober (3.19). Der Stich gehört dem
         Ausspieler, und höher als seine Karte ist nur, was ich selbst halte:
         die Frage ist also allein, ob ich schmiere. */
      const lead = st.trick[0];
      if (lead.p === st.declarer || !isTrump(lead.card, g)) return null;
      if (trickWinner(st.trick, g) !== lead.p) return null;
      const draussen = unbekannt(st, p).filter((c) => isTrump(c, g));
      if (draussen.some((c) => power(c, g) > power(lead.card, g))) return null;
      /* „Mit diesem trumpfstarken Blatt habe ich es gar nicht nötig, ein
         Risiko einzugehen" — die elf Augen kommen notfalls im letzten Stich
         nach Hause. Trumpfstark heißt hier: sechs, wie im Beispiel. */
      if (countTrumps(st.hands[p], g) < 6) return null;
      const truempfe = legal.filter((c) => isTrump(c, g));
      if (!truempfe.some((c) => points(c) >= 10)) return null;     // nichts zu schmieren
      const klein = truempfe.filter((c) => points(c) < 10)
        .sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g));
      return klein.length ? klein[0] : null;
    },
  },
  {
    id: "ruffarbe-abwerfen",
    seite: 29,
    kurz: "Als Spielmacher lieber die blanke Karte der Ruffarbe abwerfen als in eine freie Farbe einzustechen.",
    zug(st, p, legal) {
      if (!st.trick.length || p !== st.declarer || st.game.type !== "sauspiel") return null;
      /* Kapitel 1.11: Wer als Nichtspieler die Rufsau nicht sucht, ist
         die Ruffarbe meist frei und hofft, sie später mit einem
         Schmiertrumpf zu stechen. Werfe ich meine einzige Karte der
         Ruffarbe ab, kann er das nicht mehr. */
      const gefuehrt = st.trick[0].card;
      if (isTrump(gefuehrt, st.game) || gefuehrt[0] === st.game.suit) return null;
      if (legal.some((c) => !isTrump(c, st.game) && c[0] === gefuehrt[0])) return null;  // ich bediene
      /* „kommt mit einer KLEINEN Farbkarte heraus" — auf eine Sau
         oder Zehn trifft die ganze Überlegung nicht zu. */
      if (points(gefuehrt) >= 10) return null;
      /* Und die Sorge endet, sobald die Rufsau gefallen ist: dann kann
         sie niemand mehr stechen. */
      if (st.partnerKnown) return null;
      const meineRuf = rufkarten(st, p);
      if (meineRuf.length !== 1) return null;
      /* Das Buch nennt drei Ausnahmen, in denen ich doch einsteche.
         Zwei standen hier, die dritte fehlte. „Die zwei höchsten Ober"
         heißt Eichel- und Gras-Ober — gezählt wurden bis hierher zwei
         beliebige der drei großen, und damit stach die Regel auf ihrer
         eigenen Stellung (S. 28: der Alte und der Herz-Ober) ein, statt
         den Eichel-König abzuwerfen. */
      if (st.hands[p].indexOf("EO") >= 0 && st.hands[p].indexOf("GO") >= 0) return null;
      if (st.trick.slice(0, 2).some((x) => points(x.card) >= 10)) return null;
      return legal.indexOf(meineRuf[0]) >= 0 ? meineRuf[0] : null;
    },
  },
  {
    id: "wesensart-des-rufspiels",
    seite: 35,
    kurz: "Ist mein Partner trumpffrei und hält ein Gegner mindestens so viele Trümpfe wie ich, gewinne ich als Spielmacher über die Sauen statt mit Trumpfrunden.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || p !== st.declarer || g.type !== "sauspiel" || st.kontra) return null;
      /* Kapitel 1.14, S. 34/35: auf meinen Alten schmiert Spieler 4 — „Alles
         klar: er ist mein Partner, hat aber keinen Trumpf." Gelesen wird, was
         das Buch liest: wer auf einen Trumpfstich des Spielmachers eine
         Schmierkarte statt Trumpf legt. Ein Gegenspieler schenkt mir keine
         zehn Augen. Nach dem Fall der Rufsau gilt das gesicherte Wissen. */
      const trumpfrei = (q) => st.tricks.some((t) => isTrump(t.plays[0].card, g)
        && t.plays.some((x) => x.p === q && !isTrump(x.card, g)));
      let partner = st.partnerKnown ? st.partner : null;
      if (partner === null) {
        const schmierer = new Set();
        st.tricks.filter((t) => t.winner === p && isTrump(t.plays[0].card, g)).forEach((t) =>
          t.plays.forEach((x) => { if (x.p !== p && !isTrump(x.card, g) && points(x.card) >= 10) schmierer.add(x.p); }));
        if (schmierer.size !== 1) return null;
        partner = [...schmierer][0];
      }
      if (!trumpfrei(partner)) return null;
      /* „Wenn ich fünf Trümpfe habe, mein Freund aber keinen einzigen, dann
         haben unsere Gegner zusammen neun. Damit hat einer der Gegner
         ebenfalls mindestens fünf." Dieselbe Rechnung mit dem, was noch
         draußen ist: alle ungesehenen Trümpfe sitzen bei den beiden Gegnern. */
      const draussen = unbekannt(st, p).filter((c) => isTrump(c, g)).length;
      if (Math.ceil(draussen / 2) < countTrumps(st.hands[p], g)) return null;
      /* „Meine beiden blanken Sauen und die Rufsau meines Partners sind
         unsere einzigen brauchbaren Trümpfe": eine Sau, die blanke zuerst. */
      const laenge = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f).length;
      const sauen = legal.filter((c) => !isTrump(c, g) && c[1] === "A" && c[0] !== g.suit)
        .sort((a, b) => laenge(a[0]) - laenge(b[0]));
      return sauen.length ? sauen[0] : null;
    },
  },
  {
    id: "trumpf-nach-davonlaufen",
    seite: 105,
    kurz: "Ist der Gerufene davongelaufen, bringe ich als Nichtspieler Trumpf statt einer Farbe.",
    zug(st, p, legal) {
      if (st.trick.length || st.game.type !== "sauspiel" || knowsOwnSide(st, p)) return null;
      /* Davongelaufen ist, wer die Ruffarbe anspielt, ohne dass die Sau
         in diesem Stich fällt: wer sie hält, muss sie auf das Suchen
         zugeben — außer er spielt selbst an. Das ist sicheres Wissen,
         keine Vermutung, und es steht für jeden sichtbar auf dem Tisch. */
      const sau = calledCard(st.game);
      let lauf = -1;
      for (let i = 0; i < st.tricks.length; i++) {
        const t = st.tricks[i];
        if (st.tricks.slice(0, i).some((u) => u.plays.some((x) => x.card === sau))) break;
        const l = t.plays[0];
        if (l.p === st.declarer || l.p === p || isTrump(l.card, st.game) || l.card[0] !== st.game.suit) continue;
        if (!t.plays.some((x) => x.card === sau)) { lauf = i; break; }
      }
      if (lauf < 0) return null;
      /* Kapitel 3.22: wer davonläuft, hält mindestens vier Karten der
         Ruffarbe und ist deshalb in einer der anderen Farben oft frei.
         Trumpf ist die Farbe, in der er mir nichts wegnehmen kann.
         „Auch einmal" — einmal, beim nächsten eigenen Ausspiel danach. */
      if (st.tricks.slice(lauf + 1).some((t) => t.plays[0].p === p)) return null;
      /* Und nur, wenn ich etwas zu schützen habe. Das Buch begründet den
         Trumpf mit den eigenen Sauen: der Davongelaufene ist in einer der
         anderen Farben wahrscheinlich frei, der Spielmacher vielleicht in
         der dritten — „meine beiden Sauen haben nur geringe
         Überlebenschancen". Der Trumpf zieht ihm seine ein, zwei Trümpfe,
         bevor seine freie Farbe kommt. Ohne diese Schranke griff die Regel
         bei jedem Gegenspieler und kostete am Buchtisch auf beiden Saaten
         (−33 ± 28, −17 ± 30). */
      const eigeneSau = st.hands[p].some((c) => c[1] === "A" && !isTrump(c, st.game) && c[0] !== st.game.suit);
      if (!eigeneSau) return null;
      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (!truempfe.length) return null;
      /* Den höchsten: er „zwingt den Spielmacher, einen hohen einzusetzen". */
      return truempfe.sort((a, b) => power(b, st.game) - power(a, st.game))[0];
    },
  },
  {
    id: "blanke-zehn-suchen",
    seite: 63,
    kurz: "Als Gegenspieler die blanke Zehn der Ruffarbe anspielen.",
    zug(st, p, legal) {
      if (st.trick.length || st.tricks.length > 1) return null;
      if (knowsOwnSide(st, p) || haeltSau(st, p)) return null;
      const meine = rufkarten(st, p);
      if (meine.length !== 1 || meine[0][1] !== "X") return null;
      return legal.indexOf(meine[0]) >= 0 ? meine[0] : null;
    },
  },
  {
    id: "dreifach-besetzte-zehn",
    seite: 65,
    kurz: "Als trumpfschwacher Gegenspieler mit dreifach besetzter Zehn nicht mit der Zehn suchen, sondern mit dem König.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || g.type !== "sauspiel" || st.partnerKnown) return null;
      if (knowsOwnSide(st, p) || haeltSau(st, p)) return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;       // ich suche zum ersten Mal
      const meine = rufkarten(st, p);
      if (meine.length !== 3 || meine.indexOf(g.suit + "X") < 0) return null;
      /* Kapitel 3.2: „Da ich selbst trumpfschwach bin", gewinnen wir nur,
         wenn der Partner trumpfstark ist — und dann ist mein Beitrag, auf
         seine Stiche zu schmieren. Die Zehn setze ich dafür nicht aufs
         Spiel: der Spielmacher sticht die dreifach besetzte Farbe gut in
         der Hälfte der Fälle. Das Buch nennt keine Zahl; sein Beispiel hat
         einen Trumpf, zwei stehen hier als Grenze. Trumpfstark schweigt
         die Regel, dort sagt das Kapitel nichts. */
      if (countTrumps(st.hands[p], g) > 2) return null;
      const klein = meine.filter((c) => c[1] !== "X")
        .sort((a, b) => power(b, g) - power(a, g));
      if (!klein.length) return null;
      /* Mit dem König statt der Sieben: vier Augen mehr, wenn der Partner
         die Rufsau holt — aber nur, wenn mir auch ohne ihn genug zum
         Schmieren bleibt. Im Beispiel sind das drei weitere (zwei Zehner
         und ein König); die Zahl ist aus dem Beispiel, nicht aus dem Text.
         Sonst die kleinste Karte, und der König bleibt für den Partner. */
      const schmier = st.hands[p].filter((c) => !isTrump(c, g) && points(c) >= 4 && c !== klein[0]).length;
      const karte = schmier >= 3 ? klein[0] : klein[klein.length - 1];
      return legal.indexOf(karte) >= 0 ? karte : null;
    },
  },
  {
    id: "blanker-alter-eroeffnung",
    seite: 99,
    kurz: "Als Gegenspieler mit dem blanken Alten eröffnen und danach statt zu suchen die Sau der langen Farbe bringen.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || g.type !== "sauspiel" || knowsOwnSide(st, p) || st.partnerKnown) return null;
      /* Kapitel 3.19, S. 98/99: mit vier Gras samt Sau „muss ich davon
         ausgehen, dass der Spielmacher grasfrei ist" — die Sau bringt erst
         etwas, wenn er sie nicht sticht. Drei Karten der Farbe reichen dem
         Buch an anderer Stelle für denselben Schluss (3.24, S. 109); das
         Beispiel hier hat vier. */
      const laenge = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f).length;
      const sauFarbe = ["E", "G", "H", "S"]
        .filter((f) => f !== g.suit && st.hands[p].indexOf(f + "A") >= 0 && laenge(f) >= 3)
        .sort((a, b) => laenge(b) - laenge(a))[0];
      if (!sauFarbe) return null;
      if (!st.tricks.length) {
        /* Die Eröffnung: der Alte ist mein einziger Trumpf. „So eröffnet
           nur der gerufene Mitspieler" — der Spielmacher hält mich für
           seinen Freund und schmiert, wenn er Schmiertrümpfe hat. Den Preis
           nennt das Buch mit: mein Partner muss mich nun für einen Gegner
           halten und schmiert mir nichts (am Tisch liest `buchSicht` genau
           so). Mit zwei Trümpfen samt dem Alten gilt 3.24. */
        if (countTrumps(st.hands[p], g) !== 1 || st.hands[p].indexOf("EO") < 0) return null;
        return legal.indexOf("EO") >= 0 ? "EO" : null;
      }
      /* „Die eigentliche Krönung folgt in der zweiten Runde": ich suche
         noch immer nicht, sondern bringe die Sau — der Spielmacher hält mich
         weiter für seinen Partner und wirft statt einzustechen einen Spatz
         ab. Nur genau diese eine Runde; der Alte hat den ersten Stich
         sicher gemacht, ich bin also wieder am Ausspiel.
         Nicht gebaut: die Variante mit dem blanken Gras-Ober („wenn mir
         ansonsten droht, Schwarz zu werden") steht nicht im Merksatz, und
         den Rat, die Finte selten einzusetzen, kann ein Bot nicht befolgen —
         am Tisch liest ihn ohnehin keiner. */
      if (st.tricks.length !== 1) return null;
      const erster = st.tricks[0].plays[0];
      if (erster.p !== p || erster.card !== "EO") return null;
      return legal.indexOf(sauFarbe + "A") >= 0 ? sauFarbe + "A" : null;
    },
  },
  {
    id: "farbe-wiederholt-anspielen",
    seite: 109,
    kurz: "Als trumpfschwacher Gegenspieler statt zu suchen meine lange Farbe anspielen, in der der Spielmacher frei ist — und sie wieder bringen.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || g.type !== "sauspiel" || knowsOwnSide(st, p) || haeltSau(st, p)) return null;
      const fehl = (f) => legal.filter((c) => !isTrump(c, g) && c[0] === f);
      /* Die Karte der Farbe: die Sau erst in der dritten Runde, davor die
         höchste unter der Zehn — „den König und nicht nur die Neun", sonst
         wirft der Spielmacher einfach seinen Spatz der Ruffarbe ab. */
      const karteAus = (f, sauErlaubt) => {
        const k = fehl(f);
        const mittel = k.filter((c) => c[1] !== "A" && c[1] !== "X").sort((a, b) => power(b, g) - power(a, g));
        if (mittel.length) return mittel[0];
        return sauErlaubt ? k.find((c) => c[1] === "A") || null : null;
      };
      const eigene = st.tricks.filter((t) => t.plays[0].p === p);
      if (eigene.length) {
        /* Die Fortsetzung: meine erste Farbe hat der Spielmacher gestochen,
           jetzt bin ich wieder am Ausspiel und bringe sie erneut — „diesmal
           die Sau". Jede Runde kostet ihn einen hohen Trumpf. */
        const erste = eigene[0];
        const f = erste.plays[0].card[0];
        if (isTrump(erste.plays[0].card, g) || f === g.suit) return null;
        if (erste.winner !== st.declarer) return null;
        if (!erste.plays.some((x) => x.p === st.declarer && isTrump(x.card, g))) return null;
        const sau = fehl(f).find((c) => c[1] === "A");
        return sau || karteAus(f, true);
      }
      /* Die Eröffnung. Kapitel 3.24: „Ich selbst habe nur zwei Trümpfe" —
         im gewöhnlichen Sauspiel hält der Spieler fünf, mein Partner also
         drei oder vier. Und mit dem Alten komme ich sicher wieder ans
         Ausspiel, ohne ihn ginge der Plan nach dem ersten Schritt nicht
         weiter. Genau zwei: ist der Alte mein einziger Trumpf, rät das Buch
         etwas anderes — ihn blank anzuspielen (3.19, S. 98). */
      if (st.partnerKnown || countTrumps(st.hands[p], g) !== 2 || st.hands[p].indexOf("EO") < 0) return null;
      /* „Nachdem ich selbst bereits drei Gras-Karten habe, ist der
         Spielmacher mit hoher Wahrscheinlichkeit grasfrei." */
      const farben = ["E", "G", "H", "S"].filter((f) => f !== g.suit && fehl(f).length >= 3)
        .sort((a, b) => fehl(b).length - fehl(a).length);
      for (const f of farben) {
        const k = karteAus(f, false);
        if (k) return k;
      }
      return null;
    },
  },
  {
    id: "freie-farbe-anzeigen",
    kostet: "−150 ± 48 und −143 ± 48 Sitze am Buchtisch, 06.10.2026 — seit es nur noch in den ersten drei Stichen sendet",
    seite: 49,
    kurz: "Als Partner mit wenig Trumpf die dritte Farbe anspielen, um die freie Farbe zu zeigen.",
    zug(st, p, legal) {
      if (st.trick.length || !st.partnerKnown || st.partner !== p) return null;
      /* Früh oder gar nicht. S. 49 setzt „nach dem Suchen der Rufsau in
         der ersten Runde" an, S. 31 liest „früh im Spiel" — und
         `signalFreieFarbe` schaut deshalb nur in die ersten drei Stiche.
         Bis hierher sendete die Regel auch im sechsten Stich, also in ein
         Fenster, das der Empfänger nie öffnet: die Farbkarte war weg, und
         gelesen hat sie keiner. */
      if (st.tricks.length > 2) return null;
      /* „Mit wenigen KLEINEN Trümpfen kann ich den Partner nur bedingt
         unterstützen." Das Beispiel des Buches (S. 48) hält Schellen-Ober,
         Herz-Zehn und Herz-Sieben und nennt das ausdrücklich „wenige und
         kleine Trümpfe" — der Schellen-Ober zählt also dazu, nur die drei
         großen nicht. Bis hierher schloss jeder Ober das Signal aus, und
         die Regel schwieg auf ihrer eigenen Stellung.
         Die Gegenrichtung nennt das Buch auch: mit drei oder mehr
         Trümpfen UND Augen zum Schmieren verzichte ich aufs Farbeln und
         zeige lieber die hohen Trümpfe. Augen zum Schmieren sind Sau und
         Zehn einer Fehlfarbe — die Herz-Zehn im Beispiel zählt nicht,
         das Buch sagt dort „keine Karten zum Schmieren". */
      const meineTruempfe = st.hands[p].filter((c) => isTrump(c, st.game));
      if (meineTruempfe.length > 3) return null;
      if (meineTruempfe.some((c) => HOHE_OBER.indexOf(c) >= 0)) return null;
      const schmieren = st.hands[p].some((c) => !isTrump(c, st.game) && points(c) >= 10);
      if (meineTruempfe.length === 3 && schmieren) return null;
      /* Ein Signal gibt man einmal. Habe ich die dritte Farbe schon
         angespielt, weiß der Spielmacher Bescheid; sie noch einmal zu
         bringen sagt nichts Neues und verschenkt späte Stiche. */
      if (st.tricks.some((t) => t.plays[0].p === p
        && !isTrump(t.plays[0].card, st.game) && t.plays[0].card[0] !== st.game.suit)) return null;
      const farben = ["E", "G", "H", "S"].filter((s) => s !== st.game.suit);
      const freie = farben.filter((s) => st.hands[p].filter((c) => c[0] === s && !isTrump(c, st.game)).length === 0);
      if (!freie.length) return null;
      const dritte = legal.filter((c) => !isTrump(c, st.game) && c[0] !== st.game.suit && freie.indexOf(c[0]) < 0);
      if (!dritte.length) return null;
      return dritte.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
    },
  },
  {
    id: "freie-farbe-des-partners-lesen",
    /* Trug bis 06.10.2026 `kostet` (−79 ± 48 und −48 ± 46). Seit nur
       noch der Spielmacher liest (`signalFreieFarbe`): −74 ± 38 und
       −30 ± 36 — die zweite Saat im Fehlermaß, also keine Marke mehr. Sie
       neigt beim Spielmacher zu Kosten; den Rest der zweiten Saat trug
       der Gegenspieler, der ein Signal las, das es nicht gab. */
    seite: 31,
    kurz: "Die Farbe anspielen, die der Partner durch sein Anspiel als frei angezeigt hat.",
    zug(st, p, legal) {
      if (st.trick.length) return null;
      const sig = gelesenesSignal(st, p);
      if (!sig) return null;
      /* Nicht die kleinste Karte, sondern die höchste unterhalb der Sau —
         so hält es das Buch auf S. 30, wo es mit Schelln-König und
         -Sieben den König bringt. Der Partner sticht die Farbe ohnehin;
         dann sollen die Augen gleich mit hinein. Die Sau bleibt liegen:
         sie macht ihren Stich allein und braucht keinen Trumpf dazu. */
      const meine = legal.filter((c) => !isTrump(c, st.game) && c[0] === sig.farbe && c[1] !== "A");
      if (!meine.length) return null;
      return meine.sort((a, b) => points(b) - points(a) || power(b, st.game) - power(a, st.game))[0];
    },
  },
  {
    id: "nach-spritze-rollen-tauschen",
    /* 1.13 hat eine eigene Buchstellung (S. 32), die bis 06.10.2026 an
       keiner Regel hing — die Hälfte des Spielmachers war deshalb nie an
       ihrer Stellung geprüft. Sie spielt dort die Buchkarte. */
    auch: ["nach-spritze-ungewoehnlich"],
    /* Trug bis 06.10.2026 `kostet` (−61 ± 27 und −42 ± 29), ganz in der
       Hälfte des Spritzengebers — einer Hälfte, die nicht im Buch steht
       und seitdem gestrichen ist. Danach +9 ± 26 und +13 ± 27: der
       Fortgeschrittene spielt die Regel wieder. */
    seite: 57,
    kurz: "Nach einer Spritze spielt die Spielerpartei Farbe statt Trumpf — bis der Spielmacher selbst Trumpf bringt.",
    zug(st, p, legal) {
      if (st.trick.length || !st.kontra) return null;
      /* Nur im Sauspiel: 1.13 und 2.10 stehen in den Kapiteln des Rufers
         und des Gerufenen. Ohne diese Schranke spielte der Spritzengeber
         gegen ein Solo seinen höchsten Trumpf aus — Kapitel 5.30 rät ihm
         dort das Gegenteil, Punkte anzubieten — und der Solospieler nach
         der Spritze eine blanke Farbe. Der achte Fall von „der
         Geltungsbereich", gefunden beim Bau von 5.30. */
      if (st.game.type !== "sauspiel") return null;
      /* Kapitel 2.10 und 1.13. Durch die Spritze ist die unterstellte
         Trumpfhoheit der Spielerpartei hinfällig: der Spritzengeber
         ist mindestens ebenbürtig und lässt sich nicht mehr mit den
         üblichen Trumpfrunden ausschalten. Also tauschen die Parteien
         ihre Gewohnheiten — die Spielerpartei aber nicht wie ein Mann:
         1.13 spricht zum Spielmacher, 2.10 zum Partner, und die beiden
         sollen Verschiedenes tun. */
      if (p === st.declarer && st.game.type === "sauspiel") {
        /* Kapitel 1.13: der Spielmacher bringt die Ruffarbe und sucht
           seinen Partner ausnahmsweise selbst. Sonst gälte 1.5 — „der
           Dumme sucht selber" —, aber nach einer Spritze ist genau das
           das Ungewöhnliche. Und zwar einmal: „meine nächste Karte
           wäre dann nicht wieder Eichel, sondern ein kleiner Trumpf",
           damit der Gegner keinen Spatz abwirft und sich eine Farbe
           freimacht. */
        const gesucht = st.tricks.some((t) =>
          t.plays[0].p === st.declarer && !isTrump(t.plays[0].card, st.game)
          && t.plays[0].card[0] === st.game.suit);
        const ruf = gesucht ? [] : legal.filter((c) => !isTrump(c, st.game) && c[0] === st.game.suit);
        if (ruf.length) return ruf.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
        /* Das Buch nennt genau die nächste Karte, nicht alle weiteren.
           Bis 06.10.2026 spielte die Regel bei jedem Ausspiel den
           kleinsten Trumpf, bis keiner mehr da war — danach schweigt S. 33,
           und die übrigen Regeln entscheiden. */
        if (st.tricks.some((t) => t.plays[0].p === st.declarer && isTrump(t.plays[0].card, st.game))) return null;
        const truempfe = legal.filter((c) => isTrump(c, st.game));
        if (!truempfe.length) return null;
        return truempfe.sort((a, b) => power(a, st.game) - power(b, st.game))[0];
      }
      if (knowsOwnSide(st, p)) {
        /* Kapitel 2.10 für den Partner: keinen Trumpf mehr, sondern
           „mein Glück in den Farben, am liebsten mit einer blanken
           Karte". Blank heißt: die einzige Karte dieser Farbe auf der
           Hand — gezählt wird deshalb die Hand und nicht `legal`, wo
           der Bedienzwang jede Farbe blank aussehen lassen kann.
           Mit einer Ausnahme, die S. 57 gleich danach nennt: bringt der
           Spielmacher „sofort oder auch etwas später" selbst Trumpf,
           folge ich seinem Weg und spiele auch Trumpf. Welchen, sagt die
           Seite nicht; es gelten wieder die Gewohnheiten des Partners —
           den höchsten (2.1), außer der Spielmacher sitzt in Mittelhand
           und ich habe keinen großen Ober (2.7). */
        const g = st.game;
        const spielmacherTrumpf = st.tricks.some((t) => t.plays[0].p === st.declarer && isTrump(t.plays[0].card, g));
        if (spielmacherTrumpf) {
          const truempfe = legal.filter((c) => isTrump(c, g));
          if (!truempfe.length) return null;
          const abstand = (st.declarer - p + 4) % 4;
          const klein = (abstand === 1 || abstand === 2) && !truempfe.some((c) => HOHE_OBER.indexOf(c) >= 0);
          return truempfe.sort((a, b) => klein ? power(a, g) - power(b, g) : power(b, g) - power(a, g))[0];
        }
        const farben = legal.filter((c) => !isTrump(c, st.game));
        if (!farben.length) return null;
        const inDerHand = (f) => st.hands[p].filter((c) => !isTrump(c, st.game) && c[0] === f).length;
        const blank = farben.filter((c) => inDerHand(c[0]) === 1);
        const wahl = blank.length ? blank : farben;
        return wahl.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
      }
      /* Die Gegenseite: hier spielte bis 06.10.2026 der Spritzengeber
         seinen höchsten Trumpf aus, gleich im ersten Stich — „er hat damit
         behauptet, trumpfstark zu sein". Das steht nicht im Buch. S. 57
         spricht auf der Gegenseite nur den *Partner* des Spritzengebers
         an, und nur mit einer Erlaubnis: „Natürlich werde ich immer erst
         suchen. Aber sollte ich ein zweites Mal zum Ausspielen kommen,
         bringe ich als Nichtspieler durchaus auch einmal Trumpf." Erst
         suchen, dann darf es Trumpf sein — welcher und wann, lässt die
         Seite offen. Eine Karte gibt das nicht her; die Gegenseite fällt
         deshalb an die übrigen Regeln und die Heuristik. Die gestrichene
         Hälfte war die, die am Buchtisch kostete. */
      return null;
    },
  },
  {
    id: "gegen-tout-laengste-farbe-ohne-sau",
    seite: 173,
    kurz: "Gegen einen Tout in Mittelhand die längste Farbe anspielen, von der ich keine Sau habe.",
    zug(st, p, legal) {
      if (st.trick.length || !st.game.tout || p === st.declarer) return null;
      /* Kapitel 5.12. Der Toutspieler verliert beim ersten
         abgegebenen Stich — es geht also nicht um Augen, sondern
         allein darum, irgendwo durchzukommen. Die längste eigene
         Farbe ist dort die beste Chance, und die Sau behalte ich
         zurück: sie ist der Stich, auf den ich hoffe. */
      const abstand = (st.declarer - p + 4) % 4;
      if (abstand !== 1 && abstand !== 2) return null;
      const farben = ["E", "G", "H", "S"].filter((f) => f !== trumpSuitOf(st.game));
      let beste = null;
      for (const f of farben) {
        const meine = legal.filter((c) => !isTrump(c, st.game) && c[0] === f);
        if (!meine.length || meine.some((c) => c[1] === "A")) continue;
        if (!beste || meine.length > beste.length) beste = meine;
      }
      if (!beste) return null;
      return beste.sort((a, b) => power(b, st.game) - power(a, st.game))[0];
    },
  },
  {
    id: "wenz-tout-sau-abwerfen",
    seite: 211,
    kurz: "Bei einem Tout durch Abwerfen einer Sau zeigen, welche Farbe die Partner bedenkenlos abwerfen können.",
    zug(st, p, legal) {
      if (!st.trick.length || !st.game.tout || p === st.declarer) return null;
      /* Kapitel 5.31. Gegen einen Tout sind Augen wertlos — der
         Spielmacher gewinnt oder verliert an Stichen. Eine Sau, die
         ohnehin nicht mehr zum Stich kommt, ist deshalb die
         deutlichste Nachricht an die Partner: diese Farbe brauchen
         wir nicht mehr zu decken. */
      if (legal.some((c) => effektivBedient(st, c))) return null;
      const sauen = legal.filter((c) => c[1] === "A" && !isTrump(c, st.game));
      if (!sauen.length) return null;
      return sauen[0];
    },
  },
  {
    id: "sau-gegen-hinterhand-ausnahme",
    seite: 187,
    kurz: "Gegen ein Solo oder einen Farbwenz in Hinterhand spiele ich nur dann eine Sau aus, wenn ich mit drei Trumpfstichen rechne — oder wenn ich nur Farben mit Sau halte.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !gegenAllein(st, p)) return null;
      if (g.type !== "solo" && g.type !== "farbwenz") return null;
      if ((st.declarer - p + 4) % 4 !== 3) return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;       // meine Eröffnung
      /* Kapitel 5.19, die beiden Ausnahmen zu 5.18. Sie steht vor
         `keine-sau-gegen-hinterhand`, damit die zweite überhaupt greift:
         dort zählt eine Farbe mit Sau und Lusche als spielbar, und die
         Regel eröffnete mit der Lusche — genau das Schinden, vor dem das
         Buch hier warnt. */
      const farbe = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f);
      const sauen = legal.filter((c) => !isTrump(c, g) && c[1] === "A");
      if (!sauen.length) return null;
      /* Erstens: sehr trumpfstark, drei Trumpfstiche für unsere Partei.
         Wie in `keine-sau-gegen-hinterhand` fünf Trümpfe als Ersatz für die
         Stichrechnung; dazu zwei Ober oder Unter wie in 5.16 — das Beispiel
         (S. 186) hält drei. Mit fünf kleinen Trümpfen schweigen beide
         Regeln, wie bisher. */
      const tr = st.hands[p].filter((c) => isTrump(c, g));
      const stark = tr.length >= 5 && tr.filter((c) => c[1] === "O" || c[1] === "U").length >= 2;
      /* Zweitens, die Zwangslage: jede Farbe auf meiner Hand hat ihre Sau. */
      const farben = [...new Set(st.hands[p].filter((c) => !isTrump(c, g)).map((c) => c[0]))];
      const zwang = farben.every((f) => farbe(f).some((c) => c[1] === "A"));
      if (!stark && !zwang) return null;
      /* „Erwische ich mit der Sau seinen Spatz, spiele ich dieselbe Farbe
         klein nach" — also die Sau, hinter der noch eine Karte steht. */
      return sauen.sort((a, b) => farbe(b[0]).length - farbe(a[0]).length)[0];
    },
  },
  {
    id: "keine-sau-gegen-hinterhand",
    seite: 185,
    /* Dieselbe Regel steht zweimal im Buch: 5.2 sagt, was ich anspiele
       („Langer Weg — kurze Farbe"), 5.18, was nie („vielleicht das
       wichtigste Kapitel im ganzen Buch"). `auch` nennt den zweiten
       Merksatz, damit `test/regelstellungen.js` beide Stellungen prüft. */
    auch: ["langer-weg-kurze-farbe"],
    kurz: "Gegen ein Solo oder einen Farbwenz in Hinterhand keine Sau anspielen, sondern die kurze Farbe.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || p === st.declarer || g.tout) return null;
      /* Solo und Farbwenz; der farblose Wenz „sieht anders aus" (5.7). */
      if (g.type !== "solo" && g.type !== "farbwenz") return null;
      /* Hinterhand: ich spiele an, der Alleinspieler gibt als Letzter zu. */
      if ((st.declarer - p + 4) % 4 !== 3) return null;
      /* Die Eröffnung — mein erstes eigenes Anspiel. */
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;
      /* 5.19, die Ausnahme: wer drei Trumpfstiche erwarten darf, bietet
         die Punkte selbst an und spielt die Sau. Das Buch zählt die Stiche
         nicht vor; fünf Trümpfe stehen hier als Ersatz — so viele hält
         sein Beispiel, zwei die beiden Stellungen dieser Regel. Die
         Stichrechnung aus `alleinspiel.js` taugt dafür nicht, sie zählt
         aus Sicht des Spielers. */
      if (countTrumps(st.hands[p], g) >= 5) return null;
      const farbe = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f);
      const farben = [...new Set(legal.filter((c) => !isTrump(c, g) && c[1] !== "A").map((c) => c[0]))];
      /* Nur Farben mit Sau auf der Hand: die zweite Ausnahme aus 5.19 —
         dann lieber die Sau als eine Lusche. Die Regel schweigt. */
      if (!farben.length) return null;
      /* „Eine einzeln stehende oder meine kürzeste Farbe." Bei gleicher
         Länge entscheidet das Buch nur im Beispiel (S. 184: je zwei Karten
         in Eichel, Gras und Schelln, Lösung Schelln-König). Daraus
         gefolgert, nicht dort begründet: keine Farbe, deren Sau oder Zehn
         ich halte — die Sau bliebe blank, die Zehn ist Schmierkarte, und
         auf die achtet der Verteidiger (5.13, 5.30). */
      const schwer = (f) => farbe(f).filter((c) => c[1] === "A" || c[1] === "X").length;
      const ziel = farben.sort((a, b) => farbe(a).length - farbe(b).length || schwer(a) - schwer(b))[0];
      /* In der Farbe die höchste Karte unter der Zehn: auf S. 184 der
         König, nicht die Neun. */
      const karten = legal.filter((c) => !isTrump(c, g) && c[0] === ziel && c[1] !== "A");
      const ohneZehn = karten.filter((c) => c[1] !== "X");
      return (ohneZehn.length ? ohneZehn : karten).sort((a, b) => power(b, g) - power(a, g))[0];
    },
  },
  {
    id: "lusche-statt-schmierkarte-lesen",
    seite: 161,
    kurz: "Hat der Partner auf einen sicheren Stich eine Lusche statt einer Schmierkarte abgeworfen, spiele ich diese Farbe mit meiner punktreichsten Karte nach.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !st.tricks.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.6. Der letzte Stich ging an uns, und ein Partner, der
         nicht bedienen konnte, hat nichts Volles zugegeben — obwohl der
         Stich zu dem Zeitpunkt schon sicher war: der Spielmacher hatte
         gespielt, und wir lagen vorn. Dann hat er sich bewusst eine Farbe
         frei gemacht, „sonst hätte er wenigstens einen König beigesteuert". */
      const plays = st.tricks[st.tricks.length - 1].plays;
      if (trickWinner(plays, g) === st.declarer) return null;
      const lead = plays[0].card;
      let farbe = null;
      plays.forEach((x, i) => {
        if (i === 0 || x.p === p || x.p === st.declarer) return;
        if (isTrump(x.card, g) || effSuit(x.card, g) === effSuit(lead, g) || points(x.card) > 0) return;
        const vorher = plays.slice(0, i);
        if (!vorher.some((y) => y.p === st.declarer) || trickWinner(vorher, g) === st.declarer) return;
        farbe = x.card[0];
      });
      if (!farbe) return null;
      /* „die punktreichste Karte genau dieser Farbe" */
      const meine = legal.filter((c) => !isTrump(c, g) && c[0] === farbe);
      if (!meine.length) return null;
      return meine.sort((a, b) => points(b) - points(a) || power(b, g) - power(a, g))[0];
    },
  },
  {
    id: "fuenfzehn-punkte-anbieten",
    seite: 167,
    kurz: "Hält der Partner den Farbstich und sitzt der Spielmacher noch hinter mir, lege ich so zu, dass etwa 15 Punkte im Stich liegen.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || g.type === "wenz") return null;
      /* Kapitel 5.9, Solo und Farbwenz. Der Spielmacher hat noch nicht
         gespielt — er entscheidet nach mir, ob er einsticht. */
      if (st.trick.some((x) => x.p === st.declarer)) return null;
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || !legal.every((c) => effektivBedient(st, c))) return null;
      /* Ein Partner hält den Stich mit der höchsten Karte der Farbe, die
         noch im Spiel ist: bedienend kann der Spielmacher nicht mehr
         darüber, nur noch einstechen oder abspatzen. */
      const w = st.trick.find((x) => x.p === trickWinner(st.trick, g));
      const hoeher = (c) => !isTrump(c, g) && c[0] === lead[0] && power(c, g) > power(w.card, g);
      if (unbekannt(st, p).some(hoeher) || legal.some(hoeher)) return null;
      /* „Der goldene Mittelweg sind 14 oder 15 Punkte": elf sind zu wenig
         (er spatzt ab), einundzwanzig zu viel (halbe Miete). */
      const im = st.trick.reduce((a, x) => a + points(x.card), 0);
      const abstand = (c) => Math.abs(im + points(c) - 15);
      return legal.slice().sort((a, b) => abstand(a) - abstand(b) || points(a) - points(b))[0];
    },
  },
  {
    id: "auf-verdacht-schmieren",
    seite: 169,
    kurz: "Zieht der Spielmacher nicht mit dem höchsten Trumpf an und habe ich neben dem Schmiertrumpf nur noch einen Trumpf, schmiere ich auf Verdacht.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || g.type === "wenz") return null;
      /* Kapitel 5.10. Der Spielmacher zieht Trumpf an, aber nicht den
         höchsten, der noch fehlt — vielleicht hat ihn ein Partner. */
      const lead = st.trick[0];
      if (lead.p !== st.declarer || !isTrump(lead.card, g)) return null;
      if (!unbekannt(st, p).some((c) => isTrump(c, g) && power(c, g) > power(lead.card, g))) return null;
      /* Genau zwei Trümpfe, einer davon ein Schmiertrumpf. Mit einem
         dritten halte ich ihn zurück und hoffe auf die dritte Runde. */
      const meine = st.hands[p].filter((c) => isTrump(c, g));
      if (meine.length !== 2) return null;
      const schmier = meine.filter((c) => points(c) >= 10);
      if (!schmier.length) return null;
      /* Überstechen kann ich nicht — sonst wäre es kein Schmieren. */
      const w = trickWinner(st.trick, g);
      const vorn = st.trick.find((x) => x.p === w).card;
      if (meine.some((c) => power(c, g) > power(vorn, g))) return null;
      /* Hat ein Partner gespritzt, vermute ich bei ihm weitere Trümpfe und
         gebe fürs Erste nur die kleine Karte. */
      if (st.kontra && st.kontraVon !== st.declarer) return null;
      return schmier.sort((a, b) => points(b) - points(a))[0];
    },
  },
  {
    id: "farbe-des-freien-partners",
    seite: 171,
    kurz: "Ist der direkte Hintermann des Spielmachers sichtbar eine Farbe frei, spiele ich diese Farbe an oder nach.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !st.tricks.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.11. Der Partner direkt hinter dem Spielmacher — nicht
         ich, sonst säße der Spielmacher in Hinterhand und hätte keine Zange. */
      const hinter = (st.declarer + 1) % 4;
      if (hinter === p) return null;
      /* „Offensichtlich frei": er hat auf eine angespielte Farbe nicht
         bedient. Hat er auf Trumpf nicht bedient, fehlt die Drohung — er
         könnte gar nicht überstechen. */
      const frei = new Set();
      for (const t of st.tricks) {
        const lead = t.plays[0].card;
        const x = t.plays.find((y) => y.p === hinter);
        if (!x || x === t.plays[0] || effSuit(x.card, g) === effSuit(lead, g)) continue;
        if (isTrump(lead, g)) return null;
        frei.add(effSuit(lead, g));
      }
      /* Dass in der Farbe nur noch wenige Punkte liegen, spricht nicht
         dagegen. Meine Schmierkarten aber spiele ich nicht dafür an. */
      const karten = legal.filter((c) => !isTrump(c, g) && frei.has(effSuit(c, g)) && points(c) < 10);
      if (!karten.length) return null;
      return karten.sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "trumpf-sau-nicht-vorschnell",
    seite: 177,
    kurz: "Im Farbwenz Trumpf-Sau und Trumpf-Zehn nicht in einen Stich werfen, den wir ohnehin gewinnen, solange ich damit noch einen Trumpfstich machen kann.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || g.type !== "farbwenz") return null;
      /* Kapitel 5.14. Ein Trumpfstich, der uns gehört: der Spielmacher hat
         schon gespielt, ein Partner liegt vorn. */
      if (!isTrump(st.trick[0].card, g) || !st.trick.some((x) => x.p === st.declarer)) return null;
      if (trickWinner(st.trick, g) === st.declarer) return null;
      /* Sau oder Zehn der Trumpffarbe sind im Farbwenz die Nummern fünf und
         sechs. Mit zwei weiteren Trümpfen gebe ich jetzt einen kleinen und
         weiche dem Trumpf-Unter später mit dem anderen aus. */
      const meine = legal.filter((c) => isTrump(c, g));
      if (!meine.some((c) => points(c) >= 10) || meine.length < 3) return null;
      /* „Gebe ich stattdessen zunächst nur den König zu": die punktreichste
         kleine Trumpfkarte, kein Unter. */
      const klein = meine.filter((c) => points(c) < 10 && c[1] !== "U");
      if (!klein.length) return null;
      return klein.sort((a, b) => points(b) - points(a) || power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "schmierkarten-schonen",
    seite: 175,
    kurz: "Hat der Spielmacher schon zugegeben und liegt ein Partner vorn, ist der Farbstich sicher — dann gebe ich meine Punkte zu.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.13, die zweite Hälfte: „Meine Punkte gebe ich erst und
         nur dann zu, wenn wir den Stich wirklich sicher bekommen." Sicher
         ist er, wenn der Spielmacher schon gespielt hat und ein Partner
         vorn liegt — hinter mir sitzen dann nur noch Partner. Die
         Heuristik schmierte nur als Letzte oder auf einen sehr hohen
         Trumpf und behielt sonst die kleinste Karte; in der Solo-
         Verteidigung kostete das −1,9 / −2,3 Siege je 100 Soli (P6b). Als
         Letzter schmiert sie ohnehin, dort schweigt die Regel. */
      if (st.trick.length !== 2 || !st.trick.some((x) => x.p === st.declarer)) return null;
      if (trickWinner(st.trick, g) === st.declarer) return null;
      /* Nur ein Farbstich, wie im Merksatz. Im Trumpfstich entscheidet
         5.14 (Farbwenz) und sonst der Spielraum der Heuristik — ein Ober
         für drei Augen wäre dort kein Schmieren, sondern ein verschenkter
         Trumpf. */
      if (isTrump(st.trick[0].card, g)) return null;
      /* Welche Karte, sagt die Seite nicht. Die Heuristik gibt als Letzte
         die punktreichste Farbkarte; dieselbe Wahl hier — 5.6 erwartet auf
         einen sicheren Stich „wenigstens einen König". */
      const farbe = legal.filter((c) => !isTrump(c, g));
      if (!farbe.length) return null;
      const karte = farbe.sort((a, b) => points(b) - points(a) || power(b, g) - power(a, g))[0];
      return points(karte) > 0 ? karte : null;
    },
  },
  {
    id: "als-starker-gegenspieler-punkte-anbieten",
    seite: 181,
    kurz: "Als stärkster Gegenspieler biete ich die Punkte selbst an und eröffne mit einer Zehn.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !gegenAllein(st, p) || g.type === "wenz") return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;       // meine Eröffnung
      /* Kapitel 5.16: „Drei gute Trümpfe fünffach besetzt." Fünf Trümpfe,
         darunter wenigstens zwei Ober oder Unter, wie im Beispiel (S. 180). */
      const tr = st.hands[p].filter((c) => isTrump(c, g));
      if (tr.length < 5 || tr.filter((c) => c[1] === "O" || c[1] === "U").length < 2) return null;
      /* In Hinterhand rät 5.19 dem Trumpfstarken die Sau; dort schweigt diese Regel. */
      if ((st.declarer - p + 4) % 4 === 3) return null;
      /* Eine Zehn, deren Sau ich nicht halte — die Punkte biete ich an, die
         Schmierkarten der Partner bleiben für meine Trumpfstiche. */
      const zehnen = legal.filter((c) => !isTrump(c, g) && c[1] === "X" && st.hands[p].indexOf(c[0] + "A") < 0);
      if (!zehnen.length) return null;
      const laenge = (c) => st.hands[p].filter((d) => !isTrump(d, g) && d[0] === c[0]).length;
      return zehnen.sort((a, b) => laenge(a) - laenge(b))[0];
    },
  },
  {
    id: "nicht-die-sau-schinden",
    seite: 183,
    kurz: "Bei einem Farbstich die Sau zugeben, solange der Alleinspieler noch einen Spatz haben könnte — nicht aus Angst zurückhalten.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.17. Ein Partner hat eine Farbe angespielt, der
         Spielmacher sitzt noch hinter mir, und niemand hat eingestochen. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || st.trick.some((x) => x.p === st.declarer || isTrump(x.card, g))) return null;
      const sau = lead[0] + "A";
      if (legal.indexOf(sau) < 0) return null;
      /* „Anders liegt es erst, wenn der Solospieler vor diesem Stich schon
         einen Spatz abgeworfen hat" — einen zweiten erwarte ich dann nicht. */
      const abgeworfen = st.tricks.some((t) => {
        const l = t.plays[0].card;
        const x = t.plays.find((y) => y.p === st.declarer);
        return !isTrump(l, g) && !isTrump(x.card, g) && x.card[0] !== l[0];
      });
      if (abgeworfen) return null;
      return sau;
    },
  },
  {
    id: "letzten-trumpf-abwerfen",
    seite: 189,
    kurz: "Einen blanken kleinen Trumpf, der keinen Stich mehr macht, werfe ich bei der ersten Gelegenheit ab.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || g.type === "wenz") return null;
      /* Kapitel 5.20. Eine Farbe ist angespielt, ich bin sie frei, und der
         Spielmacher hat so hoch eingestochen, dass mein einziger Trumpf
         nicht mehr darüber kommt. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || legal.some((c) => effektivBedient(st, c))) return null;
      const w = trickWinner(st.trick, g);
      const vorn = st.trick.find((x) => x.p === w).card;
      if (w !== st.declarer || !isTrump(vorn, g)) return null;
      const meine = st.hands[p].filter((c) => isTrump(c, g));
      if (meine.length !== 1) return null;
      const t = meine[0];
      /* „klein": kein Ober, kein Unter, kein Schmiertrumpf. */
      if (t[1] === "O" || t[1] === "U" || points(t) >= 10 || power(t, g) > power(vorn, g)) return null;
      /* Danach bin ich trumpflos und darf im nächsten Trumpfstich schmieren. */
      return legal.indexOf(t) >= 0 ? t : null;
    },
  },
  {
    id: "erster-partner-gibt-richtung-vor",
    seite: 191,
    /* 5.4 sagt für denselben Stich, womit ich klein bleibe: eine Lusche,
       die mir eine Farbe frei macht (S. 156). */
    auch: ["abwuerfe-der-partner-lesen"],
    kurz: "Auf einen Trumpf des Spielmachers schmiere ich, wenn der Partner vor mir geschmiert hat, und bleibe klein, wenn er klein blieb.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 2 || !gegenAllein(st, p)) return null;
      /* Kapitel 5.21: der Spielmacher zieht Trumpf an, der erste Partner hat
         zugegeben, ohne zu stechen, und hinter mir sitzt der dritte. */
      const [lead, erster] = st.trick;
      if (lead.p !== st.declarer || !isTrump(lead.card, g)) return null;
      if (trickWinner(st.trick, g) !== st.declarer) return null;
      /* Übernehmen kann ich nicht — sonst stellt sich die Frage nicht. */
      if (legal.some((c) => trickWinner(st.trick.concat([{ p, card: c }]), g) === p)) return null;
      /* „Hopp oder top": schmiert er, schmiere ich; bleibt er klein, ich auch. */
      const schmiert = points(erster.card) >= 10;
      /* Klein bleiben heißt nach 5.4: „ich werfe lieber eine Lusche ab und
         mache mich dadurch eine Farbe frei" — unter gleich kleinen also die
         einzeln stehende. */
      const blank = (c) => (!isTrump(c, g)
        && st.hands[p].filter((d) => !isTrump(d, g) && d[0] === c[0]).length === 1 ? 0 : 1);
      return legal.slice().sort((a, b) => (schmiert
        ? points(b) - points(a) || power(a, g) - power(b, g)
        : points(a) - points(b) || blank(a) - blank(b) || power(a, g) - power(b, g)))[0];
    },
  },
  {
    id: "doppelstich-verhindern",
    seite: 195,
    kurz: "Im Wenz oder Farbwenz gebe ich vor dem Spielmacher den König, damit er mit der Sau übernehmen muss und nicht mit der kleineren Karte sticht.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || (g.type !== "wenz" && g.type !== "farbwenz")) return null;
      /* Kapitel 5.23. Ein Farbstich, den der Spielmacher als Letzter
         bekommt; bisher liegt darin nichts über dem König. */
      if ((st.declarer - p + 4) % 4 !== 1 || st.trick.length !== 2) return null;
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || st.trick.some((x) => isTrump(x.card, g))) return null;
      const f = lead[0], koenig = f + "K";
      if (legal.indexOf(koenig) < 0) return null;
      if (st.trick.some((x) => power(x.card, g) > power(koenig, g))) return null;
      /* Die Sau steht beim Spielmacher, und dazu vielleicht der Ober — im
         Wenz und Farbwenz eine gewöhnliche mittelhohe Farbkarte. Lasse ich
         ihn mit dem Ober billig durch, macht er später mit der Sau einen
         zweiten Stich. */
      const offen = unbekannt(st, p);
      if (offen.indexOf(f + "A") < 0 || offen.indexOf(f + "O") < 0) return null;
      return koenig;
    },
  },
  {
    id: "sau-fuer-die-zehn-zurueckhalten",
    seite: 197,
    kurz: "Gibt der Spielmacher im Wenz oder Farbwenz den König und steht die Zehn noch aus, übernehme ich nicht mit der Sau, sondern stehe unter.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || (g.type !== "wenz" && g.type !== "farbwenz")) return null;
      /* Kapitel 5.24. Der Spielmacher hält den Farbstich mit dem König. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || st.trick.some((x) => isTrump(x.card, g))) return null;
      const f = lead[0];
      const x = st.trick.find((y) => y.p === st.declarer);
      if (!x || x.card !== f + "K" || trickWinner(st.trick, g) !== st.declarer) return null;
      /* Die Zehn fehlt noch — vermutlich bei ihm, Zehn und König zählen für
         einen Wenzspieler zusammen nur als ein Spatz. Zehn Punkte sind mehr
         wert als vier: ich stehe unter und fange sie später mit der Sau. */
      if (unbekannt(st, p).indexOf(f + "X") < 0 || legal.indexOf(f + "A") < 0) return null;
      const klein = legal.filter((c) => c !== f + "A");
      if (!klein.length) return null;
      return klein.sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "ober-ziehen",
    seite: 199,
    kurz: "Spielt ein Partner eine Farbe mit einer punktreichen Karte nach und sitzt der Solospieler direkt hinter mir, steche ich mit meinem blanken oder einfach besetzten hohen Trumpf vor.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 1 || !gegenAllein(st, p) || g.type !== "solo") return null;
      /* Kapitel 5.25, dieselbe Lage wie 5.26: ein Partner bringt eine
         Farbe mit einer Zehn oder Sau, der Solospieler sitzt direkt hinter
         mir, und ich bin die Farbe frei. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || points(lead) < 10 || (st.declarer - p + 4) % 4 !== 1) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;
      /* Der Unterschied zu 5.26 liegt in meiner Hand: der hohe Trumpf
         „blank oder höchstens einfach besetzt" — dann verschenke ich mit
         dem Vorstechen keinen Trumpfstich. Hoch heißt ein Ober oder Unter;
         der Spieler muss dann mit einem Ober darüber. */
      const tr = st.hands[p].filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
      if (!tr.length || tr.length > 2 || (tr[0][1] !== "O" && tr[0][1] !== "U")) return null;
      /* „Habe ich nur wenige Schmierkarten" — sonst ist Schmieren der
         andere Weg, den das Buch nennt. Im Beispiel eine einzige Zehn. */
      if (st.hands[p].filter((c) => !isTrump(c, g) && points(c) >= 10).length > 1) return null;
      return legal.indexOf(tr[0]) >= 0 ? tr[0] : null;
    },
  },
  {
    id: "vorstechen",
    seite: 193,
    kurz: "Bin ich die angespielte Farbe frei und halte nur einen blanken Trumpf, steche ich vor dem Spielmacher vor, statt auf gut Glück zu schmieren.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.22. Eine Farbe ist angespielt, niemand hat gestochen,
         und der Spielmacher kommt direkt nach mir — sonst holte das
         Vorstechen ihn nicht in die Mittelhand. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || st.trick.some((x) => x.p === st.declarer || isTrump(x.card, g))) return null;
      if ((st.declarer - p + 4) % 4 !== 1) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;
      /* „Wer nur einen blanken Trumpf hat": genau einer, und kein
         Schmiertrumpf — dessen Punkte gehören in einen Stich der Partner. */
      const tr = st.hands[p].filter((c) => isTrump(c, g));
      if (tr.length !== 1 || points(tr[0]) >= 10) return null;
      return legal.indexOf(tr[0]) >= 0 ? tr[0] : null;
    },
  },
  {
    id: "zusaetzlichen-trumpfstich-erarbeiten",
    seite: 201,
    kurz: "Mit einem mehrfach besetzten hohen Trumpf steche ich eine nachgespielte Farbe nicht vor, sondern schmiere so viel, dass der Solospieler in Mittelhand einen großen Trumpf aufbieten muss.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 1 || !gegenAllein(st, p) || g.type !== "solo") return null;
      /* Kapitel 5.26, der Gegenentwurf zu 5.25: ein Partner spielt eine
         Farbe mit einer punktreichen Karte nach, der Solospieler sitzt
         direkt hinter mir, und ich bin die Farbe frei. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || points(lead) < 10 || (st.declarer - p + 4) % 4 !== 1) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;
      /* Ein hoher Trumpf, mindestens dreifach besetzt, über dem noch ein
         höherer fehlt: vorstechen verschenkte den sicheren Trumpfstich. */
      const tr = st.hands[p].filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
      if (tr.length < 3 || (tr[0][1] !== "O" && tr[0][1] !== "U")) return null;
      if (!unbekannt(st, p).some((c) => isTrump(c, g) && power(c, g) > power(tr[0], g))) return null;
      /* Anreichern, bis er den Stich nicht mehr abgeben darf — im Beispiel
         mit der Zehn auf zwanzig Punkte. Die Sau hebe ich auf. */
      const voll = legal.filter((c) => !isTrump(c, g) && points(c) >= 10 && c[1] !== "A");
      if (!voll.length) return null;
      return voll.sort((a, b) => points(b) - points(a))[0];
    },
  },
  {
    id: "auf-mageren-stich-verzichten",
    seite: 203,
    kurz: "Trumpfstark verzichte ich auf einen mageren Farbstich vor dem Spielmacher und werfe eine blanke Karte ab, statt einen Schmiertrumpf vorschnell hineinzuwerfen.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 2 || !gegenAllein(st, p) || g.type === "wenz") return null;
      /* Kapitel 5.27. Zwei Partner haben eine Farbe gebracht, ohne Punkte
         und ohne Sau — die steht beim Spielmacher, der als Letzter sitzt.
         Ich bin die Farbe frei. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || (st.declarer - p + 4) % 4 !== 1) return null;
      if (st.trick.some((x) => isTrump(x.card, g) || points(x.card) > 0)) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;
      /* Trumpfstark, mit einem Schmiertrumpf, den ich jetzt einsetzen
         müsste: vier Trümpfe wie im Beispiel (S. 202). */
      const tr = st.hands[p].filter((c) => isTrump(c, g));
      if (tr.length < 4 || !tr.some((c) => points(c) >= 10)) return null;
      /* Statt einzustechen eine blanke Karte — keine Sau —, danach bin ich
         eine weitere Farbe frei und die Trumpfhand bleibt zusammen. */
      const blank = legal.filter((c) => !isTrump(c, g) && c[1] !== "A"
        && st.hands[p].filter((d) => !isTrump(d, g) && d[0] === c[0]).length === 1);
      if (!blank.length) return null;
      return blank.sort((a, b) => points(a) - points(b))[0];
    },
  },
  {
    id: "unscheinbare-karten-nicht-freudlos",
    seite: 205,
    kurz: "Hat der Spielmacher eine Farbe mit der Sau genommen, werfe ich meine kleinen Karten dieser Farbe rasch ab, damit der Partner seinen hohen Wächter nicht halten muss.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.28. Ich kann nicht bedienen, und der Stich geht an den
         Spielmacher — es ist ein Abwurf, kein Schmieren. */
      if (legal.some((c) => effektivBedient(st, c))) return null;
      if (trickWinner(st.trick, g) !== st.declarer) return null;
      /* Eine Farbe, in der der Spielmacher die Sau gespielt hat. Das Buch
         zeigt es am Wenz; der Grund — er hat zur Sau oft noch eine zweite
         Karte — gilt in jedem Alleinspiel. */
      const offen = unbekannt(st, p);
      const sauVomSpieler = (f) => st.tricks.some((t) => t.plays.some((x) => x.p === st.declarer && x.card === f + "A"));
      /* Die höchste Karte der Farbe, die noch aussteht, hält womöglich ein
         Partner als Wächter fest; meine kleinen Karten nehmen ihm die
         Sorge. Halte ich sie selbst, bin ich der Wächter und schweige. */
      const waechterBeiAnderen = (f) => {
        const rest = offen.concat(st.hands[p]).filter((c) => !isTrump(c, g) && c[0] === f);
        const hoechste = rest.sort((a, b) => power(b, g) - power(a, g))[0];
        return !!hoechste && offen.indexOf(hoechste) >= 0;
      };
      /* „Kleine Karten" heißt Luschen. Die erste Fassung warf alles unter
         zehn Punkten, also auch König und (im Wenz) Ober — vier oder drei
         Augen an den Spielmacher, wo die Heuristik eine Lusche gegeben
         hätte. Das kostete −16 ± 15 und −20 ± 14 Sitze am Buchtisch, auf
         den Wenz beschränkt dasselbe; nur mit Luschen −6 ± 9 und −5 ± 9. */
      const karten = legal.filter((c) => !isTrump(c, g) && points(c) === 0
        && sauVomSpieler(c[0]) && waechterBeiAnderen(c[0]));
      if (karten.length) return karten.sort((a, b) => power(a, g) - power(b, g))[0];
      /* Die Gegenseite: ich bin der Wächter. Sind alle übrigen Karten der
         Farbe gefallen, kann der Spielmacher keine zweite mehr haben, und
         mein Wächter bewacht nichts. Dann gebe ich ihn her, statt die
         Lusche abzuwerfen, die neben meiner Zehn oder meinem König steht.
         Ohne diese Hälfte liest das Zeichen niemand — die Heuristik wirft
         nur nach Augen ab und kennt keinen Wächter. Gemessen trägt sie
         wenig: allein +1 ± 2 auf beiden Saaten, mit dem Sender −3 ± 10 und
         −4 ± 9 statt −6 ± 9 und −5 ± 9, alles im Rauschen. */
      const tot = (f) => sauVomSpieler(f) && !offen.some((c) => !isTrump(c, g) && c[0] === f);
      const farbe = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f);
      const normal = legal.slice().sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0];
      const schuetzt = !isTrump(normal, g) && points(normal) === 0 && !tot(normal[0])
        && farbe(normal[0]).some((c) => c[1] === "X" || c[1] === "K");
      if (!schuetzt) return null;
      const frei = legal.filter((c) => !isTrump(c, g) && points(c) < 10 && tot(c[0]));
      if (!frei.length) return null;
      return frei.sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "farbe-nachspielen-vor-dem-spielmacher",
    seite: 207,
    kurz: "Sitze ich direkt vor dem Spielmacher, halte den höchsten Trumpf und habe keine lange Farbe, spiele ich die Lusche einer Farbe an, von der ich auch die Zehn habe.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !gegenAllein(st, p)) return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;       // meine Eröffnung
      /* Kapitel 5.29: kurzer Weg, der Spielmacher sitzt direkt hinter mir. */
      if ((st.declarer - p + 4) % 4 !== 1) return null;
      /* Den höchsten Trumpf halte ich — mit ihm komme ich bald wieder ans
         Ausspiel und bringe dann die Zehn nach. */
      const tr = st.hands[p].filter((c) => isTrump(c, g));
      const offen = unbekannt(st, p).filter((c) => isTrump(c, g));
      if (!tr.length || offen.some((c) => tr.every((t) => power(c, g) > power(t, g)))) return null;
      /* „Kurzer Weg – lange Farbe" hilft nicht: jede Farbe genau zweimal. */
      const farben = {};
      st.hands[p].filter((c) => !isTrump(c, g)).forEach((c) => (farben[c[0]] = (farben[c[0]] || []).concat([c])));
      const listen = Object.values(farben);
      if (!listen.length || listen.some((l) => l.length !== 2)) return null;
      /* Eine Farbe mit Zehn und ohne Sau — zuerst die Lusche. */
      const ziel = listen.find((l) => l.some((c) => c[1] === "X") && !l.some((c) => c[1] === "A"));
      if (!ziel) return null;
      const lusche = ziel.find((c) => c[1] !== "X");
      return legal.indexOf(lusche) >= 0 ? lusche : null;
    },
  },
  {
    id: "nach-spritze-punkte-schonen",
    seite: 209,
    kurz: "Nach der Spritze eines Partners eröffne ich mit einer blanken Lusche und schone die Schmierkarten; der Spritzengeber selbst bietet Punkte an.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.30. Gespritzt hat ein Gegenspieler — nach einem Retour
         liegt die Führung wieder beim Spielmacher. */
      if (!st.kontra || st.kontraVon === st.declarer) return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;       // meine erste Karte
      const inDerHand = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f).length;
      if (st.kontraVon === p) {
        /* Der Spritzengeber zieht den Partnern die Schmierkarten nicht,
           sondern bietet von sich aus Punkte an: eine blanke Zehn oder
           eine Sau — auch wenn der Solospieler sie sticht. */
        const zehn = legal.filter((c) => !isTrump(c, g) && c[1] === "X" && inDerHand(c[0]) === 1);
        const sau = legal.filter((c) => !isTrump(c, g) && c[1] === "A");
        const wahl = zehn.length ? zehn : sau;
        return wahl.length ? wahl.sort((a, b) => inDerHand(a[0]) - inDerHand(b[0]))[0] : null;
      }
      /* Ein Partner hat gespritzt: „Vorrang hat das Schonen der
         Schmierkarten sämtlicher Partner" — sogar vor „kurzer Weg – lange
         Farbe". Also eine einzeln stehende Lusche. */
      const blank = legal.filter((c) => !isTrump(c, g) && points(c) === 0 && inDerHand(c[0]) === 1);
      if (!blank.length) return null;
      return blank.sort((a, b) => power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "kurzer-weg-lange-farbe",
    seite: 151,
    /* 5.13 sagt, mit welcher Karte der langen Farbe, wenn die Sau fehlt:
       „konservativ eine kleine Karte … und riskiere weder die Zehn noch
       den König" (S. 174). */
    auch: ["schmierkarten-schonen"],
    kurz: "Gegen ein Solo oder einen Farbwenz in Mittelhand spiele ich meine längste Farbe an — die Sau, wenn ich sie habe, sonst eine kleine Karte.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || !gegenAllein(st, p)) return null;
      /* Kapitel 5.1. Solo und Farbwenz; der farblose Wenz hat 5.7. */
      if (g.type !== "solo" && g.type !== "farbwenz") return null;
      /* Kurzer Weg: der Spielmacher sitzt an Position 2 oder 3, hinter
         ihm also noch mindestens ein Partner. Steht 5.29 (direkt vor dem
         Spielmacher, jede Farbe zweimal) oder 5.30 (nach einer Spritze)
         weiter oben, haben die Vorrang — 5.30 sagt es ausdrücklich. */
      const abstand = (st.declarer - p + 4) % 4;
      if (abstand !== 1 && abstand !== 2) return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;       // meine Eröffnung
      const farbe = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f);
      const farben = [...new Set(legal.filter((c) => !isTrump(c, g)).map((c) => c[0]))];
      if (!farben.length) return null;
      const sau = (f) => (farbe(f).some((c) => c[1] === "A") ? 1 : 0);
      const lang = farben.sort((a, b) => farbe(b).length - farbe(a).length || sau(b) - sau(a))[0];
      /* „Habe ich gar keine wirklich lange Farbe — etwa … zwei Farben
         doppelt besetzt und eine blank —, bringe ich die einzeln stehende
         Karte." Eine blanke Sau oder Zehn nicht: die Sau wäre nach dem
         Stich erledigt (S. 150), die Zehn ist Schmierkarte (5.13). */
      if (farbe(lang).length < 3) {
        const blank = legal.filter((c) => !isTrump(c, g) && farbe(c[0]).length === 1 && points(c) < 10);
        if (!blank.length) return null;
        return blank.sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0];
      }
      /* Die Sau der langen Farbe, „ist sie nicht gerade meine einzige
         Schmierkarte" — mit ihr bleibe ich am Ausspiel, wenn sie einen
         Spatz erwischt, und bringe die Farbe gleich noch einmal. */
      const schmier = st.hands[p].filter((c) => !isTrump(c, g) && points(c) >= 10);
      if (sau(lang) && schmier.length > 1) return lang + "A";
      /* Ohne Sau (oder mit ihr als einziger Schmierkarte) eine kleine
         Karte: nicht die Zehn, nicht den König (5.13).
         Am Buchtisch −15 ± 15 und −15 ± 14 Sitze, also knapp an der Grenze.
         Weder die blanke Karte (ohne sie −11 ± 14, −15 ± 11) noch die Sau
         (ohne sie −17 ± 18, −16 ± 20) erklärt das — es ist das Anspiel der
         langen Farbe selbst. */
      return farbe(lang).filter((c) => c[1] !== "A")
        .sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g))[0] || null;
    },
  },
  {
    id: "hohen-trumpf-rasch-abwerfen",
    seite: 213,
    kurz: "Von zwei verlorenen Trümpfen gebe ich den hohen zuerst, damit die Partner ihn nicht mehr beim Spielmacher vermuten.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 3 || !gegenAllein(st, p)) return null;
      /* Kapitel 5.32. Der Spielmacher hat Trumpf angezogen, keiner meiner
         Partner hat gestochen, und ich komme auch nicht darüber. */
      const lead = st.trick[0];
      if (lead.p !== st.declarer || !isTrump(lead.card, g) || trickWinner(st.trick, g) !== st.declarer) return null;
      const meine = st.hands[p].filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
      if (meine.length !== 2 || power(meine[0], g) > power(lead.card, g)) return null;
      /* Beide verloren: über meinem höheren fehlt noch ein Trumpf, und der
         steht, weil niemand gestochen hat, vermutlich beim Spielmacher. Der
         höhere ist ein Ober oder Unter, kein Schmiertrumpf — dessen Punkte
         gehören in einen Stich der Partner. */
      const hoch = meine[0];
      if ((hoch[1] !== "O" && hoch[1] !== "U") || points(hoch) >= 10) return null;
      if (!unbekannt(st, p).some((c) => isTrump(c, g) && power(c, g) > power(hoch, g))) return null;
      return legal.indexOf(hoch) >= 0 ? hoch : null;
    },
  },
  {
    id: "nicht-von-intuition-verleiten-lassen",
    seite: 215,
    kurz: "Einen fetten Stich, den ich nur mit dem höchsten Trumpf holen könnte, lasse ich liegen, wenn ich dafür später zweimal sicher steche.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || g.type === "wenz") return null;
      /* Kapitel 5.33. Der Spielmacher hat eine Farbe eingestochen, ich bin
         sie frei, und übernehmen könnte ich nur mit meinem höchsten Trumpf —
         der zugleich der höchste ist, der noch im Spiel ist. */
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || legal.some((c) => effektivBedient(st, c))) return null;
      const w = trickWinner(st.trick, g);
      const vorn = st.trick.find((x) => x.p === w).card;
      if (w !== st.declarer || !isTrump(vorn, g)) return null;
      const tr = st.hands[p].filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
      if (tr.length < 3) return null;
      const drueber = tr.filter((c) => power(c, g) > power(vorn, g));
      if (drueber.length !== 1) return null;
      if (unbekannt(st, p).some((c) => isTrump(c, g) && power(c, g) > power(tr[0], g))) return null;
      /* Stattdessen abwerfen: eine Farbkarte ohne Punkte, und keine, die
         eine Zehn oder Sau blank stellen würde. */
      const farbe = legal.filter((c) => !isTrump(c, g));
      if (!farbe.length) return null;
      const deckt = (c) => st.hands[p].some((d) => !isTrump(d, g) && d[0] === c[0] && d !== c && points(d) >= 10);
      return farbe.sort((a, b) => points(a) - points(b) || deckt(a) - deckt(b) || power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "ranggleiche-von-unten",
    seite: 155,
    kurz: "Unter ranggleichen Karten gebe ich immer die kleinste zu — sonst schließen die Partner, ich hätte keine kleinere mehr.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || !gegenAllein(st, p) || legal.length < 2) return null;
      /* Kapitel 5.3. Nur wenn die Wahl allein zwischen ranggleichen Karten
         besteht — welche Gruppe ich überhaupt nehme, entscheidet eine
         andere Regel. Deshalb steht diese am Ende des Kapitels. */
      const offen = unbekannt(st, p);
      /* Ranggleich: dieselbe Farbe (Trumpf zählt als eine), und keine Karte,
         die noch aussteht, liegt dazwischen. Dazu gleich viele Augen — außer
         bei Ober und Unter: „im Trumpf etwa Schelln-Ober, Eichel-Unter und
         Gras-Unter", der Ober bringt einen Punkt mehr und zählt trotzdem
         gleich. Schmiertrümpfe nie: auf den Eichel-Ober werfe ich den
         Schelln-Unter ab, nicht die Herz-Sau.
         Gemessen neigt die Regel zu Kosten (−7 ± 6 und −5 ± 5 Sitze am
         Buchtisch); nur mit gleichen Augen −3 ± 4 und −1 ± 3. Vermutlich
         der eine Punkt, den das Buch für das Zeichen hergibt — gelesen
         wird es von keinem Bot. Der Unterschied liegt im Rauschen, und das
         Buch nennt Ober und Unter ausdrücklich; deshalb bleiben sie. */
      const bild = (c) => isTrump(c, g) && (c[1] === "O" || c[1] === "U");
      const ranggleich = (a, b) => {
        if (effSuit(a, g) !== effSuit(b, g)) return false;
        if (isTrump(a, g) && (points(a) >= 10 || points(b) >= 10)) return false;
        if (points(a) !== points(b) && !(bild(a) && bild(b))) return false;
        const [lo, hi] = [power(a, g), power(b, g)].sort((x, y) => x - y);
        return !offen.some((c) => effSuit(c, g) === effSuit(a, g) && power(c, g) > lo && power(c, g) < hi);
      };
      if (!legal.every((c) => ranggleich(c, legal[0]))) return null;
      return legal.slice().sort((a, b) => power(a, g) - power(b, g))[0];
    },
  },
  {
    id: "anspiel-farbe-ohne-sau",
    seite: 69,
    kurz: "Als Gegenspieler ohne Karte der Ruffarbe eine Farbe anspielen, in der ich keine Sau habe.",
    zug(st, p, legal) {
      if (st.trick.length || knowsOwnSide(st, p) || haeltSau(st, p)) return null;
      /* Nur im Sauspiel: der ganze Rat dient dazu, die Rufsau zu fangen.
         Ohne diese Schranke war jeder Gegenspieler eines Solos oder Wenz
         „ruffarbfrei" — `rufkarten` findet dort nichts —, und die Regel
         eröffnete gegen jedes Alleinspiel. Aufgefallen an der Stellung
         zu 5.12, solange sie noch ohne Tout eingetragen war. */
      if (st.game.type !== "sauspiel") return null;
      if (rufkarten(st, p).length) return null;           // nur wenn ruffarbfrei
      /* „spiele ich ZUERST eine Farbe an" — das ist die Eröffnung
         eines Gegenspielers, der die Ruffarbe selbst nicht bringen
         kann und deshalb das Ausspiel weiterreicht. Diese Schranke
         fehlte ganz: die Regel bestimmte bis zum letzten Stich jedes
         Anspiel und war damit die mit Abstand meistgenutzte im ganzen
         Satz. Zweimal ist sie sinnlos — das Zeichen ist gegeben —,
         und nach dem Fall der Rufsau gibt es nichts mehr zu suchen. */
      if (st.partnerKnown) return null;
      if (st.tricks.some((t) => t.plays[0].p === p)) return null;
      const farben = ["E", "G", "H", "S"].filter((f) => f !== st.game.suit);
      const ohneSau = farben.filter(
        (f) => st.hands[p].some((c) => c[0] === f && !isTrump(c, st.game)) && st.hands[p].indexOf(f + "A") < 0
      );
      if (!ohneSau.length) return null;
      const kandidaten = legal.filter((c) => !isTrump(c, st.game) && ohneSau.indexOf(c[0]) >= 0);
      if (!kandidaten.length) return null;
      return kandidaten.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
    },
  },
  {
    id: "nicht-schwarz-werden",
    kostet: "−32 ± 30 und −35 ± 29 Sitze am Buchtisch, 30.09.2026",
    seite: 75,
    kurz: "Den Schmiertrumpf hergeben und den höchsten verbliebenen Trumpf behalten.",
    zug(st, p, legal) {
      if (!st.trick.length || st.tricks.length > 5) return null;
      const meine = legal.filter((c) => isTrump(c, st.game));
      if (meine.length !== 2) return null;
      if (countTrumps(st.hands[p], st.game) !== 2) return null;
      const hoch = meine.slice().sort((a, b) => power(b, st.game) - power(a, st.game))[0];
      const klein = meine.filter((c) => c !== hoch)[0];
      // nur sinnvoll, wenn der hohe Trumpf wirklich der höchste noch lebende ist
      const draussen = unbekannt(st, p).filter((c) => isTrump(c, st.game));
      if (draussen.some((c) => power(c, st.game) > power(hoch, st.game))) return null;
      // und nur, wenn der Stich ohnehin nicht mir gehört
      if (trickWinner(st.trick.concat([{ p, card: klein }]), st.game) === p) return null;
      return points(klein) >= 10 ? klein : null;
    },
  },
  {
    id: "schmieren-oder-stechen",
    kostet: "−47 ± 21 und −45 ± 22 Sitze am Buchtisch, 30.09.2026",
    seite: 77,
    kurz: "Auf einen angespielten hohen Trumpf entweder überstechen oder die Trumpf-Sau schmieren.",
    zug(st, p, legal) {
      if (st.trick.length !== 1 || knowsOwnSide(st, p)) return null;
      const gelegt = st.trick[0].card;
      if (!isTrump(gelegt, st.game) || gelegt[1] !== "O") return null;
      /* Der Merksatz nennt drei Bedingungen, umgesetzt war nur eine.
         „Spielt die SPIELERPARTEI einen hohen Trumpf an und sitzt
         MEIN PARTNER hinter mir" — davon prüfte der Code weder, wer
         angespielt hat, noch wer hinten sitzt. Er feuerte also auch,
         wenn mein eigener Partner den Ober brachte: dann übersticht
         die Regel den Partner oder wirft ihm die Trumpf-Sau in einen
         Stich, den er längst hält.

         Gelesen wird mit `buchSicht`: auf der Stellung des Buches (S. 76)
         ist die Rufsau noch nicht gefallen, und dass Spieler 1 der
         Gerufene ist, schließt das Buch aus seinem Trumpfanspiel. Mit
         `relation`, das nur Gesichertes kennt, schwieg die Regel dort. */
      const hinten = (st.trick[0].p + 3) % 4;
      if (buchSicht(st, p, st.trick[0].p) !== -1) return null;   // die Spielerpartei spielt an
      /* Und zwar `=== 1`, nicht bloß „nicht nachweislich ein Gegner":
         der Rat lebt davon, dass der Partner den Stich noch holt. Wer
         die Trumpf-Sau auf gut Glück hinter einen Ober des
         Spielmachers legt, schenkt ihm in der Hälfte der Fälle elf
         Augen. Im Solo weiß jeder Gegenspieler das ohnehin; im
         Sauspiel weiß er es, sobald die Rufsau gefallen ist oder sich
         der Gerufene mit Trumpf gezeigt hat — und das Zweite ist genau
         das Bild des Buches. */
      if (buchSicht(st, p, hinten) !== 1) return null;          // hinten sitzt mein Partner

      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (truempfe.length < 2) return null;
      const hoeher = truempfe.filter((c) => power(c, st.game) > power(gelegt, st.game));
      if (hoeher.length) return hoeher.sort((a, b) => power(a, st.game) - power(b, st.game))[0];
      const fett = truempfe.filter((c) => points(c) >= 10);
      return fett.length ? fett.sort((a, b) => points(b) - points(a))[0] : null;
    },
  },
  {
    id: "zweite-hand-gibt-nichts",
    seite: 89,
    kurz: "Auf einen angespielten Schmiertrumpf an zweiter Stelle den kleinsten Trumpf geben.",
    zug(st, p, legal) {
      if (st.trick.length !== 1 || knowsOwnSide(st, p)) return null;
      const gelegt = st.trick[0].card;
      if (!isTrump(gelegt, st.game) || points(gelegt) < 10) return null;   // Trumpf-Sau oder -Zehner
      /* Dieselbe Stellung wie in 3.8/3.9, nur eine Reihe weiter
         gedacht — und der Text nennt die Sitze vollständig: „Der
         Spielmacher sitzt hinter mir" (Platz 3), „mein Partner in
         Hinterhand" (Platz 4). Genau daraus folgt der Rat: jeder hohe
         Trumpf von mir wird sofort überstochen, der Stich ist aber
         noch zu holen. Sitzt der Spielmacher woanders, stimmt die
         Begründung nicht mehr und die Regel gilt nicht. */
      const dritte = (st.trick[0].p + 2) % 4;
      const hinten = (st.trick[0].p + 3) % 4;
      if (dritte !== st.declarer) return null;                  // der Spielmacher direkt hinter mir
      if (buchSicht(st, p, hinten) === -1) return null;         // hinten mein Partner
      if (buchSicht(st, p, st.trick[0].p) !== -1) return null;  // angespielt hat die Spielerpartei (s. buchSicht)

      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (truempfe.length < 2) return null;
      /* Nur sinnvoll, wenn ich den Stich nicht sicher halten kann — also
         nur, wenn ich nicht den höchsten noch lebenden Trumpf habe. Bis
         hierher schloss schon der Gras-Ober die Regel aus, und genau mit
         ihm steht die Stellung des Buches da (S. 88): er wäre
         „verschwendet", weil der Spielmacher mit dem Alten übernimmt. */
      const hoeher = truempfe.filter((c) => power(c, st.game) > power(gelegt, st.game));
      const draussen = unbekannt(st, p).filter((c) => isTrump(c, st.game));
      if (hoeher.some((c) => !draussen.some((d) => power(d, st.game) > power(c, st.game)))) return null;
      return truempfe.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
    },
  },
  {
    id: "trumpfstich-sichern",
    seite: 87,
    kurz: "Kann ich einen Trumpfstich nicht halten, gebe ich den Trumpf, der mir bei der ungünstigsten Verteilung die meisten späteren Trumpfstiche lässt.",
    /* Steht hinter 3.8/3.9 und 3.14: die regeln eine engere Lage genauer. */
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || g.type !== "sauspiel" || knowsOwnSide(st, p)) return null;
      if (!isTrump(st.trick[0].card, g)) return null;
      if (st.trick.some((x) => x.p === st.declarer)) return null;          // der Spielmacher sitzt noch hinter mir
      const meine = legal.filter((c) => isTrump(c, g));
      if (meine.length < 2 || meine.length !== legal.length) return null;
      /* Kapitel 3.13: „notfalls von der ungünstigsten Trumpfverteilung
         ausgehen". Ungünstigst heißt: der Spielmacher hält die höchsten
         Trümpfe, die ich nicht sehe — so viele, wie er Karten hat. */
      const staerker = (a, b) => power(b, g) - power(a, g);
      const seine = unbekannt(st, p).filter((c) => isTrump(c, g)).sort(staerker)
        .slice(0, st.hands[st.declarer].length);
      const tisch = Math.max(...st.trick.filter((x) => isTrump(x.card, g)).map((x) => power(x.card, g)));
      /* Kann ich den Stich auch gegen diese Verteilung halten, ist das eine
         andere Frage, und die Regel schweigt. */
      if (meine.some((c) => power(c, g) > tisch && seine.every((d) => power(d, g) < power(c, g)))) return null;
      /* Für jede Karte: der Spielmacher übernimmt so billig wie möglich,
         danach zieht er seine Trümpfe von oben, und ich werfe unter jeden,
         den ich nicht schlagen kann, meinen kleinsten. Gezählt wird, wie
         viele Trumpfstiche mir danach sicher bleiben. Das ist genau die
         Rechnung des Buches: mit dem Gras-Unter übernimmt er mit dem
         Eichel-Unter und nimmt mir mit zwei großen Obern beide kleineren;
         mit dem Schellen-Ober muss er einen großen Ober opfern, und der
         Herz-Ober macht später seinen Stich. */
      const stiche = (karte) => {
        const oben = Math.max(tisch, power(karte, g));
        let er = seine.slice();
        const nimmt = er.filter((d) => power(d, g) > oben).sort((a, b) => power(a, g) - power(b, g))[0];
        if (!nimmt) return null;                                             // dann hielte ich den Stich
        er = er.filter((d) => d !== nimmt);
        let ich = meine.filter((c) => c !== karte).sort(staerker);
        let n = 0;
        for (const d of er) {
          if (!ich.length) break;
          const drueber = ich.filter((c) => power(c, g) > power(d, g));
          if (drueber.length) { n++; ich = ich.filter((c) => c !== drueber[drueber.length - 1]); }
          else ich = ich.slice(0, -1);
        }
        return n + ich.length;                                                // was übrig bleibt, sticht zuletzt
      };
      const werte = meine.map((c) => ({ c, n: stiche(c) })).filter((x) => x.n !== null);
      if (werte.length < 2) return null;
      const best = Math.max(...werte.map((x) => x.n));
      if (werte.every((x) => x.n === best)) return null;                     // alle gleich: nichts zu sichern
      /* Unter gleich guten die niedrigste — „Rangleiche Karten von unten
         her abwerfen" (5.3), sonst erwartet der Partner die kleinere
         nicht mehr bei mir. */
      return werte.filter((x) => x.n === best).sort((a, b) => power(a.c, g) - power(b.c, g))[0].c;
    },
  },
  {
    id: "zehn-statt-sau",
    seite: 93,
    kurz: "Mit Sau und Zehn der angespielten Farbe, und beide Gegner hinter mir, gebe ich die Zehn statt der Sau — mit dem König dazu den König.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 1 || g.type !== "sauspiel" || knowsOwnSide(st, p)) return null;
      const lead = st.trick[0];
      if (isTrump(lead.card, g)) return null;
      /* „Unsere beiden Gegner sitzen hinter mir": ich bin zweite Hand, und
         angespielt hat mein Partner. Das Buch schließt auf ihn, weil er den
         Herz-Ober des Spielmachers überstochen hat („Ich vermute daher in
         letzterem meinen Partner") — ein Zeichen, das `buchSicht` nicht
         kennt und das deshalb nur hier gelesen wird, wie dort das
         Trumpfanspiel: gilt nur, wenn genau einer so gestochen hat. */
      const sicht = buchSicht(st, p, lead.p);
      if (sicht === -1) return null;
      if (sicht !== 1) {
        const stecher = new Set(st.tricks
          .filter((t) => t.winner !== st.declarer && t.winner !== p
            && t.plays.some((x) => x.p === st.declarer && isTrump(x.card, g)))
          .map((t) => t.winner));
        if (stecher.size !== 1 || !stecher.has(lead.p)) return null;
      }
      /* „Habe ich Sau und Zehn einer Farbe": die Zehn ist dann die höchste
         Karte draußen, sie macht den Stich überall dort, wo ihn die Sau
         machte, und der erste Gegner sucht die Sau bei seinem Partner
         hinter sich — statt einzustechen wirft er einen Spatz ab. „Noch
         wirkungsvoller" mit Sau, Zehn und König: dann nur der König. */
      const f = lead.card[0];
      const farbe = legal.filter((c) => !isTrump(c, g) && c[0] === f);
      if (farbe.indexOf(f + "A") < 0 || farbe.indexOf(f + "X") < 0) return null;
      return farbe.indexOf(f + "K") >= 0 ? f + "K" : f + "X";
    },
  },
  {
    id: "schmierkarte-opfern",
    seite: 101,
    kurz: "Statt einen billigen Stich einzustechen, werfe ich eine einzeln stehende Karte ab und bin eine zweite Farbe frei.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length !== 3 || g.type !== "sauspiel" || knowsOwnSide(st, p)) return null;
      const lead = st.trick[0].card;
      if (isTrump(lead, g)) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;           // ich bin die Farbe frei
      /* Den Stich hält die Spielerpartei — sonst gäbe es nichts zu opfern —,
         und er ist billig: im Beispiel (S. 100) vier Augen. */
      const w = trickWinner(st.trick, g);
      if (buchSicht(st, p, w) !== -1) return null;
      if (st.trick.reduce((a, x) => a + points(x.card), 0) > 4) return null;
      /* Kapitel 3.20: „Mit meinen Trümpfen komme ich wahrscheinlich dreimal
         zum Stechen." Steche ich jetzt ein, bleiben zwei. Vier Trümpfe
         stehen hier dafür — so viele hält das Beispiel. */
      if (countTrumps(st.hands[p], g) < 4) return null;
      /* Abgeworfen wird eine einzeln stehende Karte einer dritten Farbe —
         keine Sau, die ist ein sicherer Stich, und nicht die Ruffarbe, mit
         der ich noch suchen will. Danach bin ich eine zweite Farbe frei. */
      const blank = legal.filter((c) => !isTrump(c, g) && c[1] !== "A" && c[0] !== g.suit
        && st.hands[p].filter((d) => !isTrump(d, g) && d[0] === c[0]).length === 1);
      if (!blank.length) return null;
      return blank.sort((a, b) => points(a) - points(b))[0];
    },
  },
  {
    id: "rufsau-nicht-stechen",
    /* Am 30.09.2026 schon einmal gebaut und wieder entfernt, weil sie
       kostet. Seit der Experte das Buch auch dort spielt, wo es kostet,
       ist sie zurück — nachgebaut aus der Beschreibung in ARBEITSSTAND,
       und die Messung trifft die alte (−27 ± 17 und −27 ± 18). */
    kostet: "−24 ± 16 und −22 ± 16 Sitze am Buchtisch, 30.09.2026",
    seite: 103,
    kurz: "Sehr trumpfstark die Rufsau nicht stechen, sondern eine blanke Lusche abwerfen.",
    zug(st, p, legal) {
      const g = st.game;
      if (!st.trick.length || g.type !== "sauspiel" || knowsOwnSide(st, p)) return null;
      /* Kapitel 3.21: „Ich steche, weil ich will und nicht, weil ich kann."
         Die Rufsau liegt im Stich und hält ihn, ich bin die Ruffarbe frei. */
      const ruf = calledCard(g);
      const w = trickWinner(st.trick, g);
      if (!st.trick.some((x) => x.card === ruf && x.p === w)) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;
      /* „Mit fünf guten Trümpfen … bist du der starke Gegenspieler" —
         so viele hält das Beispiel (S. 102). */
      if (countTrumps(st.hands[p], g) < 5) return null;
      /* Statt einzustechen eine blanke Lusche: danach bin ich eine zweite
         Farbe frei und behalte alle Trümpfe für die Stiche, die ich will. */
      const blank = legal.filter((c) => !isTrump(c, g) && points(c) === 0
        && st.hands[p].filter((d) => !isTrump(d, g) && d[0] === c[0]).length === 1);
      if (!blank.length) return null;
      return blank.sort((a, b) => power(a, g) - power(b, g))[0];
    },
  },

  /* Kapitel 4: der Alleinspieler. Am Ende, weil keine Regel weiter oben
     den Spielmacher eines Alleinspiels anspricht. */
  {
    id: "ausspiel-variieren",
    seite: 115,
    kurz: "Mit drei Laufenden nicht immer mit demselben Ober eröffnen, sondern die Reihenfolge wechseln.",
    /* Kapitel 4.2, S. 114/115: „Um nicht durchschaubar zu werden, variiere
       ich mein Spiel in gleichen Situationen immer wieder." Das Buch lässt
       drei Eröffnungen gelten — den Herz-Ober, „hin und wieder auch" den
       Gras-Ober, oder den Eichel-Ober „und als zweites dann den Herz-Ober";
       seine Stellung zeigt den Gras-Ober. Eine Regel, die dort immer den
       Gras-Ober spielt, wäre genau der durchschaute Trick, vor dem das
       Kapitel warnt. Gewählt wird deshalb nach dem Blatt: gleiche Karten,
       gleiche Wahl, und damit bleibt jede Messung wiederholbar. Geprüft
       wird in `test/regelstellungen.js` über `spielraum`, nicht über die
       eine Karte der Stellung. */
    spielraum(st, p) {
      const g = st.game;
      if (st.trick.length || p !== st.declarer || g.type !== "solo" || g.tout) return null;
      if (!st.tricks.length) return HOHE_OBER.every((c) => st.hands[p].indexOf(c) >= 0) ? HOHE_OBER.slice() : null;
      const erster = st.tricks[0].plays[0];
      if (st.tricks.length !== 1 || erster.p !== p || erster.card !== "EO") return null;
      return st.hands[p].indexOf("HO") >= 0 && st.hands[p].indexOf("GO") >= 0 ? ["HO"] : null;
    },
    zug(st, p, legal) {
      const raum = this.spielraum(st, p);
      if (!raum) return null;
      if (raum.length === 1) return legal.indexOf(raum[0]) >= 0 ? raum[0] : null;
      const deck = makeDeck();
      const wahl = ["HO", "GO", "EO"][st.hands[p].reduce((a, c) => a + deck.indexOf(c), 0) % 3];
      return legal.indexOf(wahl) >= 0 ? wahl : null;
    },
  },
  {
    id: "mit-unter-einstechen",
    seite: 119,
    kurz: "Sticht der Alleinspieler zu Beginn in eine freie Farbe, nimmt er einen Unter — mit nur einem Unter lieber ein kleines Herz, nie die Zehn oder einen Ober.",
    zug(st, p, legal) {
      const g = st.game;
      if (p !== st.declarer || g.type !== "solo" || g.tout) return null;
      /* Kapitel 4.4, S. 118/119: der Ausspieler bringt seine Farbe, ich bin
         sie frei, und hinter mir sitzt noch einer, der sie auch frei sein und
         die Trumpf-Sau halten kann. „Zu Beginn eines Solos" — die erste
         Runde dieser Farbe, und noch hat keiner gestochen.
         OB ich steche, entscheidet 4.5 (S. 121): an Position 3 „spatze ich
         ohne Zögern ab, solange nicht schon die Sau der Farbe gespielt
         wurde" — und im Bild von 4.4 liegt sie im Stich. In Mittelhand ist
         es eine Abwägung; dort spielte die Regel zuerst auch, und auf der
         Stellung zu 4.5 stach sie mit dem Schellen-Unter, wo das Buch die
         Eichel-Acht abwirft. */
      if (st.trick.length !== 2) return null;
      const lead = st.trick[0].card;
      if (isTrump(lead, g) || st.trick.some((x) => isTrump(x.card, g))) return null;
      if (!st.trick.some((x) => x.card === lead[0] + "A")) return null;
      if (st.tricks.some((t) => !isTrump(t.plays[0].card, g) && t.plays[0].card[0] === lead[0])) return null;
      if (legal.some((c) => effektivBedient(st, c))) return null;        // ich bin die Farbe frei
      /* „Mit einem Unter gehst' nicht unter": mit beiden Untern der
         kleinere. Mit nur einem rechnet das Buch anders — er fehlt sonst
         beim Ziehen gegen die Trumpf-Sau (23,9 % gegen 15,8 %) —, also ein
         kleines Herz; ohne Unter ebenso. Ein Ober „wäre auch in diesem Fall
         zu wertvoll", die Zehn das unnötige Risiko. */
      const unter = legal.filter((c) => c[1] === "U").sort((a, b) => power(a, g) - power(b, g));
      if (unter.length >= 2) return unter[0];
      const klein = legal.filter((c) => isTrump(c, g) && c[1] !== "O" && c[1] !== "U" && points(c) < 10)
        .sort((a, b) => power(a, g) - power(b, g));
      return klein.length ? klein[0] : null;
    },
  },
  {
    id: "abspatzen-hinterhand",
    seite: 123,
    kurz: "Als Alleinspieler in Hinterhand auf eine freie Farbe einen Spatz abwerfen, wenn ich danach in Hinterhand bleibe.",
    zug(st, p, legal) {
      const g = st.game;
      if (p !== st.declarer || g.type === "sauspiel" || g.tout || st.trick.length !== 3) return null;
      if (isTrump(st.trick[0].card, g) || st.trick.some((x) => isTrump(x.card, g))) return null;
      const truempfe = legal.filter((c) => isTrump(c, g));
      if (!truempfe.length || legal.some((c) => effektivBedient(st, c))) return null;
      /* Kapitel 4.6, S. 122/123: „Das Abwerfen einer Fehlkarte ist … dann
         empfehlenswert, wenn ich anschließend in der Hinterhand bin." Das
         bin ich, wenn mein Hintermann den Stich hält und wieder ausspielt.
         Hält ihn mein Vordermann — im Buch der Fall, dass er die Sau
         zugegeben hat —, säße ich danach in Mittelhand: dann stechen, und
         womit, sagen andere Kapitel. Die erste Fassung stach dort selbst
         mit dem kleinsten Trumpf und spielte damit auf den Stellungen zu
         4.11 und 4.12 die Herz-Sieben, wo das Buch mit Herz-König und
         Herz-Ober sticht. Die Regel entscheidet deshalb nur das Abwerfen. */
      if (trickWinner(st.trick, g) !== (p + 1) % 4) return null;
      /* Ein Spatz: eine Fehlkarte, die ohnehin verloren ist — keine Sau,
         und nicht aus einer Farbe, in der meine Sau steht. */
      const spatz = legal.filter((c) => !isTrump(c, g) && c[1] !== "A"
        && st.hands[p].indexOf(c[0] + "A") < 0)
        .sort((a, b) => points(a) - points(b) || power(a, g) - power(b, g));
      return spatz.length ? spatz[0] : null;
    },
  },
  {
    id: "wenig-preisgeben",
    seite: 129,
    kurz: "Ist ein Stich ohnehin verloren und halte ich in der Farbe nur Sau und Zehn, gebe ich die Sau — sie verrät nicht, wo die Zehn steht.",
    zug(st, p, legal) {
      const g = st.game;
      if (p !== st.declarer || g.type === "sauspiel" || !st.trick.length) return null;
      /* Kapitel 4.9, S. 128/129: der Stich ist für mich verloren, gleich
         welche Karte ich gebe — gegen ein Alleinspiel gehört er dann der
         Gegenpartei. */
      if (legal.some((c) => trickWinner(st.trick.concat([{ p, card: c }]), g) === p)) return null;
      /* Bedienen muss ich mit Sau und Zehn, und mehr habe ich in der Farbe
         nicht. Die Zehn verriete: „Spieler 1 hätte sie ausgespielt und
         Spieler 4 hätte sie geschmiert" — die Sau stünde dann bei mir, und
         die Gegner spielen die Farbe nach. Die Sau kostet einen Punkt mehr
         und lässt offen, wo die Zehn ist. */
      const f = legal[0][0];
      if (legal.length !== 2 || legal.some((c) => isTrump(c, g) || c[0] !== f)) return null;
      return legal.indexOf(f + "A") >= 0 && legal.indexOf(f + "X") >= 0 ? f + "A" : null;
    },
  },
  {
    id: "frueh-trumpfstiche-abgeben",
    seite: 131,
    kurz: "Mit beiden Schmiertrümpfen eröffne ich mit einem kleinen Trumpf — den unvermeidlichen Trumpfstich gebe ich früh und billig ab.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || st.tricks.length || p !== st.declarer || g.tout) return null;
      if (g.type !== "solo" && g.type !== "farbwenz") return null;      // nur dort gibt es Schmiertrümpfe
      /* Kapitel 4.10, S. 130/131: „weil ich die beiden Schmiertrümpfe selbst
         in der Hand habe" — Trumpf-Sau und Trumpf-Zehn. Dann liegt im ersten
         Trumpfstich nichts Volles. */
      const meine = st.hands[p].filter((c) => isTrump(c, g));
      if (meine.indexOf(g.suit + "A") < 0 || meine.indexOf(g.suit + "X") < 0) return null;
      /* Und nur, wenn ein Trumpfstich ohnehin abzugeben ist. Das Buch
         spricht dem trumpfstärksten Gegner „für mich eher ungünstig" vier
         von sieben zu, also die Hälfte, aufgerundet; ziehen kann ich ihm
         davon so viele, wie ich Laufende habe. */
      const draussen = unbekannt(st, p).filter((c) => isTrump(c, g)).sort((a, b) => power(b, g) - power(a, g));
      const oben = meine.slice().sort((a, b) => power(b, g) - power(a, g));
      let laufende = 0;
      while (laufende < oben.length && !draussen.some((c) => power(c, g) > power(oben[laufende], g))) laufende++;
      if (Math.ceil(draussen.length / 2) <= laufende) return null;
      const klein = legal.filter((c) => isTrump(c, g)).sort((a, b) => power(a, g) - power(b, g))[0];
      return klein && points(klein) < 10 ? klein : null;
    },
  },
  {
    id: "zehn-vor-koenig-anbieten",
    seite: 143,
    kurz: "Muss ich im Wenz eine Zehn-König-Kombination selbst auflösen, biete ich zuerst die Zehn an und nicht den König.",
    zug(st, p, legal) {
      const g = st.game;
      if (st.trick.length || p !== st.declarer || (g.type !== "wenz" && g.type !== "farbwenz") || g.tout) return null;
      /* Kapitel 4.16, S. 142/143: die Trümpfe der Gegner sind gezogen,
         jetzt geht es nur noch um die Farben. */
      const offen = unbekannt(st, p);
      if (offen.some((c) => isTrump(c, g))) return null;
      /* Blanke Karten kommen vorher (4.17, S. 145): die blanke Sau zuerst,
         dann die Zehn aus der Zehn-König-Kombination. Ohne diese Schranke
         spielte die Regel auf der Stellung zu 4.17 die Gras-Zehn, wo das
         Buch die blanke Eichel-Sau bringt. */
      const fehl = (f) => st.hands[p].filter((c) => !isTrump(c, g) && c[0] === f).length;
      if (["E", "G", "H", "S"].some((f) => fehl(f) === 1)) return null;
      /* Die Farbe, in der ich Zehn und König halte und die Sau draußen
         steht — „solange noch einige Luschen dieser Farbe im Spiel sind":
         so viele, dass jeder Gegner noch eine Karte der Farbe haben kann.
         Und „je früher ich Herz anspiele", desto weniger können sie
         abwerfen: diese Farbe vor den anderen. */
      for (const f of ["E", "G", "H", "S"]) {
        if (legal.indexOf(f + "X") < 0 || legal.indexOf(f + "K") < 0) continue;
        if (isTrump(f + "X", g) || offen.indexOf(f + "A") < 0) continue;
        if (offen.filter((c) => c[0] === f && !isTrump(c, g)).length < 3) continue;
        return f + "X";
      }
      return null;
    },
  },
];

/**
 * Die Regeln, die am Buchtisch messbar kosten — beide Saaten gleichsinnig
 * und außerhalb des Fehlermaßes; die Zahl steht bei der Regel unter
 * `kostet`. Der Experte spielt sie trotzdem: er spielt das Buch, auch wo
 * es wehtut, und genau dafür ist er da. Der Fortgeschrittene lässt sie
 * aus und fällt dort auf die Heuristik zurück — das ist, was die Ablation
 * misst, also der gemessen stärkere Tisch.
 *
 * Die Messungen (`sieg`, `tisch`, `deckung`) rufen `buchZug` ohne diese
 * Menge auf und sehen damit weiter jede Regel, auch die teuren.
 */
export const TEURE_REGELN = new Set(SPIELREGELN.filter((r) => r.kostet).map((r) => r.id));

/**
 * Erste passende Buchregel für diese Stellung, sonst null.
 *
 * `ohne` nimmt einzelne Regeln heraus. Das braucht die Messung in
 * `test/buchsieg.js`: nur wenn man eine Regel abschalten und dieselben
 * Blätter noch einmal spielen kann, lässt sich sagen, was sie kostet.
 */
export function buchZug(st, p, ohne) {
  const legal = legalCards(st, p);
  if (legal.length < 2) return null;
  for (const r of SPIELREGELN) {
    if (ohne && ohne.has(r.id)) continue;
    const card = r.zug(st, p, legal);
    if (card && legal.indexOf(card) >= 0) return { card, regelId: r.id, seite: r.seite };
  }
  return null;
}

/**
 * Alle Regeln, die auf diese Stellung passen — nicht nur die erste.
 *
 * `buchZug` nimmt den ersten Treffer, und genau da versteckt sich der
 * teuerste stille Fehler: eine allgemein formulierte Regel weiter oben
 * verdeckt eine speziellere weiter unten, und die speziellere kommt nie
 * zum Zug. Abgeschaltet wird sie in der Messung dann als wirkungslos
 * ausgewiesen — obwohl sie nur nie gefragt wurde.
 *
 * `test/deckung.js` spielt damit jede Stellung doppelt aus: einmal wie
 * die Bots (erster Treffer) und einmal vollstaendig, und meldet jedes
 * Paar, bei dem die verdeckte Regel eine *andere* Karte wollte.
 */
export function alleBuchZuege(st, p) {
  const legal = legalCards(st, p);
  if (legal.length < 2) return [];
  const out = [];
  for (const r of SPIELREGELN) {
    const card = r.zug(st, p, legal);
    if (card && legal.indexOf(card) >= 0) out.push({ card, regelId: r.id, seite: r.seite });
  }
  return out;
}

/** Eine Regel an ihrer Kennung — fuer die Nachbesprechung, die sie zitiert. */
export function buchRegel(id) {
  return SPIELREGELN.find((r) => r.id === id) || null;
}
