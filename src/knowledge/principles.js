/* ============================================================
   TAKTIK-WISSEN
   Jede Regel hat eine feste id. Die Analyse im Spiel (tacticalNotes)
   liefert genau diese ids zurück — dadurch hängt an jedem Fehler
   sofort das passende Prinzip.

   Buchinhalte gehören NICHT hier hinein, sondern in book.js:
   dort wird pro id ergänzt, wo es im Buch steht und wie es dort
   begründet wird. So bleibt Spiellogik und Buchwissen getrennt.
   ============================================================ */

export const PRINCIPLES = [
  {
    id: "schmieren-an-gegner",
    titel: "Nur schmieren, wenn der Stich sicher ist",
    bereich: "Schmieren",
    kurz: "Zehner und Sau gehören in Stiche, die deine Partei sicher hat.",
    lang:
      "Augen, die du in einen gegnerischen Stich wirfst, zählst du selbst gegen dich. Sicher ist ein Stich erst, wenn dein Partner mit einem hohen Trumpf vorne liegt oder wenn du als Letzter am Zug bist und niemand mehr überstechen kann. In allen anderen Fällen wirfst du die kleinste Karte ab.",
  },
  {
    id: "schmieren-verpasst",
    titel: "Sichere Stiche füttern",
    bereich: "Schmieren",
    kurz: "Hat der Partner den Stich sicher, gehören die Augen hinein.",
    lang:
      "Ein Spiel entscheidet sich bei 61 Augen, nicht bei der Zahl der Stiche. Wer die eigenen Zehner bis zum Schluss aufhebt, verschenkt sie meistens: am Ende hat der Gegner die Farbe längst abgezogen, und die Augen bleiben ungenutzt in der Hand.",
  },
  {
    id: "zu-hoch-gestochen",
    titel: "So niedrig stechen wie möglich",
    bereich: "Trumpf",
    kurz: "Nimm den Stich mit der kleinsten Karte, die reicht.",
    lang:
      "Hohe Trümpfe sind Kontrolle über spätere Stiche. Wer den Eichel-Ober für einen Stich verbraucht, den auch der Schellen-Unter geholt hätte, hat nichts gewonnen und eine Waffe weniger für den Moment, in dem es wirklich um Augen geht.",
  },
  {
    id: "unnoetig-getrumpft",
    titel: "Nicht für leere Stiche trumpfen",
    bereich: "Trumpf",
    kurz: "Ein Stich ohne Augen ist keinen Trumpf wert.",
    lang:
      "Trumpflänge ist der Vorteil, den du am Ende ausspielst. Für vier oder fünf Augen einen Trumpf zu opfern, verkürzt deine Hand, ohne dass es zählt. Ausnahme: du willst gezielt eine Farbe abstechen, in der der Gegner stark ist.",
  },
  {
    id: "trumpf-dem-spieler",
    titel: "Als Gegenspieler keinen Trumpf anspielen",
    bereich: "Anspiel",
    kurz: "Trumpf anspielen hilft fast immer der Spielerpartei.",
    lang:
      "Der Spieler hat die längere und bessere Trumpffarbe angesagt — jeder Trumpfstich, den du erzwingst, arbeitet für ihn. Als Gegenspieler spielst du Farbe an, am liebsten eine, in der dein Partner stechen oder eine Sau setzen kann.",
  },
  {
    id: "blanke-sau",
    titel: "Blanke Farbsau",
    bereich: "Anspiel",
    kurz: "Eine einzelne Sau anspielen gibt die Farbe aus der Hand.",
    lang:
      "Spielst du deine einzige Karte einer Farbe an, bist du danach frei — das kann gewollt sein, wenn du abstechen willst. Es heißt aber auch: die restlichen Augen dieser Farbe holt später jemand anderes. Mit wenig Trumpf ist das selten ein guter Tausch.",
  },
  {
    id: "ruf-zu-frueh",
    titel: "Erst Trumpf ziehen, dann suchen",
    bereich: "Sauspiel",
    kurz: "Mit langem Trumpf zieht der Spieler zuerst Trumpf.",
    lang:
      "Trumpf ziehen nimmt den Gegnern die Möglichkeit, deine Farbstiche abzustechen. Erst wenn die gefährlichen Trümpfe draußen sind, suchst du die Rufsau. Umgekehrt gilt: mit kurzem Trumpf suchst du früh, weil du deinen Partner brauchst.",
  },
  {
    id: "davonlaufen",
    titel: "Davonlaufen mit vier Ruffarbkarten",
    bereich: "Sauspiel",
    kurz: "Vier Karten der Ruffarbe erlauben, die Farbe klein anzuspielen.",
    lang:
      "Wer die gerufene Sau und mindestens drei weitere Karten dieser Farbe hält, darf eine kleine davon anspielen und läuft damit davon: die Sau ist danach frei und muss nicht mehr zugegeben werden. Der Sinn ist, dass der Gegner die Farbe nicht abstechen kann, solange die Sau noch gebunden wäre.",
  },
  {
    id: "partner-suchen",
    titel: "Vor dem Suchen wissen, wen man sucht",
    bereich: "Sauspiel",
    kurz: "Die Ruffarbe verrät die Partnerschaft — überlege, wann das nützt.",
    lang:
      "Solange die Rufsau nicht gefallen ist, wissen nur zwei Spieler sicher, wer zusammengehört. Diese Unklarheit schadet den Gegnern mehr als der Spielerpartei. Zieh den Moment des Suchens deshalb bewusst, statt ihn zu verschenken.",
  },
  {
    id: "wenz-farbe",
    titel: "Im Wenz zählt die Farblänge",
    bereich: "Wenz",
    kurz: "Vier Unter sind wenig wert ohne lange, hohe Farbe.",
    lang:
      "Im Wenz gibt es nur vier Trümpfe. Gewonnen wird über Farben: eine lange Farbe mit Sau und Zehner bringt mehrere Stiche hintereinander, weil dir nach zwei Runden niemand mehr folgen kann. Kurze, hohe Farben sind gefährlich, lange, hohe Farben sind Gold.",
  },
  {
    id: "solo-laenge",
    titel: "Solo braucht Länge, nicht nur Höhe",
    bereich: "Solo",
    kurz: "Sechs mittlere Trümpfe schlagen vier hohe.",
    lang:
      "Beim Farbsolo spielst du allein gegen drei. Mit sechs Trümpfen kannst du die Gegner leerziehen und danach deine Farbstiche in Ruhe abziehen. Mit vier hohen Trümpfen holst du vier Stiche und siehst danach zu, wie die Gegner ihre Augen abräumen.",
  },
  {
    id: "augen-zaehlen",
    titel: "Mitzählen statt schätzen",
    bereich: "Grundlagen",
    kurz: "61 Augen gewinnen — merke dir, was schon liegt.",
    lang:
      "Es gibt 120 Augen: vier Sauen zu 11, vier Zehner zu 10, dazu Könige (4), Ober (3) und Unter (2). Wer grob mitzählt, weiß im sechsten Stich, ob er noch angreifen muss oder nur noch halten. Das ist die eine Gewohnheit, die am schnellsten Spiele gewinnt.",
  },
];

