import { SUITNAME, RANKNAME, isTrump, points } from "./engine.js";

/* ============================================================
   DAS KARTENBILD

   Die Karten werden gezeichnet, nicht geladen: reines SVG im
   Markup. Das bleibt in jeder Größe scharf, folgt der Farbgebung
   des Themes und kostet keine einzige Datei — die App bleibt
   offline vollständig.

   Warum kein fertiges Deck: ein vollständiges, das man nehmen darf,
   gibt es nicht. Das einzige komplette bayerische SVG-Blatt
   (benni0815/SchafKopf) steht unter CC BY-NC-SA, das zweite (KDE,
   Dominik Seichter) unter GPL — beide stecken ein öffentliches Repo
   an. Die gemeinfreien Museumsscans (Commons, Kategorie Regensburg
   pattern) sind echte alte Karten, aber ohne Eckzeichen und mit der
   Zehn als winzigem „X": im engen Fächer, wo von der Karte nur die
   Ecke zu sehen ist, unlesbar.

   Die Farbzeichen dagegen sind übernommen, nicht nachgezeichnet —
   siehe unten. Dass sie zuerst als unbrauchbar galten, lag nicht an
   ihnen: sie sind mehrfarbig, und das Blatt war einfarbig über
   currentColor eingefärbt. Seit die Bildfiguren ihre eigenen Farben
   tragen, passen sie ohne Weiteres.

   Aufgebaut wie ein bayerisches Blatt:
   - Zahlkarten (7, 8, 9, 10) tragen ihre Farbzeichen in zwei
     Spalten, die untere Hälfte auf dem Kopf wie beim echten Blatt.
   - Die Sau zeigt ein einzelnes großes Zeichen.
   - König, Ober und Unter tragen jeder seine eigene Figur, gezeichnet
     nach den alten Bogen — siehe den Abschnitt DIE BILDFIGUREN.

   WICHTIG für test/ui.smoke.js: im Inneren einer Karte stehen nur
   <span> und <svg>. Der DOM-Ersatz zählt <button>, <div>, <details>
   und <li> als Elemente — ein <div> hier drin würde als zusätzliche
   Karte gezählt.
   ============================================================ */

/* Die Farbzeichen sind die gemeinfreien Zeichnungen von „Infanf" aus
   Wikimedia Commons (Bay_eichel/gras/herz/schellen.svg, Public
   Domain) — dieselben, die der Wikipedia-Artikel zum Schafkopf
   zeigt. Übernommen wie sie sind, nur die Farben in Token gehoben.

   Zwei Fassungen je Zeichen. „voll" ist die Vorlage samt Schraffur,
   „einfach" nur die tragenden Flächen. Die Schraffur ist bei 9 px
   Pipgröße Grieß, und die Schelle allein bringt 75 Elemente mit — bei
   zehn Pips je Karte, acht Karten auf der Hand, wäre das Markup um
   ein Vielfaches länger, ohne dass man etwas davon sähe. */
