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
  makeDeck, trickWinner, gelesenesSignal, trumpSuitOf, relation,
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

/** Karten, die weder gespielt sind noch auf meiner Hand liegen */
function unbekannt(st, p) {
  const weg = {};
  st.hands[p].forEach((c) => (weg[c] = 1));
  st.tricks.forEach((t) => t.plays.forEach((x) => (weg[x.card] = 1)));
  st.trick.forEach((x) => (weg[x.card] = 1));
  return makeDeck().filter((c) => !weg[c]);
}

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
      if (st.trick.length || !haeltSau(st, p) || !st.tricks.length) return null;
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
         gestützt auf ein Kapitel, das davon nichts sagt.
         Offen, und bewusst nicht hier geändert: die Stellung des Buches
         (S. 46) ist die andere — der Spielmacher sucht in der Ruffarbe,
         die Rufsau ist gefallen. Dort greift die Regel wegen `haeltSau`
         gar nicht. Sie zu erweitern hieße, eine Regel des Gerufenen
         auszubauen, bevor ARBEITSSTAND Aufgabe 1 geklärt ist. */
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
      if (st.trick.length || !haeltSau(st, p)) return null;
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
      if (st.trick.length || !haeltSau(st, p)) return null;
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
         Zwei standen hier, die dritte fehlte. */
      if (legal.filter((c) => HOHE_OBER.indexOf(c) >= 0).length >= 2) return null;
      if (st.trick.slice(0, 2).some((x) => points(x.card) >= 10)) return null;
      return legal.indexOf(meineRuf[0]) >= 0 ? meineRuf[0] : null;
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
    id: "freie-farbe-anzeigen",
    seite: 49,
    kurz: "Als Partner mit wenig Trumpf die dritte Farbe anspielen, um die freie Farbe zu zeigen.",
    zug(st, p, legal) {
      if (st.trick.length || !st.partnerKnown || st.partner !== p) return null;
      /* „Habe ich nur wenige KLEINE Truempfe, hilft Trumpf ziehen dem
         Spielmacher wenig." Geprueft wurde bisher nur „wenige". Mit
         drei Truempfen, darunter ein Ober, hilft Trumpf ziehen sehr
         wohl — dann ist das Signal nicht bloss unnoetig, es kostet
         den Zug, mit dem man haette ziehen sollen. */
      const meineTruempfe = st.hands[p].filter((c) => isTrump(c, st.game));
      if (meineTruempfe.length > 3) return null;
      if (meineTruempfe.some((c) => c[1] === "O")) return null;
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
    seite: 57,
    kurz: "Nach einer Spritze spielt die Spielerpartei Farbe statt Trumpf — und die Gegenpartei Trumpf.",
    zug(st, p, legal) {
      if (st.trick.length || !st.kontra) return null;
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
        const truempfe = legal.filter((c) => isTrump(c, st.game));
        if (!truempfe.length) return null;
        return truempfe.sort((a, b) => power(a, st.game) - power(b, st.game))[0];
      }
      if (knowsOwnSide(st, p)) {
        /* Kapitel 2.10 für den Partner: keinen Trumpf mehr, sondern
           „mein Glück in den Farben, am liebsten mit einer blanken
           Karte". Blank heißt: die einzige Karte dieser Farbe auf der
           Hand — gezählt wird deshalb die Hand und nicht `legal`, wo
           der Bedienzwang jede Farbe blank aussehen lassen kann. */
        const farben = legal.filter((c) => !isTrump(c, st.game));
        if (!farben.length) return null;
        const inDerHand = (f) => st.hands[p].filter((c) => !isTrump(c, st.game) && c[0] === f).length;
        const blank = farben.filter((c) => inDerHand(c[0]) === 1);
        const wahl = blank.length ? blank : farben;
        return wahl.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
      }
      /* Und auf der Gegenseite spielt nur der Trumpf, der die Spritze
         gegeben hat: er hat damit behauptet, trumpfstark zu sein.
         Seine Partner haben nichts dergleichen gesagt. */
      if (p !== st.kontraVon) return null;
      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (!truempfe.length) return null;
      return truempfe.sort((a, b) => power(b, st.game) - power(a, st.game))[0];
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
    id: "anspiel-farbe-ohne-sau",
    seite: 69,
    kurz: "Als Gegenspieler ohne Karte der Ruffarbe eine Farbe anspielen, in der ich keine Sau habe.",
    zug(st, p, legal) {
      if (st.trick.length || knowsOwnSide(st, p) || haeltSau(st, p)) return null;
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

         `relation` liefert nur gesichertes Wissen: -1 heißt „das ist
         nachweislich ein Gegner". Für einen Nichtspieler im Sauspiel
         ist das vor dem Fall der Rufsau genau der Spielmacher — und
         das ist die einzige Spielerpartei, die er kennen kann. */
      const hinten = (st.trick[0].p + 3) % 4;
      if (relation(st, p, st.trick[0].p) !== -1) return null;   // die Spielerpartei spielt an
      /* Und zwar `=== 1`, nicht bloß „nicht nachweislich ein Gegner":
         der Rat lebt davon, dass der Partner den Stich noch holt. Wer
         die Trumpf-Sau auf gut Glück hinter einen Ober des
         Spielmachers legt, schenkt ihm in der Hälfte der Fälle elf
         Augen. Im Solo weiß jeder Gegenspieler das ohnehin; im
         Sauspiel weiß er es, sobald die Rufsau gefallen ist — und
         genau dann malt das Buch dieses Bild. */
      if (relation(st, p, hinten) !== 1) return null;          // hinten sitzt sicher mein Partner

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
      if (relation(st, p, hinten) === -1) return null;          // hinten mein Partner
      if (relation(st, p, st.trick[0].p) !== -1) return null;   // angespielt hat die Spielerpartei

      const truempfe = legal.filter((c) => isTrump(c, st.game));
      if (truempfe.length < 2) return null;
      // nur sinnvoll, wenn ich den Stich ohnehin nicht sicher halten kann
      const hoeher = truempfe.filter((c) => power(c, st.game) > power(gelegt, st.game));
      if (hoeher.length && hoeher.some((c) => c[1] === "O" && "EG".indexOf(c[0]) >= 0)) return null;
      return truempfe.sort((a, b) => points(a) - points(b) || power(a, st.game) - power(b, st.game))[0];
    },
  },
];

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
