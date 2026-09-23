/* ============================================================
   BUCH 3, KAPITEL 4.1–4.18 (Seiten 112–147)
   Alleinspiel als Spieler — Solo und Wenz.

   Gleiche Konventionen wie in buch2.js: die Hände stehen in der
   Reihenfolge, in der das Buch sie auslegt, und test/buchstellungen.js
   rechnet diese Sortierung nach — für Wenz-Blätter nach der eigenen
   Auslegeordnung des Buches, siehe dort.

   Ab Kapitel 4.9 kommt der Farbwenz vor (`{ type: "farbwenz", suit }`).
   Angesagt wird er von niemandem; die Engine kennt ihn nur, damit diese
   Stellungen richtig dargestellt und sortiert werden.

   REGELN     = die Merksätze, in eigenen Worten zusammengefasst.
   STELLUNGEN = die abgebildeten Blätter, als Übungsaufgaben.
   ============================================================ */

export const REGELN = [
  {
    id: "alleinspiel-wagen",
    kapitel: "4.1",
    seite: 113,
    titel: "Wann ein Alleinspiel in Frage kommt",
    kurz: "Gebe ich bei normaler Kartenverteilung nicht mehr als drei Stiche ab, ziehe ich ein Alleinspiel grundsätzlich in Betracht.",
    lang:
      "Die Entscheidung hängt nicht an der Zahl der Trümpfe, sondern an der Zahl und dem Preis der Stiche, die ich voraussichtlich hergeben muss. Vier abgegebene Stiche beenden den Gedanken sofort, zwei sind kein Grund zu zögern. Spannend sind genau die drei: dort entscheidet, wie teuer sie werden — und dafür gibt es keine Formel, sondern nur Erfahrung. Ein Blatt kann in Vor- und Hinterhand knapp reichen und in Mittelhand trotzdem zu schwach sein.",
  },
  {
    id: "ausspiel-variieren",
    kapitel: "4.2",
    seite: 115,
    titel: "Das Ausspiel variieren",
    kurz: "Mit mehreren Laufenden spiele ich nicht immer den höchsten Ober an, sondern wechsle die Reihenfolge.",
    lang:
      "Für den Ausspieler sind drei Laufende gleichwertig, für die Gegner nicht: auf den höchsten Trumpf schmiert niemand, auf den dritthöchsten vielleicht doch. Wer deshalb immer mit dem Herz-Ober beginnt, wird nach einiger Zeit durchschaut. Beginne ich einmal mit dem Gras-Ober, traut sich die Mittelhand nicht zu schmieren, und der Partner in Hinterhand macht mit dem Eichel-Ober nur wenige Punkte — oder sie schmieren und haben später nichts Volles mehr.",
  },
  {
    id: "trumpfstiche-billiger-als-farbstiche",
    kapitel: "4.3",
    seite: 117,
    titel: "Trumpfstiche und Farbstiche getrennt rechnen",
    kurz: "Abgegebene Trumpfstiche sind für den Spielmacher im Schnitt günstiger als abgegebene Farbstiche.",
    lang:
      "In den drei Farben liegen zusammen 75 der 120 Augen, im Trumpf nur 45. Ein Stich, den ich im Trumpf hergebe, kostet deshalb im Mittel weniger als einer in einer Farbe. Wenn zwei Spielarten gleich viele Stiche kosten, wähle ich die, bei der mehr davon Trumpfstiche sind. Dazu kommt: mit zwei verschiedenfarbigen Spatzen gerate ich in Mittelhand leicht in die Zwickmühle, weil eine Farbe nachgespielt wird, die ich schon bedienen musste.",
  },
  {
    id: "mit-unter-einstechen",
    kapitel: "4.4",
    seite: 119,
    titel: "Mit einem Unter in die freie Farbe einstechen",
    kurz: "Sticht der Alleinspieler zu Beginn eine freie Farbe ein, nimmt er dafür einen Unter — nicht die Zehn und keinen Ober.",
    lang:
      "Die Trumpf-Zehn sieht nach schnellem Punktekonto aus, ist aber ein unnötiges Risiko: der Hintermann kann die Farbe ebenfalls frei sein und obendrein die Trumpf-Sau halten — dann liegen auf einen Schlag 36 Augen bei den Gegnern. Ein Ober wäre sicher, fehlt mir aber anschließend beim Ziehen der gegnerischen Trümpfe. Der Unter kostet wenig und reicht meistens: „Mit einem Unter gehst' nicht unter.\" Habe ich gar keinen Unter, nehme ich lieber ein kleines Herz als einen Ober.",
  },
  {
    id: "abspatzen-mittelhand",
    kapitel: "4.5",
    seite: 121,
    titel: "Abspatzen in Mittelhand",
    kurz: "Wird gegen mich als Alleinspieler in Mittelhand eine freie Farbe angespielt, wäge ich Abwerfen und Einstechen gründlich ab.",
    lang:
      "In Mittelhand sitzen noch zwei Gegner hinter mir, die risikofrei schmieren können — steche ich ein, wird der Stich teuer. Werfe ich meinen Spatz ab, bleibt er billig, aber ich verzichte auf einen Trumpfstich und riskiere, in der nächsten Runde wieder in Mittelhand zu sitzen. An Position 3 ist die Sache klarer: dort weiß ich, dass ich anschließend hinten sitze, und spatze ohne Zögern ab, solange nicht schon die Sau der Farbe gespielt wurde.",
  },
  {
    id: "abspatzen-hinterhand",
    kapitel: "4.6",
    seite: 123,
    titel: "Abspatzen in Hinterhand",
    kurz: "Das Abwerfen einer Fehlkarte lohnt sich vor allem dann, wenn ich anschließend in Hinterhand bleibe.",
    lang:
      "Als Letzter sehe ich alle Karten, bevor ich mich entscheide, und laufe nicht in die Zwickmühle. Wichtiger als ein billig abgegebener Spatz ist deshalb, diese Position zu behalten. Würde ich nach dem Abspatzen in Mittelhand landen, steche ich lieber ein. Sitzt mein direkter Vordermann mit der Sau hinter dem Anspiel, werfe ich ebenfalls nicht ab, sondern steche — sonst spielt er die Farbe nach und zwingt mich in eine sehr unangenehme Lage.",
  },
  {
    id: "kein-herz-solo-nach-spielwunsch",
    kapitel: "4.7",
    seite: 125,
    titel: "Auf ein Herz-Solo verzichten",
    kurz: "Hat ein Spieler vor mir schon Spiellust gezeigt, lasse ich ein nicht ganz sicheres Alleinspiel in der Farbe Herz besser sein.",
    lang:
      "Wer ein Sauspiel überlegt, hat vier oder fünf Trümpfe — und die stehen bei einem Herz-Solo alle gegen mich auf einer Hand. Genau das kann ein knappes Blatt kippen: liegen die fehlenden Ober beieinander, kommen zu meinem Spatz noch drei Stiche dazu. Bei einem Solo in einer anderen Farbe stört ein spielfreudiger Vordermann dagegen nicht, weil sich die Trümpfe dort neu verteilen. Riskant ist nur Herz, also Solo oder Wenz in genau der Farbe, die der andere im Sinn hat.",
  },
  {
    id: "spatzen-spielen-wenn-gegner-trumpflos",
    kapitel: "4.8",
    seite: 127,
    titel: "Spatzen ausspielen, sobald die Gegner trumpflos sind",
    kurz: "Sind alle gegnerischen Trümpfe gefallen, spiele ich als Alleinspieler sofort meine Schwächen an.",
    lang:
      "Meine sicheren Stiche laufen mir nicht davon, meine Schwächen schon. Warte ich mit ihnen bis zum Schluss, räumen die Gegner in der Zwischenzeit ihre Blätter auf, werfen Luschen ab und warten mit den vollen Karten auf meine Spatzen — zwei solche Stiche reichen für 60 Augen. Spiele ich früh an, muss vielleicht noch jemand die Farbe bedienen und kann gar nicht schmieren. Bei Solo und Farbwenz ist nur schwerer zu erkennen, wann der letzte gegnerische Trumpf gefallen ist: da hilft nur mitzählen.",
  },
  {
    id: "wenig-preisgeben",
    kapitel: "4.9",
    seite: 129,
    titel: "Möglichst wenig von sich preisgeben",
    kurz: "Ich gebe so wenig wie möglich über mein Blatt preis und lasse die Gegner so lange wie möglich über meine Stärken und Schwächen im Unklaren.",
    lang:
      "Ist ein Stich ohnehin verloren, zählt nicht nur, was er kostet, sondern auch, was er verrät. Habe ich Sau und Zehn einer Farbe und gebe die Zehn zu, wissen alle am Tisch, dass die Sau nur noch bei mir stehen kann — der Ausspieler hätte sie sonst gebracht, der Hintermann hätte sie geschmiert. Von da an spielen die Gegner diese Farbe nach, so schnell sie können. Gebe ich stattdessen die Sau, kostet das einen Punkt mehr und lässt offen, wo die Zehn liegt. Damit das wirkt, muss die Sau rasch und selbstverständlich fallen: jedes Zögern ist der Hinweis, den ich vermeiden wollte.",
  },
  {
    id: "frueh-trumpfstiche-abgeben",
    kapitel: "4.10",
    seite: 131,
    titel: "Mit beiden Schmiertrümpfen klein anspielen",
    kurz: "Je früher die Gegenspieler ihre unvermeidlichen Trumpfstiche machen, umso weniger Punkte werden sie damit erzielen.",
    lang:
      "Halte ich die beiden Schmiertrümpfe — Trumpf-Sau und Trumpf-Zehn — selbst, kann im ersten Trumpfstich kaum etwas Volles liegen: die Gegner müssen bedienen und haben nichts zu schmieren. Also eröffne ich klein und schenke der Verteidigung diesen Stich bewusst. Ziehe ich stattdessen sofort zweimal groß an, sticht der trumpfstärkste Gegner erst dann, wenn seine Partner schon trumpffrei sind und richtig schmieren können. Es sind in beiden Fällen gleich viele abgegebene Stiche — nur kostet der frühe deutlich weniger.",
  },
  {
    id: "zwickmuehle-vermeiden",
    kapitel: "4.11",
    seite: 133,
    titel: "Eine Zwickmühle vermeiden",
    kurz: "Bevor ich durch Abwerfen eines Spatzes in eine Zwickmühle gerate, steche ich auf eine freie Farbe besser ein.",
    lang:
      "Eine Fehlkarte billig loszuwerden ist verlockend, aber sie ist nur dann gut angelegt, wenn ich anschließend hinten sitze. Komme ich in der nächsten Runde an die zweite Position und wird dieselbe Farbe punktreich nachgespielt, habe ich keine gute Antwort mehr: klein einstechen lässt den Hintermann übernehmen, mit einem Laufenden annageln kostet mich Zugkraft und verschafft den Gegnern später einen zusätzlichen Trumpfstich — zu einem Zeitpunkt, an dem einer von ihnen schon trumpffrei ist.",
  },
  {
    id: "schmiertruempfe-farbwenz",
    kapitel: "4.12",
    seite: 135,
    titel: "Im Farbwenz die Schmiertrümpfe klug einsetzen",
    kurz: "Im Farbwenz besteht die Hauptaufgabe der Schmiertrümpfe darin, die gegnerischen Trümpfe zu ziehen, und nicht, punktreiche Stiche zu machen.",
    lang:
      "Im Farbwenz sind Sau und Zehn der Trumpffarbe der fünft- und sechsthöchste Trumpf des Spiels — hinter den vier Untern. Zum Einstechen auf eine gegnerische Fehlfarbe nehme ich deshalb zuerst einen kleinen Trumpf. Steht bei einem Gegner die Trumpf-Zehn mit zwei weiteren Trumpfkarten, wird sie hoch, sobald ich mit den Untern zweimal angezogen habe; dann macht er damit einen unnötigen und meist punktreichen Trumpfstich. Behalte ich die Sau, muss er sie mir überlassen oder seinen Unter hergeben.",
  },
  {
    id: "schmiertruempfe-solo",
    kapitel: "4.13",
    seite: 137,
    titel: "Auch im Solo die Schmiertrümpfe klug einsetzen",
    kurz: "Nicht nur im Farbwenz, auch im Solo steche ich nicht vorschnell mit meinen Schmiertrümpfen, weil sie gegen Ende des Spiels hoch werden können.",
    lang:
      "Die elf Augen der Trumpf-Sau sofort sicher zu machen ist verlockend, aber die Sau kommt ohnehin nach Hause und bringt in der letzten Runde keinen Punkt weniger als in der ersten. Fällt sie früh, werden bei einem starken Gegner sein kleiner Unter und die Trumpf-Zehn gleich hoch, und er wird die Zehn behalten. Halte ich sie zurück, muss er sich eher von der Zehn trennen, weil die Sau sie noch ziehen kann. Die Gegner stechen genauso oft — nur eben mit einem Unter statt mit der Zehn.",
  },
  {
    id: "wenz-oder-farbwenz",
    kapitel: "4.14",
    seite: 139,
    titel: "Wenz gegen Farbwenz abwägen",
    kurz: "Auch wenn ein Farbwenz verlockend erscheint, ist ein normaler Wenz manchmal die bessere Wahl.",
    lang:
      "Als Faustregel: mit zwei oder drei Untern und starken Sauen ist der farblose Wenz vorzuziehen — man hat damit die Hälfte oder gar drei Viertel aller Trümpfe, während man beim Farbwenz mindestens sechs Trümpfe braucht, um über die 50-Prozent-Marke zu kommen. Bei wenigen Sauen, aber guten Untern lohnt eher der Farbwenz: mit den Untern zieht man den Großteil der gegnerischen Trümpfe und macht seine Punkte mit den kleinen Trümpfen über die Farben, die man nicht bedienen muss.",
  },
  {
    id: "gewinnchancen-einschaetzen",
    kapitel: "4.15",
    seite: 141,
    titel: "Seine Gewinnchancen richtig einschätzen",
    kurz: "Auch für erfahrene Spieler lohnt es sich, die Gewinn- und Verteilungswahrscheinlichkeiten beim Schafkopf nachzuschlagen statt sie zu schätzen.",
    lang:
      "Ein Alleinspiel hat meist einen Gewinnweg, der vorgezeichnet ist — etwa: mit den Laufenden ziehen und dabei den fehlenden Ober fangen. Ob dieser Weg trägt, ist eine Wahrscheinlichkeitsfrage: mit drei Laufenden bei sechs Trümpfen fällt der fehlende Ober in den ersten Runden zu rund 65 Prozent. Ein Bauchgefühl dafür braucht jahrelange Erfahrung; nachschlagen geht schneller. Über viele Abende bekommt jeder in etwa gleich gute Blätter — wer die unklaren Alleinspiele am sichersten einschätzt, gehört regelmäßig zu den Gewinnern.",
  },
  {
    id: "zehn-vor-koenig-anbieten",
    kapitel: "4.16",
    seite: 143,
    titel: "Spatz-Zehn statt Spatz-König anbieten",
    kurz: "Muss ich eine Zehn-König-Kombination selbst auflösen, biete ich meist zuerst die Zehn an und nicht den König.",
    lang:
      "Spiele ich den König an, kann der Gegner mit der Sau in Hinterhand die fehlende Zehn ausrechnen: sie muss bei mir sein. Er weicht mit einer kleinen Karte aus und behält die Sau, bis ich die Zehn spielen muss — dann ist vielleicht schon jemand in dieser Farbe frei und kann eine andersfarbige Volle schmieren. Biete ich zuerst die Zehn, muss die Sau übernehmen, solange noch Luschen der Farbe im Spiel sind. Das gilt immer, wenn die Gegner im Stich mit der Sau nicht mehr als 30 Punkte machen dürfen.",
  },
  {
    id: "wenz-farbkombinationen-reihenfolge",
    kapitel: "4.17",
    seite: 145,
    titel: "Kombinationen in der richtigen Reihenfolge spielen",
    kurz: "Im Wenz löse ich Farbenkombinationen in der richtigen Reihenfolge auf, indem ich zuerst meine blanken Karten spiele und eine Sau-König-Kombination möglichst lange zurückhalte.",
    lang:
      "Auch ein Wenz, der kaum noch zu verlieren ist, will in der richtigen Reihenfolge gespielt sein. Ist der fehlende Unter gezogen, kommt zuerst die blanke Karte — hier die einzeln stehende Eichel-Sau. Wer sie früh spielt, hat später die Wahl, die Farbe zu stechen oder eine Fehlkarte abzuwerfen, falls ein Gegner sie nachspielt. Aus einer Zehn-König-Kombination kommt die Zehn zuerst, denn sie verleitet die Sau zum Stechen; spielt man stattdessen den König und die Sau weicht aus, fängt sie später die Zehn — womöglich dann, wenn die beiden anderen die Farbe schon frei sind und schmieren können. Eine Sau-König-Kombination löst man dagegen möglichst gar nicht selbst auf, sondern wartet, bis die Gegner die Farbe anspielen, und sticht zunächst mit dem König ein, solange die Zehn noch nicht auf dem Tisch liegt. Vor einer blanken Zehn als Fehlkarte muss einem nicht bange sein: mit etwas Glück wird sie hoch, weil ein Gegner mangels anderer Schmierkarten die Sau zugeben muss.",
  },
  {
    id: "wahrscheinlichste-umstaende",
    kapitel: "4.18",
    seite: 147,
    titel: "Gelegentlich auch unsichere Alleinspiele riskieren",
    kurz: "Bei all meinen Entscheidungen gehe ich von den wahrscheinlichsten Umständen aus und nicht von den ungünstigsten.",
    lang:
      "Der Vorsichtige rechnet vor, wie das Spiel verlorengeht, und lässt es deshalb bleiben. Er vergisst dabei die zweite, die entscheidende Frage: wie wahrscheinlich ist der schlechte Fall überhaupt? Zwei fehlende Unter stehen zu 69,6 Prozent auseinander. Ein Wenz, der nur an dieser einen Bedingung hängt, gewinnt also rund sieben von zehn Partien — siebenmal kassieren, dreimal zahlen, unterm Strich der Gewinn aus vier erfolgreichen Alleinspielen. Wer nur die sicheren Blätter spielt, lässt diesen Gewinn liegen. Das ist die goldene Regel des Schafkopfspielens, und sie gilt nicht nur für die Ansage, sondern für jede Entscheidung am Tisch.",
  },
];