export const RULES = [
  {
    id: "regel-trumpf",
    titel: "Was ist Trumpf?",
    text:
      "Im Sauspiel und im Farbsolo sind alle acht Ober und Unter Trumpf, dazu die ganze Trumpffarbe (Herz beim Sauspiel, die angesagte Farbe beim Solo) — zusammen 14 Trümpfe. Im Wenz sind nur die vier Unter Trumpf; die Ober sind dort normale Farbkarten und stehen im Rang zwischen König und Neuner.",
  },
  {
    id: "regel-reihenfolge",
    titel: "Rangfolge",
    text:
      "Ober vor Unter, innerhalb beider: Eichel, Gras, Herz, Schellen. Danach die Trumpffarbe von Sau über Zehner, König, Neuner, Achter bis Siebener. In den Farben gilt dieselbe Reihenfolge ohne Ober und Unter.",
  },
  {
    id: "regel-augen",
    titel: "Augen",
    text: "Sau 11, Zehner 10, König 4, Ober 3, Unter 2, der Rest null. Insgesamt 120. Die Spielerpartei gewinnt ab 61 Augen.",
  },
  {
    id: "regel-bedienen",
    titel: "Bedienen",
    text:
      "Es muss die angespielte Farbe bedient werden; Trumpf ist dabei eine eigene Farbe. Wer nicht bedienen kann, darf beliebig abwerfen oder stechen. Der höchste Trumpf gewinnt den Stich, ohne Trumpf die höchste Karte der Anspielfarbe.",
  },
  {
    id: "regel-sauspiel",
    titel: "Sauspiel",
    text:
      "Der Spieler ruft eine Farbsau (Eichel, Gras oder Schellen), die er nicht selbst hat und deren Farbe er mindestens einmal auf der Hand hält. Wer die Sau hat, ist sein Partner — er sagt es nicht, es zeigt sich beim Spielen.",
  },
  {
    id: "regel-rufsau",
    titel: "Rufsau: zugeben und davonlaufen",
    text:
      "Wird die Ruffarbe angespielt, muss der Partner die gerufene Sau zugeben. Verwerfen darf er sie nie. Nur mit mindestens vier Karten dieser Farbe darf er eine kleine davon anspielen (davonlaufen); danach ist die Sau frei.",
  },
  {
    id: "regel-abrechnung",
    titel: "Abrechnung",
    text:
      "Sauspiel 20, Wenz und Solo 50. Dazu 10 für Schneider (die Verliererpartei bleibt unter 31 Augen), 20 für Schwarz (kein einziger Stich) und 10 je Laufendem. Beim Solo zahlen oder kassieren alle drei Gegner einzeln.",
  },
  {
    id: "regel-laufende",
    titel: "Laufende",
    text:
      "Die höchsten Trümpfe in ununterbrochener Folge, beginnend beim Eichel-Ober, wenn sie alle in einer Partei liegen. Ab drei zählen sie im Sauspiel und Solo, ab zwei im Wenz — für beide Seiten gleich.",
  },
];

export const byId = (id) => PRINCIPLES.find((p) => p.id === id) || null;