const PATHS = {
  // Eichel
  E: {
    box: "0 0 66 121",
    boxKlein: "0 0 66 97",
    voll: `<path style="fill:var(--b-gelb);stroke:var(--b-linie);" d="M13 21 Q13 1 33 1 L33 52 L13 52 Z"/><path style="fill:var(--b-rot);stroke:var(--b-linie);" d="M33 1 Q53 1 53 21 L53 52 L33 52 Z"/><path style="fill:var(--b-blau);stroke:var(--b-linie);" d="M13 52 L33 52 L33 62 L13 62 Z"/><path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M37 96 Q37 119 16 119 L24 110 Q25 109 27 108 Q29 107 29 102 L29 96"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M27 108 Q31.2 108 31.2 110.5 Q31.2 114 29 115.57"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M35 96 Q35 107 31 111"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 96 Q33 102 31.5 106"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M20 117 L26 111 Q28 109 29 111 Q29.5 112 28 113"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M33 52 L33 62 L53 62 L53 52 Z"/><path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M13 62 Q1 62 1 74 Q1 96 33 96 Q64 96 64 74 Q64 62 54 62 Z"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M33 66.5 Q28.5 66.5 28.5 71 Q28.5 77 33 87 Q37.5 77 37.5 71 Q37.5 66.5 33 66.5"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M21 89 Q10 80 10 74 Q10 67 15 67 Q17 67 17 71 Q17 72 16.5 73 Q16 74 16 75 Q16 80 21 89"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M45 89 Q56 80 56 74 Q56 67 51 67 Q49 67 49 71 Q49 72 49.5 73 Q50 74 50 75 Q50 80 45 89"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 62 L33 96"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M35.86 1 L35.86 96"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M38.7 1.8 L38.7 96"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M41.6 2.7 L41.6 95"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M44.4 3 L44.4 95"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M47.3 5.4 L47.3 94.6"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M50.1 8.8 L50.1 93.7"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M53 62 L53 92.6"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M55.8 62.3 L55.8 91"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M58.7 63 L58.7 88.6"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M61.6 65 L61.6 84.7"/>`,
    einfach: `<path style="fill:var(--b-gelb);stroke:var(--b-linie);" d="M13 21 Q13 1 33 1 L33 52 L13 52 Z"/><path style="fill:var(--b-rot);stroke:var(--b-linie);" d="M33 1 Q53 1 53 21 L53 52 L33 52 Z"/><path style="fill:var(--b-blau);stroke:var(--b-linie);" d="M13 52 L33 52 L33 62 L13 62 Z"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M33 52 L33 62 L53 62 L53 52 Z"/><path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M13 62 Q1 62 1 74 Q1 96 33 96 Q64 96 64 74 Q64 62 54 62 Z"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M33 66.5 Q28.5 66.5 28.5 71 Q28.5 77 33 87 Q37.5 77 37.5 71 Q37.5 66.5 33 66.5"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M21 89 Q10 80 10 74 Q10 67 15 67 Q17 67 17 71 Q17 72 16.5 73 Q16 74 16 75 Q16 80 21 89"/><path style="fill:var(--b-linie);stroke:var(--b-linie);" d="M45 89 Q56 80 56 74 Q56 67 51 67 Q49 67 49 71 Q49 72 49.5 73 Q50 74 50 75 Q50 80 45 89"/>`,
  },
  // Gras (Grün, Laub)
  G: {
    box: "0 0 66 73",
    voll: `<path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M35 54 Q34 64 28 68 Q25 69 24 72 Q22 69 25 66 Q33 60 30 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33.5 54 Q32.5 64 27.5 66.5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M25 66 C26 65 28 65 28 68"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M25 70.4 C24.7 67 27 67 26 68"/><path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M33 1 Q24 14 12 24 Q1 33.5 1 47 Q1 63 18 63 Q26 63 33 56 Q40 63 48 63 Q65 63 65 47 Q65 33.5 54 24 Q42 14 33 1"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 1 L33 56 M35 4 L35 57.8 M37 6.7 L37 59.3 M39 9 L39 60.8 M41 11.3 L41 61.5 M43 13.7 L43 62 M45 16 L45 62.5 M47 18 L47 63 M49 19.7 L49 63 M51 21.5 L51 63 M53 23.5 L53 62.7 M55 25.2 L55 62.2 M57 27 L57 61.5 M59 29.3 L59 60.3 M61 32.3 L61 58.8 M63 37 L63 55.5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M28 18 Q38 25 46 21 M38 18 Q28 25 20 21 M27 22.5 Q23 22.5 19 25 M39 22.5 Q43 22.5 47 25"/><path class="fein" transform="translate(-23,12) scale(1.7,1)" style="fill:none;stroke:var(--b-linie);" d="M28 18 Q38 25 46 21 M38 18 Q28 25 20 21 M27 22.5 Q23 22.5 19 25 M39 22.5 Q43 22.5 47 25"/><path class="fein" transform="translate(-33,24) scale(2,1)" style="fill:none;stroke:var(--b-linie);" d="M28 18 Q38 25 46 21 M38 18 Q28 25 20 21 M27 22.5 Q23 22.5 19 25 M39 22.5 Q43 22.5 47 25"/>`,
    einfach: `<path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M35 54 Q34 64 28 68 Q25 69 24 72 Q22 69 25 66 Q33 60 30 54"/><path style="fill:var(--b-gruen);stroke:var(--b-linie);" d="M33 1 Q24 14 12 24 Q1 33.5 1 47 Q1 63 18 63 Q26 63 33 56 Q40 63 48 63 Q65 63 65 47 Q65 33.5 54 24 Q42 14 33 1"/>`,
  },
  // Herz
  H: {
    box: "0 0 66 64",
    voll: `<path style="fill:var(--b-rot-herz);stroke:var(--b-linie);" d="M33 64 Q24 50 12 40 Q1 30.5 1 17 Q1 1 18 1 Q26 1 33 8 Q40 1 48 1 Q65 1 65 17 Q65 30.5 54 40 Q42 50 33 64"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 8 L33 64 M35 6.2 L35 61 M37 4.7 L37 58 M39 3.7 L39 55.7 M41 2.8 L41 53.3 M43 2 L43 51 M45 1.5 L45 48.6 M47 1 L47 46.4 M49 1 L49 44.3 M51 1 L51 42.4 M53 1.3 L53 40.5 M55 1.7 L55 38.8 M57 2.5 L57 37 M59 3.7 L59 34.7 M61 5.2 L61 32.3 M63 8 L63 28"/>`,
    einfach: `<path style="fill:var(--b-rot-herz);stroke:var(--b-linie);" d="M33 64 Q24 50 12 40 Q1 30.5 1 17 Q1 1 18 1 Q26 1 33 8 Q40 1 48 1 Q65 1 65 17 Q65 30.5 54 40 Q42 50 33 64"/>`,
  },
  // Schellen
  S: {
    box: "0 0 66 72",
    voll: `<circle style="stroke:var(--b-linie);fill:var(--b-gruen);" cx="33" cy="65" r="5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 65 L33 70"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M35 65 L35 69"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M37 65 L37 68"/><circle style="stroke:none;fill:var(--b-gelb);" cx="33" cy="33" r="32"/><path style="fill:var(--b-rot);stroke:none;" d="M2.5 23 L63.5 23 Q67 33 63.5 43 L2.5 43 Q-1 33 2.5 23"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M63 23 L63 43"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M6 43 L6 50"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M9 43 L9 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M12 43 L12 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M15 43 L15 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M18 43 L18 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M21 43 L21 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M24 43 L24 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M27 43 L27 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M30 43 L30 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 23 L33 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M36 23 L36 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M39 23 L39 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M42 23 L42 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M45 23 L45 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M48 23 L48 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M51 23 L51 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M54 23 L54 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M57 23 L57 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M60 23 L60 50"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M27 48 Q25.5 45.5 19 43 Q15 45 15 50 L29 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M39 48 Q40.5 45.5 47 43 Q51 45 51 50 L37 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M29 65 Q20 50 33 43 Q46 50 37 65"/><path style="stroke:none;fill:var(--b-gruen);" d="M3.1 43 L2.8 43 Q6.5 60 29.4 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M29 65 Q21 52 15 50 Q8 47 2.8 43"/><path style="stroke:none;fill:var(--b-gruen);" d="M62.9 43 L63.2 43 Q59.5 60 36.6 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M37 65 Q45 52 51 50 Q58 47 63.2 43"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 43 L33 65"/><circle style="stroke:var(--b-linie);fill:none;" cx="33" cy="33" r="32"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 1 L33 6.2"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d=" M35 1.2 L35 6"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M31 1.2 L31 6"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M37 1.2 L37 5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M29 1.2 L29 5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M28 1.2 Q28 6.5 33 6.5 Q38 6.5 38 1.2"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M2.8 23 L63.2 23"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M2.8 43 L63.2 43"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 3 L44.5 3"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 6 L50 6"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 9 L54 9"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 12 L57 12"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 15 L59.5 15"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 18 L61 18"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 21 L63 21"/><circle class="fein" style="stroke:var(--b-linie);fill:none;" cx="10" cy="33" r="5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M5 33 L15 33"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M5.2 31 L14.8 31"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M5.2 35 L14.8 35"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M6.8 29 L13.2 29"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M6.8 37 L13.2 37"/><circle class="fein" style="stroke:var(--b-linie);fill:none;" cx="33" cy="33" r="5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M28 33 L38 33"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M28.2 31 L37.8 31"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M28.2 35 L37.8 35"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M29.8 29 L36.2 29"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M29.8 37 L36.2 37"/><circle class="fein" style="stroke:var(--b-linie);fill:none;" cx="56" cy="33" r="5"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M51 33 L61 33"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M51.2 31 L60.8 31"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M51.2 35 L60.8 35"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M52.8 29 L59.2 29"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M52.8 37 L59.2 37"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 63 L44.5 63"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 60 L50 60"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 57 L54 57"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 54 L57 54"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 51 L59.5 51"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 48 L61 48"/><path class="fein" style="fill:none;stroke:var(--b-linie);" d="M33 45 L63 45"/>`,
    einfach: `<circle style="stroke:var(--b-linie);fill:var(--b-gruen);" cx="33" cy="65" r="5"/><circle style="stroke:none;fill:var(--b-gelb);" cx="33" cy="33" r="32"/><path style="fill:var(--b-rot);stroke:none;" d="M2.5 23 L63.5 23 Q67 33 63.5 43 L2.5 43 Q-1 33 2.5 23"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M27 48 Q25.5 45.5 19 43 Q15 45 15 50 L29 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M39 48 Q40.5 45.5 47 43 Q51 45 51 50 L37 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M29 65 Q20 50 33 43 Q46 50 37 65"/><path style="stroke:none;fill:var(--b-gruen);" d="M3.1 43 L2.8 43 Q6.5 60 29.4 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M29 65 Q21 52 15 50 Q8 47 2.8 43"/><path style="stroke:none;fill:var(--b-gruen);" d="M62.9 43 L63.2 43 Q59.5 60 36.6 65"/><path style="stroke:var(--b-linie);fill:var(--b-gruen);" d="M37 65 Q45 52 51 50 Q58 47 63.2 43"/><circle style="stroke:var(--b-linie);fill:none;" cx="33" cy="33" r="32"/>`,
  },
};

