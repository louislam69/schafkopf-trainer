/* ============================================================
   GLOSSAR (Seiten 240–242)

   Die Fachwörter, in denen das ganze Buch geschrieben ist. Ohne
   sie sind die Merksätze in `buecher.js` stellenweise nicht zu
   verstehen: „Ich schinde keine Sau, solange der Alleinspieler
   noch einen Spatz haben könnte“ setzt voraus, dass man weiß,
   was schinden und was ein Spatz ist.

   Aufgehoben ist es hier und nicht in `principles.js`, weil dort
   die eigenen Taktikregeln stehen — das Glossar ist Buchtext.

   `siehe` verweist auf andere Einträge desselben Glossars; das
   Buch kursiviert diese Wörter im Fließtext. `regelId` steht
   dort, wo ein Begriff einen eigenen Merksatz hat.
   ============================================================ */

export const GLOSSAR = [
  { wort: "Abspatzen", text: "eine Karte einer Fehlfarbe zugeben" },
  { wort: "Alleinspiel", text: "Solo, Wenz oder Farbwenz; im Gegensatz zu Rufspiel, Sauspiel", siehe: ["Rufspiel", "Sauspiel"] },
  { wort: "Alte", text: "der Alte: der Eichel-Ober" },
  { wort: "Annageln", text: "den höchsten verbliebenen Trumpf zugeben, um einen Stich sicher zu bekommen; auch festhalten", siehe: ["Festhalten"] },
  { wort: "Anreichern", text: "eine punktreiche Karte in den Stich legen, um die Gesamtpunktezahl im Stich zu erhöhen", regelId: "fuenfzehn-punkte-anbieten" },
  { wort: "Anziehen", text: "den oder die höchsten verbliebenen Trümpfe ausspielen, um gegnerische Trümpfe zu ziehen; auch ziehen", siehe: ["Ziehen"] },
  { wort: "Ausspieler", text: "der Mitspieler, der die erste Karte einer Runde spielen muss", siehe: ["Vorhand"] },
  { wort: "Ausweichen", text: "durch Zugeben einer kleineren Karte auf einen Stich verzichten; auch unterstehen", siehe: ["Unterstehen"], regelId: "stechen-oder-unterstehen" },
  { wort: "Bereinigen", text: "sein Blatt bereinigen: sich in einer Farbe freimachen oder einen alleinstehenden, kleinen Trumpf abwerfen", siehe: ["Frei"], regelId: "letzten-trumpf-abwerfen" },
  { wort: "Besetzt", text: "eine dreifach besetzte Sau: eine Sau, zu der ich zwei weitere Karten der gleichen Farbe besitze – also insgesamt drei Karten dieser Farbe", regelId: "dreifach-besetzte-zehn" },
  { wort: "Blank", text: "eine blanke Karte: eine alleinstehende Farbkarte oder ein alleinstehender Trumpf" },
  { wort: "Blaue", text: "der Blaue: der Gras-Ober" },
  { wort: "Bock", text: "die höchste Karte einer Farbe, die sich noch im Spiel befindet", regelId: "auf-einen-wenz-eine-sau" },
  { wort: "Bremser", text: "der höchste Trumpf, der die Anzahl der Laufenden begrenzt", siehe: ["Laufende"] },
  { wort: "Davonlaufen", text: "mit vier Karten der Ruffarbe unter der Sau ausspielen", siehe: ["Ruffarbe"], regelId: "nicht-davonlaufen-nach-abspatzen" },
  { wort: "Durchgehen", text: "die Rufsau geht durch: die Rufsau wird nicht gestochen", regelId: "rufsau-nicht-stechen" },
  { wort: "Farbeln", text: "als gerufener Partner eine Farbkarte statt einer Trumpfkarte ausspielen", regelId: "freie-farbe-anzeigen" },
  { wort: "Fehlkarte", text: "eine Karte im Alleinspiel, die kein Trumpf und keine Sau ist", siehe: ["Alleinspiel"] },
  { wort: "Festhalten", text: "den höchsten verbliebenen Trumpf zugeben, um einen Stich sicher zu bekommen; auch annageln", siehe: ["Annageln"] },
  { wort: "Fett", text: "ein fetter Stich: ein punktreicher Stich mit mindestens 20 Punkten" },
  { wort: "Flöte", text: "viele Karten einer Farbe einschließlich der hohen Karten" },
  { wort: "Frei", text: "eine Farbe frei sein: keine Karte dieser Farbe haben", regelId: "freie-farbe-anzeigen" },
  { wort: "Gesperrt", text: "gesperrt sein: mangels einer geeigneten Farbe kein Rufspiel ansagen können", siehe: ["Rufspiel"] },
  { wort: "Hinterhand", text: "ein an Position 4 sitzender Spieler" },
  { wort: "Laufende", text: "ununterbrochene Reihe der höchsten Trümpfe des Spiels" },
  { wort: "Lusche", text: "eine Farbkarte ohne Punktwert" },
  { wort: "Mittelhand", text: "ein an Position 2 oder 3 sitzender Spieler", regelId: "spielmacher-in-mittelhand" },
  { wort: "Oma-Spiel", text: "ein sehr starkes Spiel, das ich nicht verlieren kann (ein Spiel, das auch meine Oma gewinnen würde)" },
  { wort: "Ranggleich", text: "ranggleiche Karten: eine nicht unterbrochene Abfolge von Karten", regelId: "ranggleiche-von-unten" },
  { wort: "Rote", text: "der Rote: der Herz-Ober" },
  { wort: "Rufende", text: "der Spielmacher im Rufspiel", siehe: ["Rufspiel"] },
  { wort: "Ruffarbe", text: "die Farbe der gerufenen Sau" },
  { wort: "Rufspiel", text: "Sauspiel, Partnerspiel; im Gegensatz zu Alleinspiel", siehe: ["Sauspiel", "Alleinspiel"] },
  { wort: "Sauspiel", text: "Rufspiel, Partnerspiel; im Gegensatz zu Alleinspiel", siehe: ["Rufspiel", "Alleinspiel"] },
  { wort: "Schinden", text: "auf das Ausspielen oder Zugeben einer Sau verzichten", regelId: "nicht-die-sau-schinden" },
  { wort: "Schmieren", text: "eine punktreiche Karte zugeben", regelId: "schmieren-oder-stechen" },
  { wort: "Schmierkarte", text: "eine punktreiche Karte, also Zehn oder Sau; auch Volle", siehe: ["Volle"], regelId: "schmierkarten-schonen" },
  { wort: "Schmiertrumpf", text: "die Zehn oder Sau der Trumpffarbe", regelId: "hohen-trumpf-opfern" },
  { wort: "Schneider", text: "Schneider werden: weniger als 31 (Spieler) bzw. 30 Punkte (Nichtspieler) erreichen" },
  { wort: "Schneiderfrei", text: "Schneiderfrei werden: mehr als 30 (Spieler) bzw. 29 Punkte (Nichtspieler) erreichen" },
  { wort: "Schwarz", text: "Schwarz werden: in einem Spiel keinen Stich machen", regelId: "nicht-schwarz-werden" },
  { wort: "Spatz", text: "eine Karte ohne Punktwert (Sauspiel) bzw. eine Fehlkarte (Alleinspiel)", siehe: ["Fehlkarte", "Sauspiel", "Alleinspiel"], regelId: "spatzen-spielen-wenn-gegner-trumpflos" },
  { wort: "Spritze", text: "eine Spritze geben: als Gegenspieler im Glauben an den eigenen Sieg den Spielwert verdoppeln", regelId: "spritze-voraussetzung" },
  { wort: "Teuer", text: "ein teurer Stich: ein punktreicher Stich" },
  { wort: "Tout", text: "gesprochen „Du“: Spielansage des Alleinspielers, alle Stiche zu machen", siehe: ["Alleinspiel"], regelId: "gegen-tout-laengste-farbe-ohne-sau" },
  { wort: "Unterstehen", text: "durch Zugeben einer kleineren Karte auf einen Stich verzichten; auch ausweichen", siehe: ["Ausweichen"], regelId: "stechen-oder-unterstehen" },
  { wort: "Verteidiger", text: "einer der Gegenspieler im Alleinspiel", siehe: ["Alleinspiel"] },
  { wort: "Volle", text: "eine „mit Punkten volle“ Schmierkarte, also Zehn oder Sau", siehe: ["Schmierkarte"] },
  { wort: "Vorhand", text: "ein an Position 1 sitzender Spieler, der Ausspieler", siehe: ["Ausspieler"] },
  { wort: "Vorstechen", text: "vor dem Alleinspieler sitzend mit Trumpf einstechen", siehe: ["Alleinspiel"], regelId: "vorstechen" },
  { wort: "Ziehen", text: "den oder die höchsten verbliebenen Trümpfe ausspielen, um gegnerische Trümpfe zu bekommen; auch anziehen", siehe: ["Anziehen"] },
  { wort: "Zusammenwerfen", text: "ein neues Spiel ausgeben, nachdem niemand ein Spiel ansagen wollte" },
  { wort: "Zwickmühle", text: "in eine Zwickmühle bringen: Eine bereits gespielte Farbe gegen einen Spielmacher in Mittelhand nachspielen", siehe: ["Mittelhand"], regelId: "zwickmuehle-vermeiden" },
];

export const SEITEN = [240, 242];

export const begriff = (wort) =>
  GLOSSAR.find((g) => g.wort.toLowerCase() === String(wort).toLowerCase()) || null;