export const STELLUNGEN = [
  {
    id: "b3-4.1-s112",
    regelId: "alleinspiel-wagen",
    seite: 112,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Du bist in Vorhand und überlegst ein Herz-Solo. Sieben Trümpfe, darunter zwei Ober und drei Unter, dazu der blanke Eichel-König. Es fehlen dir der Gras- und der Herz-Ober.",
    stich: [],
    hand: ["EO", "SO", "EU", "GU", "HU", "HX", "H7", "EK"],
    frage: "Soll ich ein Herz-Solo riskieren?",
    optionen: ["Ja", "Nein"],
    loesung: ["Ja"],
    loesungstext: "Ja",
    begruendung:
      "Zwei Trumpfstiche gehen durch die fehlenden Ober weg, dazu der Stich auf den Eichel-König — drei abgegebene Stiche, also die Grenze, ab der ein Alleinspiel in Frage kommt. Auf Trumpf sollten nicht mehr als 25 Augen wegkommen, auf den Eichel-König etwa noch einmal 25. Das wird knapp: ist ein Gegner beim zweiten Trumpfstich schon trumpffrei und schmiert zehn Punkte, ist es vorbei. Das Buch nennt es ein Blatt für einen mutigen Tag — an einem vorsichtigen darf man auch nur mit der Alten spielen.",
  },
  {
    id: "b3-4.2-s114",
    regelId: "ausspiel-variieren",
    seite: 114,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Dein Herz-Solo, du bist am Ausspiel und hältst die drei Laufenden. Dazu der Herz-Unter, drei kleine Herzen und der blanke Eichel-König.",
    stich: [],
    hand: ["EO", "GO", "HO", "HU", "HK", "H9", "H7", "EK"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["GO"],
    loesungstext: "Den Gras-Ober",
    begruendung:
      "Alle drei Ober holen den Stich, für dich sind sie gleichwertig — für die Gegner nicht. Auf den höchsten Trumpf schmiert niemand, auf den dritthöchsten schon eher. Die Mittelhand traut sich auf den Gras-Ober nicht zu schmieren, und der Hintermann macht mit dem Eichel-Ober nur wenige Punkte. Wer dagegen immer mit dem Herz-Ober beginnt, wird nach ein paar Abenden durchschaut.",
  },
  {
    id: "b3-4.3-s116",
    regelId: "trumpfstiche-billiger-als-farbstiche",
    seite: 116,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Zwei Ober, drei Unter, Herz-Sau und Herz-Neun, dazu die blanke Eichel-Acht. Das Blatt trägt ein Herz-Solo, aber auch einen Herz-Wenz — bei dem wären nur die Unter und die Herz-Karten Trumpf, der Gras-Ober würde zur Fehlkarte.",
    stich: [],
    hand: ["GO", "HO", "EU", "HU", "SU", "HA", "H9", "E8"],
    frage: "Soll ich ein Herz-Solo oder einen Herz-Wenz spielen?",
    optionen: ["Herz-Solo", "Herz-Wenz"],
    loesung: ["Herz-Solo"],
    loesungstext: "Ein Herz-Solo",
    begruendung:
      "Beide Male gibst du drei Stiche ab — beim Solo aber zwei davon im Trumpf (Eichel- und Schellen-Ober) und nur einen in der Farbe, beim Wenz umgekehrt zwei in den Farben. In den drei Farben liegen 75 Augen, im Trumpf nur 45, also sind Trumpfstiche die billigeren. Dazu kommt beim Wenz die Zwickmühle: mit Gras-Ober und Eichel-Acht hast du zwei verschiedenfarbige Spatzen und musst in Mittelhand fürchten, dass eine bereits bediente Farbe nachgespielt wird.",
  },
  {
    id: "b3-4.4-s118",
    regelId: "mit-unter-einstechen",
    seite: 118,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 3,
    spielmacher: 3,
    hinweis:
      "Hier weichen Abbildung und Text des Buches voneinander ab. Abgedruckt ist EO GO SO HU HX HK H7 GK — nur ein Unter. Text und Antwort verlangen aber den Schellen-Unter und sprechen von „den beiden Unter\"; die Rechnung „höchstens 20 Punkte\" geht mit Eichel-Sau, Eichel-König, Unter und gegnerischem Ober auf. Das abgedruckte Blatt ist offenbar die Variante, die der Text am Schluss durchspielt (ein Unter und dafür ein weiteres kleines Herz). Hier steht deshalb das Blatt des Textes.",
    lage:
      "Dein Herz-Solo. Spieler 1 eröffnet mit der Eichel-Sau, Spieler 2 legt den Eichel-König dazu. Du bist eichelfrei und hast sieben Trümpfe: drei Ober, zwei Unter, Herz-Zehn und Herz-König, dazu den blanken Gras-König.",
    stich: [{ sitz: 1, card: "EA" }, { sitz: 2, card: "EK" }],
    hand: ["EO", "GO", "SO", "HU", "SU", "HX", "HK", "GK"],
    frage: "Mit welcher Karte soll ich stechen?",
    loesung: ["SU"],
    loesungstext: "Mit dem Schellen-Unter",
    begruendung:
      "Die Herz-Zehn wäre der Anfängergriff: der Hintermann kann eichelfrei sein und die Herz-Sau halten — dann liegen 36 Augen bei den Gegnern und das Solo ist kaum noch zu gewinnen. Ein Ober wäre sicher, fehlt dir aber gleich darauf beim Ziehen der gegnerischen Trümpfe. Der Unter kostet fast nichts: selbst wenn der Hintermann übersticht, kommen höchstens 20 Punkte zusammen, und ein hoher gegnerischer Trumpf ist vom Tisch. Bei sieben Trümpfen bringst du die Herz-Zehn später ohnehin nach Hause.",
  },
  {
    id: "b3-4.5-s120",
    regelId: "abspatzen-mittelhand",
    seite: 120,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 2,
    spielmacher: 2,
    lage:
      "Dein Herz-Solo, aber kein Selbstläufer: Eichel- und Herz-Ober fehlen dir, die Gegner werden zweimal auf Trumpf stechen. Der Ausspieler bringt die Schellen-Acht, eine Farbe, die du frei bist — und du sitzt in Mittelhand, hinter dir also noch zwei Gegner.",
    stich: [{ sitz: 1, card: "S8" }],
    hand: ["GO", "SO", "EU", "HU", "SU", "HA", "HK", "E8"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["E8"],
    loesungstext: "Die Eichel-Acht",
    begruendung:
      "Der Ausspieler bietet dir eine Null-Punkte-Karte an — nimm das Angebot. Wirfst du die Eichel-Acht ab, bekommen die Gegner in diesem Stich kaum mehr als 21 Augen, und dein einziger Spatz ist weg, bevor er teuer wird. Stichst du ein, können beide Gegner hinter dir risikofrei schmieren, und dein Sieg hinge daran, ob sie später auf die Eichel-Acht noch 25 Punkte zusammenbringen. Ein Fehler wäre das Einstechen nicht — aber es setzt dich dem Risiko aus, noch einmal in Mittelhand zu sitzen.",
  },
  {
    id: "b3-4.6-s122",
    regelId: "abspatzen-hinterhand",
    seite: 122,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 4,
    spielmacher: 4,
    lage:
      "Dein Herz-Solo in Hinterhand. Spieler 1 kommt mit der Eichel-Sau heraus, Spieler 2 gibt die Eichel-Neun zu, Spieler 3 den Eichel-König — 15 Augen liegen auf dem Tisch. Du bist eichelfrei, deine einzige Fehlkarte ist der Gras-König.",
    stich: [{ sitz: 1, card: "EA" }, { sitz: 2, card: "E9" }, { sitz: 3, card: "EK" }],
    hand: ["EO", "HO", "SO", "HU", "SU", "HA", "HK", "GK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["GK"],
    loesungstext: "Den Gras-König",
    begruendung:
      "Für diesen Spatz hattest du vor dem Spiel 25 Verlustpunkte eingeplant — mit 19 geht er billiger weg als erwartet. Wichtiger noch: du bleibst dadurch in Hinterhand, und dort läufst du in keine Zwickmühle, weil du immer alle Karten siehst, bevor du dich entscheidest. Anders läge der Fall, wenn Spieler 1 mit dem König eröffnet und dein Vordermann die Eichel-Sau zugegeben hätte: dann steche lieber ein, sonst spielt er Eichel nach und bringt dich in die Klemme.",
  },
  {
    id: "b3-4.7-s124",
    regelId: "kein-herz-solo-nach-spielwunsch",
    seite: 124,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 4,
    spielmacher: 4,
    lage:
      "Du sitzt an Position 4 und überlegst ein Herz-Solo — ein eher schwaches, an dieser Position aber spielbar. Spieler 1 hat allerdings schon „Ich spiele\" gesagt, die Spieler 2 und 3 sind weiter. Dir fehlen der Herz- und der Schellen-Ober.",
    stich: [],
    hand: ["EO", "GO", "EU", "HU", "HX", "H7", "EA", "E7"],
    frage: "Soll ich ein Herz-Solo riskieren?",
    optionen: ["Ja", "Nein"],
    loesung: ["Nein"],
    loesungstext: "Eher nicht",
    begruendung:
      "Das Blatt bräuchte fehlende Trümpfe, die einigermaßen gleich auf drei Gegner verteilt sind. Spieler 1 überlegt aber aller Wahrscheinlichkeit nach ein Sauspiel und hat damit vier oder fünf Trümpfe — die bei einem Herz-Solo alle auf einer Hand gegen dich stehen. Liegen die beiden fehlenden Ober mit drei weiteren Trümpfen beieinander, gibst du neben dem Eichel-Spatz noch drei Stiche ab. Hätten alle drei weiter gesagt, wäre das Solo einen Versuch wert; ein Gras-Solo wäre es auch jetzt — riskant ist nur die Farbe Herz.",
  },
  {
    id: "b3-4.8-s126",
    regelId: "spatzen-spielen-wenn-gegner-trumpflos",
    seite: 126,
    spiel: { type: "wenz" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Dein Wenz. Du hast mit dem Eichel-Unter eröffnet und dabei den Herz- und den Gras-Unter gezogen — die Gegner sind trumpffrei. Sau, Zehn und König in Herz und die Eichel-Sau sind damit nicht mehr zu stechen. Übrig bleiben zwei Schwächen: die Gras-Zehn und der Schellen-König.",
    stich: [],
    hand: ["SU", "HA", "HX", "HK", "EA", "GX", "SK"],
    frage: "Welche Karte soll ich nachspielen?",
    loesung: ["SK"],
    loesungstext: "Den Schellen-König",
    begruendung:
      "Deine Böcke laufen dir nicht davon, deine Schwächen schon. Spielst du sie erst zum Schluss, haben die Gegner ihre Luschen abgeworfen und warten mit vollen Karten — zwei solche Stiche reichen für 60 Augen. Jetzt muss vielleicht noch jemand Schellen bedienen und kann gar nicht schmieren. Und der König vor der Gras-Zehn: schmiert ein Gegner leichtfertig die Gras-Sau, hast du sogar eine kleine Schneider-Chance.",
  },
  {
    id: "b3-4.9-s128",
    regelId: "wenig-preisgeben",
    seite: 128,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Alleinspieler",
    ich: 3,
    spielmacher: 3,
    lage:
      "Dein Herz-Wenz. Spieler 1 eröffnet mit dem Eichel-König, Spieler 2 sticht mit der Trumpf-Sau ein — der Stich ist für dich verloren. Du musst Eichel bedienen und hast dort Sau und Zehn.",
    stich: [{ sitz: 1, card: "EK" }, { sitz: 2, card: "HA" }],
    hand: ["EU", "GU", "SU", "HX", "HK", "EA", "EX", "GK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["EA"],
    loesungstext: "Die Eichel-Sau",
    begruendung:
      "Der Stich ist ohnehin weg, also zählt hier nicht der Preis, sondern was du verrätst. Gibst du die Zehn, weiß der ganze Tisch, dass die Eichel-Sau nur bei dir stehen kann: Spieler 1 hätte sie sonst selbst gebracht, Spieler 4 hätte sie geschmiert. Danach spielen die Gegner Eichel nach, so oft sie können, und hoffen auf einen zweiten mächtigen Stich. Die Sau kostet einen Punkt mehr und lässt offen, wo die Zehn liegt. Wichtig ist, sie rasch und selbstverständlich zu legen — jedes Zögern ist genau der Hinweis, den du vermeiden willst.",
  },
  {
    id: "b3-4.10-s130",
    regelId: "frueh-trumpfstiche-abgeben",
    seite: 130,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Dein Herz-Solo, du bist am Ausspiel. Zwei Laufende, dazu die beiden Schmiertrümpfe Herz-Sau und Herz-Zehn und zwei kleine Herzen. Einzige Fehlkarte ist die Schellen-Zehn. Die Gegner haben zusammen sieben Trümpfe.",
    stich: [],
    hand: ["EO", "GO", "EU", "HA", "HX", "H9", "H7", "SX"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["H7"],
    loesungstext: "Die Herz-Sieben",
    begruendung:
      "Du schenkst der Verteidigung damit den ersten Stich — und gibst scheinbar auch noch das Ausspiel aus der Hand. Beides ist hier richtig, weil du die beiden Schmiertrümpfe selbst hältst: müssen alle Trumpf bedienen, liegen höchstens acht Augen drin. Kommst du in der zweiten Runde wieder an, ziehst du deine Laufenden und gibst danach nur noch einen Trumpfstich mit höchstens 25 Punkten ab. Ziehst du dagegen sofort zweimal groß an, sticht der trumpfstärkste Gegner erst, wenn seine Partner trumpffrei sind und schmieren können — gleich viele Stiche, aber ein viel teurerer.",
  },
  {
    id: "b3-4.11-s132",
    regelId: "zwickmuehle-vermeiden",
    seite: 132,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 4,
    spielmacher: 4,
    lage:
      "Dein Herz-Solo in Hinterhand. Spieler 1 bringt die Gras-Sieben, Spieler 2 die Gras-Acht, Spieler 3 den Gras-König — vier Punkte liegen auf dem Tisch. Du bist grasfrei und hast als Fehlkarten die Eichel-Sau und die Eichel-Sieben.",
    stich: [{ sitz: 1, card: "G7" }, { sitz: 2, card: "G8" }, { sitz: 3, card: "GK" }],
    hand: ["EO", "GO", "HO", "HA", "HK", "H7", "EA", "E7"],
    frage: "Soll ich stechen oder abspatzen?",
    loesung: ["HK"],
    loesungstext: "Stechen, mit dem Herz-König",
    begruendung:
      "Billiger wirst du die Eichel-Sieben nie los — aber wenn Spieler 3 gleich die Gras-Sau oder die Gras-Zehn nachbringt, sitzt du in der Zwickmühle. Klein einstechen verbietet sich, weil dein Hintermann mit der Herz-Zehn übernehmen und der dritte Gegner den Stich fett machen kann. Nagelst du die hohe Gras-Karte mit einem Laufenden an, kannst du nur noch zweimal anziehen, und die Gegner bekommen einen zusätzlichen Trumpfstich, wenn schon einer von ihnen trumpffrei ist. Warum der König und nicht die Sau: siehe Kapitel 4.13.",
  },
  {
    id: "b3-4.12-s134",
    regelId: "schmiertruempfe-farbwenz",
    seite: 134,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Alleinspieler",
    ich: 4,
    spielmacher: 4,
    lage:
      "Dein Herz-Wenz. Spieler 1 bringt den Eichel-König, Spieler 2 die Eichel-Sieben, Spieler 3 die Eichel-Sau — 15 Punkte, und du bist eichelfrei. Trumpf sind die vier Unter und danach die Herz-Karten; Herz-Sau und Herz-Zehn sind der fünft- und sechsthöchste Trumpf.",
    stich: [{ sitz: 1, card: "EK" }, { sitz: 2, card: "E7" }, { sitz: 3, card: "EA" }],
    hand: ["EU", "GU", "HA", "HO", "H7", "GA", "G7", "SK"],
    frage: "Mit welcher Karte soll ich stechen?",
    loesung: ["HO"],
    loesungstext: "Mit dem Herz-Ober, nicht mit der Herz-Sau",
    begruendung:
      "Die Aufgabe deiner Schmiertrümpfe ist es, gegnerische Trümpfe zu ziehen, nicht fette Stiche zu machen. Steht die Herz-Zehn bei einem Gegner mit zwei weiteren Herzen, wird sie hoch, sobald du mit den Untern zweimal angezogen hast — ein unnötiger und vermutlich punktreicher Trumpfstich für die Gegenpartei. Zusammen mit den beiden Farbstichen, die du in Gras und Schellen ohnehin eingeplant hast, kann das die Niederlage bedeuten. Nimmst du hier einen kleinen Trumpf, bleibt die Herz-Sau als hoher Trumpf erhalten und zwingt den Gegner, sich von der Zehn zu trennen.",
  },
  {
    id: "b3-4.13-s136",
    regelId: "schmiertruempfe-solo",
    seite: 136,
    spiel: { type: "solo", suit: "H" },
    rolle: "Alleinspieler",
    ich: 4,
    spielmacher: 4,
    lage:
      "Dein Herz-Solo in Hinterhand. Spieler 1 bringt den Gras-König, Spieler 2 die Gras-Sieben, Spieler 3 die Gras-Sau — 15 Punkte, und du bist grasfrei. Neben der Trumpf-Sau hast du nur noch zwei kleine Herzen und die Eichel-Sieben.",
    stich: [{ sitz: 1, card: "GK" }, { sitz: 2, card: "G7" }, { sitz: 3, card: "GA" }],
    hand: ["EO", "HO", "EU", "GU", "HA", "H8", "H7", "E7"],
    frage: "Mit welcher Karte soll ich stechen?",
    loesung: ["H7"],
    loesungstext: "Mit der Herz-Sieben, nicht mit der Herz-Sau",
    begruendung:
      "Die elf Augen sofort sicher zu machen ist verlockend, aber die Trumpf-Sau kommt ohnehin nach Hause und bringt in der letzten Runde keinen Punkt weniger als in der ersten. Fällt sie jetzt, sind beim starken Gegner sein kleiner Unter und die Herz-Zehn gleich hoch — er gibt gefahrlos den Unter zu und behält die Zehn für einen dicken Trumpfstich am Schluss. Hältst du die Sau zurück, muss er sich eher von der Zehn trennen, weil die Sau sie noch ziehen kann. Die Gegner stechen genauso oft, nur mit einem Unter statt mit der Zehn: acht Punkte Unterschied, die das Spiel entscheiden können.",
  },
  {
    id: "b3-4.14-s138",
    regelId: "wenz-oder-farbwenz",
    seite: 138,
    spiel: { type: "wenz" },
    label: "Wenz oder Herz-Wenz?",
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Du bist in Vorhand. Zwei Unter, dazu die Herz-Flöte aus Sau, Zehn und König samt der Herz-Sieben, und als Fehlkarten die Gras- und die Schellen-Sieben. Ein Herz-Wenz sieht auf den ersten Blick verlockend aus, weil die Herz-Karten dann Trumpf wären.",
    stich: [],
    hand: ["EU", "GU", "HA", "HX", "HK", "H7", "G7", "S7"],
    frage: "Soll ich einen Wenz oder einen Herz-Wenz spielen?",
    optionen: ["Einen normalen Wenz", "Einen Herz-Wenz"],
    loesung: ["Einen normalen Wenz"],
    loesungstext: "Einen normalen Wenz",
    begruendung:
      "Der farblose Wenz steht mit diesem Blatt bei rund 98 Prozent. Beim Herz-Wenz ist einer der beiden fehlenden Unter in etwas mehr als jedem zweiten Spiel dreifach besetzt — dann gibst du neben deinen beiden Spatzen auch noch einen Trumpfstich ab. Der Weg im normalen Wenz: mit dem Gras-Unter beginnen und die fehlenden Wenzen einsammeln, fallen beide, mit einem Spatz fortsetzen; stehen sie zusammen, als zweite Karte den Eichel-Unter. Danach die Herz-Flöte, beginnend mit dem König. Faustregel: zwei oder drei Unter und starke Sauen sprechen für den Wenz, wenige Sauen und gute Unter für den Farbwenz — der braucht aber mindestens sechs Trümpfe.",
  },
  {
    id: "b3-4.15-s140",
    regelId: "gewinnchancen-einschaetzen",
    seite: 140,
    spiel: { type: "solo", suit: "H" },
    label: "Solo — und wenn ja, in welcher Farbe?",
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    hinweis:
      "Das Blatt ist noch vor der Ansage abgebildet und deshalb wie üblich in der Herz-Ordnung ausgelegt. Der Kopf der Übung nennt daher keine Spielart — welche Farbe in Frage kommt, ist ja gerade die Frage.",
    lage:
      "Du bist in Vorhand: drei Laufende, dazu Eichel- und Gras-Unter — sechs Trümpfe in jeder Farbe, denn deine restlichen Karten sind die Eichel-, Gras- und Herz-Sieben.",
    stich: [],
    hand: ["EO", "GO", "HO", "EU", "GU", "H7", "E7", "G7"],
    frage: "Soll ich ein Solo riskieren?",
    optionen: ["Ja, ein Eichel- oder Gras-Solo", "Ja, ein Herz-Solo", "Nein"],
    loesung: ["Ja, ein Eichel- oder Gras-Solo"],
    loesungstext: "Ja, ein Eichel- oder Gras-Solo — aber kein Herz-Solo",
    begruendung:
      "Der Gewinnweg ist vorgezeichnet: die drei Laufenden vorspielen und dabei den fehlenden Schellen-Ober fangen, nötigenfalls mit dem Gras-Unter weiterziehen. Mit drei Laufenden bei sechs Trümpfen fällt der Schellen-Ober zu etwa 65 Prozent — zwei von drei Spielen, ein bewusst eingegangenes Risiko. Ist er höher besetzt und kommt zum Stechen, sinkt die Chance deutlich. Hättest du statt Eichel- und Gras-Unter nur Gras- und Herz-Unter, läge sie schon unter 50 Prozent, mit Herz- und Schellen-Unter unter 40 — dann lieber kein Solo. Kein Herz-Solo, weil bei einer Häufung von Bildtrümpfen und Herz-Karten auf einer Gegnerhand der Schellen-Ober häufiger stehen bleibt als in den anderen Farben.",
  },
  {
    id: "b3-4.16-s142",
    regelId: "zehn-vor-koenig-anbieten",
    seite: 142,
    spiel: { type: "wenz" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Dein Wenz. Im ersten Stich hast du mit dem Eichel-Unter den einen fehlenden Trumpf geholt; Spieler 2 gab den Gras-Unter, Spieler 3 die Eichel-Sieben, Spieler 4 die Gras-Acht. Verlieren kannst du nicht mehr — die Gegenpartei macht genau einen Stich mit der Herz-Sau. Es geht also um den Schneider. In Herz hast du Zehn und König ohne die Sau.",
    stich: [],
    hand: ["HU", "SU", "HX", "HK", "EA", "EX", "EK"],
    frage: "Welche Karte soll ich nachspielen?",
    loesung: ["HX"],
    loesungstext: "Die Herz-Zehn, nicht den Herz-König",
    begruendung:
      "Naheliegend wäre der König, und wenn die Herz-Sau in Mittelhand steht, geht die Rechnung auch auf. Steht sie aber in Hinterhand, bemerkt der Gegner die fehlende Herz-Zehn und rechnet sich aus, dass sie bei dir liegen muss: er weicht mit einem kleinen Herz aus und behält die Sau, bis du die Zehn spielen musst — dann ist vielleicht schon jemand herzfrei und schmiert eine andersfarbige Volle. Der Schneider ist weg. Bietest du sofort die Zehn an, muss die Sau übernehmen; hat jeder noch ein Herz, bleiben die Gegner Schneider. Und bleibt dein König dann bei einem Gegner in Hinterhand hängen, spielst du ihn umgehend nach.",
  },
  {
    id: "b3-4.17-s144",
    regelId: "wenz-farbkombinationen-reihenfolge",
    seite: 144,
    spiel: { type: "wenz" },
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Dein Wenz. Im ersten Stich hast du mit dem Eichel-Unter den einen fehlenden Trumpf gezogen: Spieler 2 gab den Gras-Unter, Spieler 3 die Eichel-Acht, Spieler 4 die Gras-Acht. Die beiden restlichen Unter hältst du selbst, die Gegenpartei ist trumpffrei. In Eichel steht die Sau blank, in Gras liegen Zehn und König, in Herz Sau und König.",
    stich: [],
    hand: ["HU", "SU", "EA", "GX", "GK", "HA", "HK"],
    frage: "Welche Karte soll ich nachspielen?",
    loesung: ["EA"],
    loesungstext: "Die Eichel-Sau",
    begruendung:
      "Die Eichel-Sau steht blank, und genau deshalb kommt sie zuerst. Ist sie gespielt, ist die Farbe für dich erledigt: wird Eichel später noch einmal angespielt, kannst du frei wählen, ob du stichst oder eine Fehlkarte abwirfst. Hebst du sie dagegen auf, bleibst du an die Farbe gebunden. Als Nächstes folgt die Gras-Zehn, nicht der Gras-König — die Zehn verleitet die Gras-Sau zum Stechen, während sie nach dem König nur ausweichen und die Zehn später fangen würde. Herz-Sau und Herz-König bleiben am längsten liegen: diese Kombination löst du nicht selbst auf, sondern wartest, bis ein Gegner Herz anspielt.",
  },
  {
    id: "b3-4.18-s146",
    regelId: "wahrscheinlichste-umstaende",
    seite: 146,
    spiel: { type: "wenz" },
    label: "Alleinspiel — und wenn ja, welches?",
    rolle: "Alleinspieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Du bist in Vorhand. Eichel- und Schellen-Unter, dazu die ganze Eichel-Farbe von der Sau bis zur Sieben, und als Fehlkarten die Gras- und die Schellen-Sieben.",
    stich: [],
    hand: ["EU", "SU", "EA", "EX", "EK", "E7", "G7", "S7"],
    frage: "Soll ich ein Alleinspiel riskieren?",
    optionen: ["Ja, einen Wenz", "Ja, einen Eichel-Wenz", "Nein"],
    loesung: ["Ja, einen Wenz"],
    loesungstext: "Ja, einen Wenz",
    begruendung:
      "Ein Eichel-Wenz scheidet aus: dort wären Gras und Schelln Farbstiche der Gegner, und obendrein machen sie mit den beiden fehlenden Untern fast immer noch einen Trumpfstich. Bleibt der gewöhnliche Wenz. Der Vorsichtige rechnet: die beiden Spatzen kosten 40 bis 50 Punkte, dazu ein Trumpfstich, auf den geschmiert wird — aus die Maus. Das stimmt, gilt aber nur, wenn die beiden fehlenden Unter zusammenstehen. Sie stehen zu 69,6 Prozent auseinander, und dann ist das Spiel so gut wie sicher: beide Unter in einem Zug ziehen, sofort eine Fehlfarbe nachspielen, die zweite Fehlkarte bei der ersten Gelegenheit abwerfen, mit dem zweiten Unter wieder ans Spiel kommen und die vier Eicheln von oben herunterspielen. Rund 70 Prozent Gewinnwahrscheinlichkeit — sieben Spiele kassiert, drei bezahlt.",
  },
];

export const regelById = (id) => REGELN.find((r) => r.id === id) || null;