/* ============================================================
   DIE BILDFIGUREN

   Gezeichnet nach dem bayerischen Einfachbild von F.A. Lattmann
   (Goslar, um 1900) und den Bogen von C.L. Wüst und Eduard Büttner
   — alle drei gemeinfrei, alle drei einfaches Bild mit Eckzeichen,
   also im selben Aufbau wie diese Karte. Die heutigen Bilder von ASS
   dienten nur zum Abgleich, welche Figur zu welchem Rang gehört;
   gezeichnet ist nach den alten, freien.

   Was das Blatt ausmacht und hier stehen bleibt:
   - Der Unter reißt den Säbel über den Kopf, barhäuptig.
   - Der Ober trägt Hut mit Feder und hält die Hellebarde.
   - Der König sitzt, gekrönt und bärtig, mit Zepter und Hermelin.
   - Die Farben des Blattes: Rot, Grün, Gold, Blau, Weiß.

   Eine Figur je Rang, nicht je Farbe. Im echten Blatt hat jede der
   vier Farben ihre eigene Figur — bei der Größe, in der hier gespielt
   wird, ist davon nichts zu sehen, und welche Farbe es ist, steht im
   Eckzeichen und im großen Farbzeichen daneben.

   Gezeichnet auf 24×32, von hinten nach vorn: erst das Gerät, dann
   die Figur, zuletzt was oben aufliegt.
   ============================================================ */

const FIGUR = {
  // Unter — Säbel über dem Kopf, Rüsche, rotes Wams, grüne Hose
  U: [
    ["blau", "M2.6 11.4C5.2 5.4 11.4 1.8 19.8 2.4l-.2 2.2C12.4 4.1 7 7.2 4.7 12.3z"],
    ["gold", "M18.6 1.4l2.8.6-.9 4-2.8-.6z"],
    ["rot", "M13.8 14.2l3-7 2.6 1.1-3 7z"],
    ["haut", "M17.9 5.2a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"],
    ["linie", "M11.4 3.4c2.8 0 4.5 2 4.2 4.9l-.2 1.7-1.4-.5.2-1.8c-1.5.8-4.1.8-5.6.1l.2 1.7-1.4.5-.2-1.7c-.3-2.9 1.4-4.9 4.2-4.9z"],
    ["haut", "M11.4 5.4c1.6 0 2.8 1.2 2.8 2.8v2.2c0 1.6-1.2 2.8-2.8 2.8s-2.8-1.2-2.8-2.8V8.2c0-1.6 1.2-2.8 2.8-2.8z"],
    ["weiss", "M8.2 12.2c2.1 1 4.3 1 6.4 0l.6 1.8c-2.5 1.2-5.1 1.2-7.6 0z"],
    ["rot", "M8.5 14c1.9.8 3.9.8 5.8 0l1.7 1.1c.8.5 1.2 1.3 1.2 2.2v4.4c0 .6-.5 1-1 1H7.6c-.6 0-1-.4-1-1v-4.4c0-.9.4-1.7 1.2-2.2z"],
    ["rot", "M8.1 14.8l-2.2.8 1.5 5.6 2.2-.8z"],
    ["haut", "M6.6 20.6a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"],
    ["gold", "M10.7 14.6h1.6v5.6h-1.6z"],
    ["gold", "M6.4 20.4h11.2v1.9H6.4z"],
    ["gruen", "M6.9 23h10.2l-.5 3.4c-.1.5-.5.8-1 .8h-2.3l-.7-1.7h-.8l-.7 1.7H8.4c-.5 0-.9-.3-1-.8z"],
    ["gold", "M8.2 27.2h2.7l-.2 3H8.4z"],
    ["gold", "M13.1 27.2h2.7l.2 3h-2.7z"],
    ["rot", "M7.4 30h4v1.8h-4z"],
    ["rot", "M12.6 30h4v1.8h-4z"],
  ],

  // Ober — Hut mit Feder, Hellebarde, grünes Wams
  O: [
    ["gold", "M3.4 4.4h1.8v27.4H3.4z"],
    ["gold", "M3.7 0h1.2v4.4H3.7z"],
    ["blau", "M5.2 1.2c3.7.3 6.3 2 7.2 5-2.7-.9-5.1-.7-7.2.7z"],
    ["rot", "M8.6 3.8C7.2 1.8 7.8.4 10.2.2c-.2 1.8.3 3.2 1.4 4.2z"],
    ["haut", "M12 6c1.6 0 2.8 1.2 2.8 2.8V11c0 1.6-1.2 2.8-2.8 2.8S9.2 12.6 9.2 11V8.8C9.2 7.2 10.4 6 12 6z"],
    ["gruen", "M7.8 5.6c.9-2.1 2.4-3.1 4.4-3.1s3.5 1 4.4 3.1z"],
    ["gruen", "M6.4 5.4c3.6 1.5 7.6 1.5 11.2 0l.4 1.5c-3.9 1.7-8.1 1.7-12 0z"],
    ["gold", "M8 4.8c2.7.9 5.4.9 8.1 0l.3 1.2c-2.9 1-5.8 1-8.7 0z"],
    ["weiss", "M8.9 13.4c2.1.9 4.2.9 6.3 0l.6 1.7c-2.5 1.1-5 1.1-7.5 0z"],
    ["gruen", "M9.2 15.2c1.9.8 3.8.8 5.7 0l1.7 1.1c.8.5 1.3 1.4 1.3 2.3v4.2c0 .6-.5 1-1 1H8.2c-.6 0-1-.4-1-1v-4.2c0-.9.5-1.8 1.3-2.3z"],
    ["rot", "M10.2 16.2a1 1 0 110 2 1 1 0 010-2zM13.8 16.2a1 1 0 110 2 1 1 0 010-2zM10.2 19.4a1 1 0 110 2 1 1 0 010-2zM13.8 19.4a1 1 0 110 2 1 1 0 010-2z"],
    ["gruen", "M8.9 16l-3 1 1.3 4.3 3-1z"],
    ["haut", "M5.5 20.4a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"],
    ["gold", "M7 22.4h11.2v1.9H7z"],
    ["rot", "M7.5 24.4h10.2l-.5 3.2c-.1.5-.5.8-1 .8h-2.3l-.7-1.6h-.8l-.7 1.6H9c-.5 0-.9-.3-1-.8z"],
    ["blau", "M8.8 28.4h2.7l-.2 1.9H9z"],
    ["blau", "M13.7 28.4h2.7l.2 1.9h-2.7z"],
    ["rot", "M8 30.1h4v1.7H8z"],
    ["rot", "M13.2 30.1h4v1.7h-4z"],
  ],

  // König — sitzend, Krone, Bart, Zepter, Hermelin
  K: [
    ["gold", "M14.8 9.6h5.6c1 0 1.7.8 1.7 1.7v13.9h-7.3z"],
    ["rot", "M16.1 11.1h4.6v11.9h-4.6z"],
    ["gold", "M4.6 9.2h1.6v22H4.6z"],
    ["gold", "M5.4 6.6a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6z"],
    ["gold", "M8.6 7.6l-.7-4.4 2.6 1.7 2.4-2.9 2.4 2.9 2.6-1.7-.7 4.4z"],
    ["linie", "M9.4 7.2h6.8v3.4c0 1.5-.6 2.7-1.4 3.6l-.9-1.7-2.8-.2-1 1.9c-.9-.9-1.6-2.1-1.6-3.6z"],
    ["haut", "M12.8 7.6c1.6 0 2.8 1.2 2.8 2.8v1.7c0 1.6-1.2 2.8-2.8 2.8S10 13.7 10 12.1v-1.7c0-1.6 1.2-2.8 2.8-2.8z"],
    ["linie", "M10.4 12.3c1.6.8 3.3.8 4.9 0l-.5 2.7c-.2 1-1 1.8-2 1.8s-1.8-.8-2-1.8z"],
    ["weiss", "M8.8 15.8c2.7 1.4 5.5 1.4 8.2 0l.8 2c-3.1 1.6-6.7 1.6-9.8 0z"],
    ["rot", "M9.1 17.8c2.4 1 5 1 7.4 0l2 1.4c.8.5 1.3 1.5 1.3 2.5v4.2H5.8v-4.2c0-1 .5-2 1.3-2.5z"],
    ["gold", "M12 18.3h1.6v7.6H12z"],
    ["rot", "M8.6 18.6l-2.4.9 1.6 4.8 2.4-.9z"],
    ["haut", "M7.2 23.6a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"],
    ["weiss", "M5.8 26.2h13.7v2.1H5.8z"],
    ["rot", "M6.5 28.3h12.3v2.2H6.5z"],
    ["gold", "M5.6 30.3h14.1v1.4H5.6z"],
  ],
};

export function suitSvg(suit, cls) {
  const z = PATHS[suit];
  const klein = cls === "pip-svg" || cls === "ecke-suit";
  const box = klein && z.boxKlein ? z.boxKlein : z.box;
  return `<svg class="${cls || "suit"}" viewBox="${box}" aria-hidden="true">${klein ? z.einfach : z.voll}</svg>`;
}

/* Die Figur ist mehrfarbig wie im Blatt und trägt deshalb nicht mehr
   die Farbe des Blattes — die steht im Eckzeichen und im großen
   Farbzeichen daneben, genau wie auf der echten Karte. */
const figurSvg = (r) =>
  `<svg class="card-figur" viewBox="0 0 24 32" aria-hidden="true">${FIGUR[r]
    .map(([f, d]) => `<path d="${d}" style="fill:var(--f-${f})"/>`)
    .join("")}</svg>`;

const LABEL = { A: "A", X: "10", K: "K", O: "O", U: "U", "9": "9", "8": "8", "7": "7" };

/* Zahlkarten: wie viele Zeichen je Spalte, und ob eines in der
   Mitte dazukommt. 7 = 3+3+1, 8 = 4+4, 9 = 4+4+1, 10 = 5+5.

   Die Zahl ist die je Spalte — beide Spalten zusammen ergeben den
   Rang. Vorher setzte die Schleife je Spalte und Zeile zwei Zeichen,
   eines von oben und eines von unten gezählt; auf der Acht standen
   dadurch sechzehn. Gezählt hat das nie jemand, gesehen hat man es
   als Gedränge. */
const PIPS = { "7": [3, true], "8": [4, false], "9": [4, true], X: [5, false] };

function pipFeld(suit, rank) {
  const [reihen, mitte] = PIPS[rank];
  let out = "";
  for (let r = 1; r <= reihen; r++) {
    /* Die obere Hälfte steht, die untere steht kopf — genau wie auf
       einer echten Karte, damit sie von beiden Seiten lesbar ist. */
    const kopf = r > (reihen + 1) / 2 ? " is-kopf" : "";
    for (const spalte of [1, 2]) {
      out += `<span class="pip${kopf}" style="grid-row:${r};grid-column:${spalte}">${suitSvg(suit, "pip-svg")}</span>`;
    }
  }
  /* Das mittlere Zeichen steht zwischen den Spalten, nicht in einer
     eigenen Zeile — sonst schiebt es die Spalten auseinander. */
  if (mitte) out += `<span class="pip is-mitte">${suitSvg(suit, "pip-svg")}</span>`;
  return `<span class="card-pips" style="--zeilen:${reihen}">${out}</span>`;
}

function kartenbild(suit, rank) {
  if (PIPS[rank]) return pipFeld(suit, rank);
  /* Die Sau trägt ihr Zeichen groß und auf einer Linie — sonst
     schwebt es mitten im leeren Feld. */
  if (rank === "A") return `<span class="card-sau">${suitSvg(suit, "sau-svg")}</span>`;
  /* Bildkarte: nur die Figur. Das große Farbzeichen, das die alten
     Bogen daneben setzen, stand hier direkt unter dem Eckzeichen und
     gab jeder Bildkarte ein doppeltes Farbzeichen — beim Gras-Ober
     verdeckte es obendrein das Blatt der Hellebarde. Welche Farbe es
     ist, steht in der Ecke, und die muss dort ohnehin stehen: im
     engen Fächer ist von der Karte nur die Ecke zu sehen. */
  return `<span class="card-bild">${figurSvg(rank)}</span>`;
}

const ecke = (wo, rank, suit) =>
  `<span class="card-ecke ${wo}"><span class="ecke-rang">${LABEL[rank]}</span>${suitSvg(suit, "ecke-suit")}</span>`;

/** eine Spielkarte als HTML */
export function cardHtml(card, opts = {}) {
  const s = card[0], r = card[1];
  const cls = ["card", "suit-" + s, "rang-" + r];
  if (opts.disabled) cls.push("is-disabled");
  if (opts.trump) cls.push("is-trump");
  if (opts.small) cls.push("is-small");
  if (opts.selected) cls.push("is-selected");
  if (opts.armed) cls.push("is-armed");
  const tag = opts.button ? "button" : "div";
  const attrs = opts.button ? `type="button" data-card="${card}" ${opts.disabled ? "disabled" : ""}` : "";
  const pts = points(card);
  const stil = opts.i === undefined ? "" : ` style="--i:${opts.i}"`;
  return `<${tag} class="${cls.join(" ")}"${stil} ${attrs} title="${SUITNAME[s]}-${RANKNAME[r]}${pts ? " · " + pts + " Augen" : ""}">
    ${ecke("tl", r, s)}
    <span class="card-mitte">${kartenbild(s, r)}</span>
    ${ecke("br", r, s)}
    ${pts ? `<span class="card-pts">${pts}</span>` : ""}
  </${tag}>`;
}

/** Kartenrücken — für die verdeckten Hände der Mitspieler */
export const backHtml = (i) => `<span class="back" style="--i:${i}"></span>`;

export const isTrumpCard = (card, game) => (game ? isTrump(card, game) : false);
