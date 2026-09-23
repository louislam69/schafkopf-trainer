/* ============================================================
   BUCH 1, KAPITEL 1.1–1.14 UND 2.1–2.5 (Seiten 8–47)

   Der Anfang des Buches, zuletzt eingearbeitet und deshalb die
   jüngste Datei — inhaltlich steht sie aber vor `buch2.js`.
   Zwei Rollen:

     Kapitel 1   Sauspiel als rufender Spieler   (S. 8–35)
     Kapitel 2   Sauspiel als gerufener Spieler  (S. 38–47)

   Kapitel 2 läuft in `buch2.js` ab 2.6 weiter; die Trennung ist
   allein den Aufnahmeserien geschuldet, nicht dem Buch.

   Was hier neu ist gegenüber allem Späteren: es geht zum ersten
   Mal um die **Ansage** — wann ein Sauspiel überhaupt in Frage
   kommt, welche Sau man ruft, und wann man trotz spielbarem
   Blatt „Weiter“ sagt. Der Sitz am Tisch spielt dabei eine
   Rolle, die die Ansageregeln in `strategy.js` noch nicht kennen
   (1.7, 1.8).

   Verhältnis zu strategy.js
   ------------------------------------------------------------
   Die Blattmuster aus 1.1 (der „Urtyp“ und seine vier Varianten)
   und die Sperre aus 1.2 stehen bereits als ausführbare
   Ansageregeln in `strategy.js` — die Bots sagen danach an. Hier
   stehen dieselben beiden Kapitel noch einmal als Merksatz, weil
   `REGELN` das vollständige Inhaltsverzeichnis des Buches sein
   soll. Wer die Logik ändern will, ändert `strategy.js`; wer den
   Wortlaut nachschlägt, findet ihn hier.
   ============================================================ */

export const REGELN = [
  {
    id: "kontrolle-zweier-farben",
    kapitel: "1.1",
    seite: 9,
    titel: "Ein normales Rufspiel ansagen",
    kurz: "Ein solides Sauspiel basiert auf der Kontrolle von mindestens zwei Farben.",
    lang:
      "Der „Urtyp“ eines soliden Rufspiels: fünf Trümpfe, darunter einer der drei höchsten Ober und ein Schmiertrumpf, dazu eine freie Farbe. Der Gewinnplan dahinter ist einfach — mit den Trümpfen entscheide ich mindestens zwei Trumpfrunden für mich, und gemeinsam mit dem Partner kontrolliere ich zwei der drei Farben: die Ruffarbe, von der er die Sau hat, und die Farbe, die ich frei bin und auf die ich bei Gelegenheit einsteche. Vier Varianten sind gleichermaßen geeignet: ein zusätzlicher Ober anstelle des Schmiertrumpfs; eine Farb-Sau anstelle der freien Farbe; nur vier, dafür hohe Trümpfe, wenn neben der freien Farbe auch eine Farb-Sau steht; oder sechs Trümpfe ohne jeden laufenden Ober, dann aber mit zwei freien Farben oder einer Farb-Sau. Allen Varianten gemeinsam ist genau das eine Merkmal: die Kontrolle über mindestens zwei Farben.",
  },
  {
    id: "drei-farben-ohne-sauen-meiden",
    kapitel: "1.2",
    seite: 11,
    titel: "Nicht mit drei Farben spielen",
    kurz: "Ein Rufspiel mit drei Farben ohne Sauen kann ich oft auch mit fünf Trümpfen nicht gewinnen.",
    lang:
      "Fünf mittelmäßige Trümpfe reichen nicht, wenn ich in allen drei Farben bedienen muss und keine einzige Sau halte: mir fehlt die Kontrolle über eine zweite Farbe. Mein Partner hat mit knapp 50 % (genau 47,4 %) keine weitere Sau neben der Rufsau — in fast der Hälfte der Fälle liegen also beide anderen Farb-Sauen bei den Gegnern und damit vermutlich zwei punktreiche Farbstiche. Warum dann nicht einfach „Weiter“ sagen und auf ein neues Blatt hoffen? Im Turnier rufen viele Fortgeschrittene trotzdem, weil sie ohne eigene Sau nicht gerufen werden können und lieber selbst spielen als bei der schwächeren Partei zu landen. Das Buch hält dagegen: solche Spieler verletzen das stillschweigende Versprechen an ihren Partner, der stärkste Spieler am Tisch zu sein, und verlegen die Verantwortung in die Hände eines Unbekannten.",
  },
  {
    id: "sau-zur-zehn-rufen",
    kapitel: "1.3",
    seite: 13,
    titel: "Die Sau zur Zehn rufen",
    kurz: "Für ein Rufspiel bietet sich diejenige Sau an, von deren Farbe ich nur eine einzelne Karte habe. Bei mehreren blanken Karten bevorzuge ich diejenige mit dem höchsten Punktewert.",
    lang:
      "Stehen mehrere Ruffarben zur Wahl, unterscheiden sie sich nur in einem Punkt: wie viele Augen mein einzelner Spatz dieser Farbe wert ist. Ist meine punktreichste Farbkarte die Eichel-Zehn, rufe ich die Eichel-Sau — dann liegt die Sau zu meiner Zehn beim Partner. In deutlich mehr als der Hälfte der Sauspiele geht die Rufsau durch, und mit ihr kommen auch die zehn Augen meiner Zehn nach Hause. Das Kapitel zeigt das an einem Blatt, mit dem man streng genommen gar nicht spielen sollte (drei Farben, keine Sau) — als Letzter der Runde ist die Alternative aber das Zusammenwerfen, und das dreimalige „Weiter“ der Vorderleute lässt hoffen, dass die fehlenden Trümpfe gleichmäßig verteilt sind.",
  },
  {
    id: "trumpfrunden-erzwingen",
    kapitel: "1.4",
    seite: 15,
    titel: "Zu Beginn des Spiels mehrere Trumpfrunden anstreben",
    kurz: "Als die Partei mit der vermeintlich größeren Anzahl an Trümpfen sollten die Spielmacher versuchen, zu Beginn des Spiels mehrere Trumpfrunden zu erzwingen.",
    lang:
      "Mit jedem gegnerischen Trumpf, der vom Tisch ist, sinkt das Risiko für die Rufsau, gestochen zu werden. Deshalb erzwingt die spielende Partei gleich am Anfang zwei oder drei Trumpfrunden, um am Ende selbst die verbliebenen Trümpfe zu halten: müssen alle drei Mitspieler zweimal Trumpf bedienen, bleiben ihnen zusammen nur noch drei. Das Kapitel wägt aber auch das Gegenargument ab. Wer gleich mit dem Alten eröffnet, kommt sicher ans Ausspiel, gibt aber seinen höchsten Trumpf her und kann später keinen Stich mehr wirklich sicher festhalten. Hat der Ausspieler bereits Trumpf gebracht und dabei keinen der drei großen Ober gezeigt, stehen Gras- und Herz-Ober beim Gegner — dann ist es oft besser, im ersten Stich nur einen kleinen Trumpf zuzugeben und den höchsten zu behalten.",
  },
  {
    id: "nicht-selber-suchen",
    kapitel: "1.5",
    seite: 17,
    titel: "Als Spieler die Rufsau nicht selber suchen",
    kurz: "Die alte Schafkopfweisheit „Der Dumme sucht selber“ ist zutreffend.",
    lang:
      "Wer als Spielmacher selbst die Ruffarbe anspielt, offenbart sich den Gegnern als schwach: vermutlich ist er keine Farbe frei und hat nur vier Trümpfe — eine Einladung zur Spritze. Vor allem aber wird die Rufsau dann viel häufiger gestochen. Das Buch beziffert es: sucht der Spielmacher mit 1, 2 oder 3 Karten der Ruffarbe selbst, wird die Sau mit 30 %, 49 % beziehungsweise 75 % Wahrscheinlichkeit von einem Gegner gestochen; sucht dagegen ein Nichtspieler, sind es nur 11 %, 22 % und 48 %. Dasselbe gilt, wenn der gerufene Partner die Rufsau selbst ausspielt. Wer sich also schon zu einem zweifelhaften Sauspiel hat hinreißen lassen, sollte nicht den zweiten Fehler anschließen, sondern einen kleinen Trumpf spielen und auf einen trumpfstarken Partner hoffen.",
  },
  {
    id: "gesperrt-weiter-sagen",
    kapitel: "1.6",
    seite: 19,
    titel: "Gesperrt sein",
    kurz: "Als gesperrter Spieler lasse ich mich zu keinem schwachen Solo hinreißen, sondern sage emotionslos und ohne zu zögern „Weiter“.",
    lang:
      "„Gesperrt“ heißt: ich habe selbst zwei Sauen und von der dritten Farbe keine Karte — ein Rufspiel ist damit unmöglich, so schön die Trümpfe auch sein mögen. Für ein Alleinspiel reicht das Blatt aber nicht, und ein schwaches Solo aus Verlegenheit ist der schlechteste Ausweg. Es bleibt die Hoffnung, dass ein Mitspieler nach mir ein Sauspiel ansagt: erwischt er mich, sind wir wahrscheinlich unschlagbar; ruft er die Sau meiner freien Farbe, bin ich stark genug für eine Spritze. Wichtig ist dabei das Wie: schnell „Weiter“ sagen und das „Schlechte-Karten-Gesicht“ aufsetzen, um einen Mitspieler, der über ein mäßiges Sauspiel nachdenkt, nicht durch langes Zögern zu verunsichern.",
  },
  {
    id: "sich-rufen-lassen",
    kapitel: "1.7",
    seite: 21,
    titel: "Sich rufen lassen statt selber spielen",
    kurz: "Als Ausspieler kann ich mit vier Trümpfen und zwei Farb-Sauen auch einmal „Weiter“ sagen und darauf hoffen, von einem starken Partner gerufen zu werden.",
    lang:
      "Ein Sauspiel wäre mit diesem Blatt kein Fehler — halbwegs anständige Trümpfe, und zusammen mit der Sau des Partners beherrsche ich alle drei Farben. An Position 1 lohnt sich trotzdem das Kalkül, gerufen zu werden: bei zwei Sauen steht es dafür zwei zu eins. Wird ein starker Spieler mein Partner, ist das Spiel locker gewonnen, und hat er zusätzlich den Eichel-Ober, kommen ein paar Laufende dazu. Und selbst als Gegenspieler stehe ich mit diesem Blatt gut da. Die Rechnung hängt am Sitz: an Position 2 würde ich mit demselben Blatt auch noch eher „Weiter“ sagen, an Position 3 eher schon spielen, an Position 4 gäbe es nichts zu überlegen. Geht die Rechnung an einem Abend mehrfach nicht auf, weil die Runde wenig spielfreudig ist, spiele ich solche Blätter auch vorne selbst.",
  },
  {
    id: "hinterhand-vier-truempfe",
    kapitel: "1.8",
    seite: 23,
    titel: "Als Letzter mit schlechten Trümpfen spielen",
    kurz: "Haben alle drei Vorderleute „Weiter“ gesagt, kann ich als Spieler in Hinterhand auch einmal mit nur vier Trümpfen ein Sauspiel wagen.",
    lang:
      "Vier nicht besonders starke Trümpfe sind für ein Sauspiel eigentlich zu wenig — hier kommen aber drei Dinge hinzu. Erstens halte ich zusammen mit dem Partner alle drei Sauen: gehen sie durch und kommt der Herz-Ober zum Stich, muss mein Freund gar nicht stark sein. Zweitens haben alle vor mir „Weiter“ gesagt, die fehlenden Trümpfe sollten also einigermaßen gleich verteilt sein. Drittens habe ich mit dem Herz-Ober einen Bremser und muss im Fall einer Niederlage wenigstens keine laufenden Ober bezahlen. Kontrolliere ich alle drei Farben — meine Partei hat von jeder entweder die Sau oder keine Karte —, erlauben oft auch mittelmäßige Trümpfe ein Rufspiel. Das Risiko bleibt: ein Vordermann könnte gesperrt gewesen sein statt schwach, dann drohen Spritzen.",
  },
  {
    id: "trostlos-ansagen",
    kapitel: "1.9",
    seite: 25,
    titel: "Nichts zu verlieren haben",
    kurz: "Wenn ich hin und wieder mit einem trostlosen Blatt ein Sauspiel ansage, wirke ich schematischem Handeln entgegen und werde dadurch ein Stückchen weniger durchschaubar.",
    lang:
      "Diese Technik widerspricht offen den vorigen Kapiteln — und genau das ist ihr Zweck: nicht immer nach Schema F zu handeln. Mit einem trostlosen Blatt kann ich als Gegenpartei ohnehin nicht eingreifen, sondern nur verlieren. Eine kleine Gewinnchance entsteht erst, wenn ich locker ansage und mit etwas Glück einen potenten Mitspieler ziehe. Nebenbei verunsichere ich damit einen Hintermann, der gerade ein Herz-Solo oder einen Herz-Wenz überlegt: verhindere ich damit ein Alleinspiel, bezahle ich vielleicht nur ein verlorenes Sauspiel statt eines gewonnenen gegnerischen Solos. Zwei Einschränkungen nennt das Buch selbst. Ich mache solche Testspiele nur, wenn ich mit einem eigenen Ober einen Bremser habe und damit das Bezahlen von Laufenden verhindern kann. Und: der gerufene Mitspieler fühlt sich zu Recht verschaukelt, wenn er nach einer Spritze doppelt bezahlen muss — die Spielweise passt eher ins Turnier als in die private Runde.",
  },
  {
    id: "schmiertruempfe-zurueckhalten",
    kapitel: "1.10",
    seite: 27,
    titel: "Seine Schmiertrümpfe nicht ohne Not zugeben",
    kurz: "Solange nicht wirklich feststeht, welcher Mitspieler mein Partner ist, gebe ich meine Schmiertrümpfe nicht unüberlegt zu.",
    lang:
      "Der Ausspieler bringt Trumpf und muss folglich mein Partner sein — so die naheliegende Rechnung, und viele legen daraufhin bedenkenlos einen Schmiertrumpf dazu. Gelegentlich aber „lügt“ ein Kollege und bringt als Nichtspieler einen Trumpf; besonders mit einem blank stehenden großen Ober kann dieser Trick sich lohnen, weil der gegnerische Spielmacher öfter schmiert und praktisch nie übersticht. Mit einem trumpfstarken Blatt habe ich es gar nicht nötig, dieses Risiko einzugehen: die elf Augen bringe ich notfalls erst im letzten Stich nach Hause, und ich vergebe mir nichts, wenn ich meine Schmierkarte zurückhalte, bis ich Gewissheit habe. Der Umkehrschluss gilt auch: bekomme ich als gerufener Partner auf meinen Gras-Ober einen Schmiertrumpf vom Spielmacher, hat mein Freund vermutlich kein übermäßig starkes Blatt — sonst würde er mir nicht auf Verdacht wertvolle Punkte schenken.",
  },
  {
    id: "ruffarbe-abwerfen",
    kapitel: "1.11",
    seite: 29,
    titel: "Die Karte der Ruffarbe abwerfen",
    kurz: "Ist ein Gegenspieler offensichtlich die Ruffarbe frei, werfe ich mitunter eher eine blanke Karte der Ruffarbe ab, bevor ich in eine freie Farbe einsteche.",
    lang:
      "Der Ausspieler kommt mit einer kleinen Farbkarte heraus, sucht aber die Rufsau nicht — er wird die Ruffarbe also frei sein und hofft, unsere Sau zu stechen, sobald sein Partner suchen kann. Statt in die angespielte Farbe einzustechen, werde ich deshalb meine einzige Karte der Ruffarbe los: dann kann der freie Gegner unsere Sau später nicht mehr mit einem Schmiertrumpf bekommen. Einstechen ist die bessere Wahl in drei Fällen — wenn ich zwei Karten der Ruffarbe habe (das Abwerfen einer Fehlkarte nützt wenig, weil ich weiter bedienen muss), wenn ich die zwei höchsten Ober nachbringen und den freien Gegner in zwei bis drei Trumpfrunden entwaffnen kann, oder wenn in den ersten beiden Karten bereits Sau oder Zehn der angespielten Farbe auf dem Tisch liegen. In allen anderen Fällen mache ich mich lieber die Ruffarbe frei.",
  },
  {
    id: "freie-farbe-des-partners-lesen",
    kapitel: "1.12",
    seite: 31,
    titel: "Die freie Farbe des Partners anspielen",
    kurz: "Bringt der gerufene Partner früh im Spiel eine Farbe, will er mir als Spielmacher damit oftmals andeuten, die dritte Farbe frei zu sein.",
    lang:
      "Der Partner gibt sich zu erkennen, indem er die gerufene Sau ausspielt — setzt dann aber nicht mit Trumpf nach, sondern mit einer kleinen Farbkarte. Das kann heißen, dass er schlicht keinen Trumpf hat. In der Mehrzahl der Fälle steckt jedoch eine feinsinnige Mitteilung dahinter: er zeigt an, dass es eine Farbe gibt, die er frei ist und für uns stechen würde. Welche das ist, ist leicht zu sehen — ist Eichel die Ruffarbe und wird Gras gespielt, kann es nur die dritte Farbe sein. Ich nehme das Angebot an und bringe sofort einen meiner Schelln-Spatzen; komme ich später erneut ans Ausspiel, auch den zweiten, sofern ich meinem Partner noch einen Trumpf zutraue. Selbst wenn er die Farbe nur mangels Trumpf gespielt hat, mache ich damit nichts schlechter: Schelln käme ohnehin irgendwann auf den Tisch. Dies ist die Spielerseite von Kapitel 2.6, wo derselbe Vorgang aus Sicht des Partners steht.",
  },
  {
    id: "nach-spritze-ungewoehnlich",
    kapitel: "1.13",
    seite: 33,
    titel: "Nach einer Spritze ungewöhnlich spielen",
    kurz: "Nach einer Spritze spiele ich ungewöhnlich.",
    lang:
      "Durch die Spritze ist die sonst unterstellte Trumpfhoheit der Spielerpartei Makulatur: der Gegner ist mindestens ebenbürtig auf Trumpf und lässt sich nicht mit den üblichen Trumpfrunden ausschalten. Ein Strategiewechsel ist damit fast Pflicht. Normalerweise hätte ich nach der Regel „Spieler spielt Trumpf“ ein kleines Herz gebracht; nach der Spritze bleibt als „nicht normal“ nur, mit einer Farbe zu kommen — also bringe ich Eichel und suche meinen Partner ausnahmsweise selbst. Dass der Spritzengeber die Farbe bedient, erwarte ich gar nicht; eher wird er einstechen, und ich hoffe nur, dass der Stich nicht zu teuer wird. Immerhin ist er dann einen Trumpf kürzer und muss gegen mich in Hinterhand fortsetzen. Meine nächste Karte wäre dann nicht wieder Eichel, sondern ein kleiner Trumpf — Spieler 2 soll keinen Spatz abwerfen und sich eine Farbe freimachen können.",
  },
  {
    id: "wesensart-des-rufspiels",
    kapitel: "1.14",
    seite: 35,
    titel: "Auf die Wesensart des Rufspiels eingehen",
    kurz: "Wenn es die Not gebietet, weiche ich auch einmal von den Standardregeln ab.",
    lang:
      "Ich eröffne planmäßig mit dem Alten, um am Ausspiel zu bleiben und Trumpfrunden zu erzwingen — und muss mit Grauen sehen, dass Spieler 4 trumpffrei ist und schmiert. Er ist also mein Partner, hat aber keinen einzigen Trumpf. Habe ich fünf Trümpfe und er keinen, halten die Gegner zusammen neun; einer von ihnen hat mindestens fünf, vielleicht sechs. Spiele ich jetzt klassisch weiter, gehen mir die Trümpfe schneller aus als mir lieb ist, und schlimmstenfalls spielt der Gegner selbst Trumpf und nimmt mir den letzten ab. Um eine Gewinnchance zu wahren, muss ich die Strategie umgehend ändern und das Spiel über die Farben gewinnen: meine beiden blanken Sauen und die Rufsau des Partners sind unsere einzigen brauchbaren „Trümpfe“. Also bringe ich in der zweiten Runde die Gras-Sau und, wenn ich am Stich bleibe, die Schelln-Sau. Für die Gegenspieler gilt dasselbe umgekehrt — sie sollten immer das tun, was den Wünschen der Spielerpartei entgegenläuft.",
  },
  {
    id: "trumpf-spielen-als-partner",
    kapitel: "2.1",
    seite: 39,
    titel: "Sich durch Trumpfspielen als Partner zeigen",
    kurz: "Spieler spielt Trumpf, Nichtspieler spielt Farbe.",
    lang:
      "Der Rufende hat im Regelfall die Trumpfhoheit, deshalb forciert die spielende Partei zunächst mehrere Trumpfrunden: sind die Gegner trumpflos, kann die Rufsau gefahrlos nach Hause gebracht werden. Bin ich als gerufener Partner in der ersten Runde am Ausspiel, bringe ich also Trumpf und gebe mich damit zu erkennen. Bis auf wenige Ausnahmen ist es günstig, den höchsten zu spielen — das hilft dem Spielmacher, meine Stärke einzuschätzen. Die Reihenfolge ist dabei nicht gleichgültig: bringe ich in der zweiten Runde die kleine Karte statt des zweiten Obers, bin anschließend ich am Ausspiel und nicht mein Partner, und ohne weiteren Trumpf habe ich dann keinen sicheren Weg, ihn wieder an den Stich zu bringen. Keinen Trumpf spiele ich als gerufener Partner eigentlich nur, wenn ich gar keinen habe oder davonlaufen möchte — komme ich mit einer der beiden anderen Farben heraus, hält mich mein Partner für einen Gegner und übersticht mich gegebenenfalls.",
  },
  {
    id: "davonlaufen-abwaegen",
    kapitel: "2.2",
    seite: 41,
    titel: "Sich durch Davonlaufen als Partner zeigen",
    kurz: "Bevor ich ohne die Zehn der Ruffarbe davonlaufe, wäge ich das Für und Wider sorgfältig ab.",
    lang:
      "Mit der Rufsau und drei weiteren Karten derselben Farbe erlauben die Regeln das Davonlaufen. Hier ist es richtig, weil ich die Zehn der Ruffarbe selbst habe — der Stich geht zwar an die Gegenpartei, aber mit Acht und Neun stehen noch kleine Karten aus, und wir geben hoffentlich nicht viele Punkte ab. Zum Davonlaufen nehme ich dabei nicht die Sieben, sondern den König, obwohl das den Gegnern vier Punkte mehr bringt: sonst könnte mein Partner die Acht zugeben, Spieler 3 mit der Neun übernehmen und dessen Hintermann eine Schmierkarte dazulegen. Mit dem König muss die Gegenpartei wenigstens einen Trumpf einsetzen. Habe ich die Zehn der Ruffarbe dagegen nicht, überlege ich dreimal: nicht selten ruft der Spielmacher die Sau mit einer blanken Zehn, und hat der freie Gegenspieler dann noch einen Schmiertrumpf, gehen mindestens 20 Punkte mühelos an die Gegner. Ist es sinnvoll, 20 Punkte zu verschenken, um elf zu retten?",
  },
  {
    id: "nicht-davonlaufen-bei-fuenf",
    kapitel: "2.3",
    seite: 43,
    titel: "Nicht davonlaufen bei fünffach besetzter Rufsau",
    kurz: "Mit der Rufsau und insgesamt fünf Karten der Ruffarbe brauche ich nicht davonzulaufen, weil die Gegenspieler ohnehin nicht suchen können.",
    lang:
      "Das Davonlaufen ist eine Kann- und keine Muss-Regel. Halte ich fünf Karten der Ruffarbe und hat mein Partner die sechste, liegen alle Karten dieser Farbe in unseren Händen — kein Gegenspieler kann die Rufsau suchen. Davonzulaufen würde den Gegnern nur einen mächtigen Stich bescheren: spätestens der zweite freie Nichtspieler erkennt Freund und Feind und schmiert kräftig, oder er wirft eine blanke Karte ab und macht sich eine Farbe frei, worauf sein Freund umgehend diese Farbe nachbringt. Auch das Argument „damit sich mein Partner von Anfang an auskennt“ trägt nicht: das Ausspielen einer Trumpfkarte bewirkt dasselbe. Je mehr gute Trümpfe ich als gerufener Partner habe, desto fragwürdiger ist das Davonlaufen — und habe ich gar keinen Trumpf, bringe ich eben eine andere Farbe. Der einzige kleine Vorteil bliebe, die Rufsau anschließend schmieren zu dürfen.",
  },
  {
    id: "partner-in-hinterhand-manoevrieren",
    kapitel: "2.4",
    seite: 45,
    titel: "Die Gegenspieler in Mittelhand bringen",
    kurz: "Gelegentlich ist es vorteilhaft, wenn ich durch Überstechen des Partners oder durch Verzichten auf einen Stich meinen Freund oder mich selbst in die Hinterhandposition manövriere.",
    lang:
      "Mein Partner hat den Stich mit der Schelln-Sau bereits für uns übernommen — die naheliegende Zugabe wäre meine Gras-Zehn. Bevor ich sie werfe, gehe ich durch, wie er fortsetzen könnte. Im Idealfall käme er mit dem Alten heraus, auf den ich meine Trumpf-Zehn schmiere, und brächte danach ein kleines Herz. Kann er aber nur mit dem Blauen oder gar nur dem Roten nachsetzen, wären sowohl mein Schelln-Ober als auch meine Trumpf-Zehn ungünstige Zugaben, weil beide Gegner hinter uns sitzen und nach Belieben unterstehen oder mit dem Alten übernehmen und schmieren können. Die Initiative läge dann bei der Gegenpartei. Um die Kontrolle zu behalten, schmiere ich deshalb nicht, sondern reiße den Stich — nach einer kleinen Denkpause, um den Partner nicht zu verwirren — mit meiner Herz-Zehn an mich. Damit rutscht er in die Hinterhand und kann abwarten, wie die Gegner auf meinen nachgespielten Schelln-Ober reagieren.",
  },
  {
    id: "spielplan-des-spielmachers",
    kapitel: "2.5",
    seite: 47,
    titel: "Auf den Spielplan des Spielmachers eingehen",
    kurz: "Hat der Spielmacher eine Farbkarte ausgespielt, gehe ich als gerufener Partner auf seine Strategie ein und bringe im weiteren Verlauf statt Trumpf ebenfalls Farbe.",
    lang:
      "Der rufende Spieler ist der Impulsgeber der Runde: nur er weiß, wie das Spiel angelegt werden muss. Meine Aufgabe als gerufener Partner besteht nicht darin, es selbst zu gestalten, sondern seinen Gewinnplan zu unterstützen. Spielt er Trumpf, spiele ich Trumpf und beginne dabei mit meinem höchsten. Sucht er hier aber selbst die Rufsau, bringt also eine Farbe, deutet er damit an, eher schwach in Trumpf zu sein — dann wird er die beiden anderen Farben beherrschen, indem er entweder deren Sauen hat oder sie ganz frei ist. Also gehe ich auf sein Spiel ein und bringe ebenfalls Farbe: mit einer weiteren Sau zuerst diese; ohne Sau eine kleine Farbkarte, und zwar die kurze Farbe, wenn mein Partner direkt hinter mir sitzt, sonst eher die lange. Auch wenn der Spieler zunächst Trumpf spielt und erst im Lauf des Spiels mit dem Farbenspiel beginnt, folge ich ihm und bringe ab diesem Moment ebenfalls keinen Trumpf mehr.",
  },
];

export const STELLUNGEN = [
  {
    id: "b1-1.1-s8",
    regelId: "kontrolle-zweier-farben",
    seite: 8,
    spiel: { type: "sauspiel", suit: "S" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    hinweis:
      "Vor der Ansage abgebildet. Der Kopf der Übung nennt schon die Schelln-Sau, weil das Blatt sonst nicht zu sortieren wäre — die Lösung steht in den Antwortmöglichkeiten.",
    lage:
      "Du bist in Vorhand. Fünf Trümpfe: der Alte, der Schelln-Ober, der Schelln-Unter, dazu Trumpf-Zehn und Herz-Sieben. An Farbe hast du Gras-Zehn und Gras-König sowie eine einzelne Schelln-Sieben — Eichel bist du frei.",
    stich: [],
    hand: ["EO", "SO", "SU", "HX", "H7", "GX", "GK", "S7"],
    frage: "Soll ich ein Sauspiel machen oder Weiter sagen?",
    optionen: ["Ein Sauspiel mit der Schelln-Sau", "Ein Sauspiel mit der Gras-Sau", "Weiter sagen"],
    loesung: ["Ein Sauspiel mit der Schelln-Sau"],
    loesungstext: "Ein Sauspiel mit der Schelln-Sau",
    begruendung:
      "Das ist der Urtyp des soliden Rufspiels: fünf Trümpfe, darunter einer der drei höchsten Ober, ein Schmiertrumpf und eine freie Farbe. Zwei Farben hast du damit unter Kontrolle — Schelln über die Sau des Partners, Eichel, weil du dort einstechen kannst. Die Gras-Sau zu rufen wäre der Fehler: dann bliebe Schelln als dritte Farbe offen, und die beiden Gras-Karten müsstest du weiter bedienen.",
  },
  {
    id: "b1-1.2-s10",
    regelId: "drei-farben-ohne-sauen-meiden",
    seite: 10,
    spiel: { type: "sauspiel", suit: "G" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    hinweis:
      "Vor der Ansage abgebildet. Das Buch nennt keine Ruffarbe, weil die Antwort „Weiter“ lautet; die Gras-Sau im Kopf der Übung ist nur die Sortierhilfe.",
    lage:
      "Du bist in Vorhand. Fünf mittelmäßige Trümpfe: Gras-Ober, Eichel-Unter, Trumpf-Zehn, Herz-Neun und Herz-Sieben. An Farbe je eine einzelne Karte in allen drei Farben — Eichel-Sieben, Gras-König, Schelln-König. Keine Sau, keine freie Farbe.",
    stich: [],
    hand: ["GO", "EU", "HX", "H9", "H7", "E7", "GK", "SK"],
    frage: "Soll ich ein Sauspiel machen oder Weiter sagen?",
    optionen: ["Weiter sagen", "Ein Sauspiel mit der Gras-Sau", "Ein Sauspiel mit der Schelln-Sau"],
    loesung: ["Weiter sagen"],
    loesungstext: "Weiter sagen",
    begruendung:
      "Fünf Trümpfe klingen nach genug, aber die Kontrolle über eine zweite Farbe fehlt: du musst in allen drei Farben bedienen und hältst keine einzige Sau. Dein Partner hat mit knapp 50 Prozent (genau 47,4 %) keine weitere Sau neben der Rufsau — in fast der Hälfte der Fälle liegen also beide anderen Farb-Sauen bei den Gegnern und damit zwei punktreiche Farbstiche. Im Turnier rufen viele Fortgeschrittene trotzdem, weil sie ohne eigene Sau nicht gerufen werden können; das Buch hält dagegen, dass sie damit das stillschweigende Versprechen an ihren Partner brechen, der stärkste Spieler am Tisch zu sein. „Weiter“ kostet nichts: neues Spiel, neues Glück.",
  },
  {
    id: "b1-1.3-s12",
    regelId: "sau-zur-zehn-rufen",
    seite: 12,
    spiel: { type: "sauspiel", suit: "E" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 4,
    spielmacher: 4,
    hinweis: "Vor der Ansage abgebildet; welche Sau in Frage kommt, ist gerade die Aufgabe.",
    lage:
      "Alle drei Vorderleute haben „Weiter“ gesagt, du sitzt in Hinterhand. Fünf schöne Trümpfe: Eichel- und Gras-Ober, der Eichel-Unter, dazu Herz-Sau und Herz-König. An Farbe: Eichel-Zehn, Gras-König, Schelln-Neun — drei Farben, keine Sau.",
    stich: [],
    hand: ["EO", "GO", "EU", "HA", "HK", "EX", "GK", "S9"],
    frage: "Welche Sau soll ich rufen?",
    optionen: ["Die Eichel-Sau", "Die Gras-Sau", "Die Schelln-Sau", "Weiter sagen"],
    loesung: ["Die Eichel-Sau"],
    loesungstext: "Ein Sauspiel mit der Eichel-Sau",
    begruendung:
      "Alle drei Farben stehen einzeln, die Wahl entscheidet sich also allein am Punktewert deines Spatzen: die Eichel-Zehn bringt zehn Augen mit nach Hause, der Gras-König vier, die Schelln-Neun keins. In deutlich mehr als der Hälfte der Sauspiele geht die Rufsau durch — dann liegt die Sau zu deiner Zehn beim Partner. Streng nach Kapitel 1.2 dürftest du mit drei Farben ohne Sau gar nicht spielen; als Letzter der Runde ist die Alternative aber das Zusammenwerfen, und drei „Weiter“ lassen auf gleichmäßig verteilte Trümpfe hoffen.",
  },
  {
    id: "b1-1.4-s14",
    regelId: "trumpfrunden-erzwingen",
    seite: 14,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 2,
    spielmacher: 2,
    lage:
      "Du hast mit der Eichel-Sau gespielt und sitzt an Position 2. Spieler 1 eröffnet mit der Herz-Acht und zeigt sich damit als dein mutmaßlicher Partner. Du hast den Alten, Herz-Unter, Herz-Sau, Herz-König und die Herz-Sieben, dazu Eichel-König, Gras-Sau und Gras-Sieben. Schelln bist du frei.",
    stich: [{ sitz: 1, card: "H8" }],
    hand: ["EO", "HU", "HA", "HK", "H7", "EK", "GA", "G7"],
    frage: "Welchen Trumpf soll ich zugeben?",
    loesung: ["EO"],
    loesungstext: "Den Eichel-Ober",
    begruendung:
      "Mit dem Alten übernimmst du sicher und bleibst am Ausspiel, um danach ein kleines Herz nachzubringen — jeder gezogene gegnerische Trumpf erhöht die Überlebenschancen der Rufsau und deiner Gras-Sau, und deine Herz-Sau bekommt weniger Konkurrenz im Kampf um deine freie Farbe Schelln. Nur mit dem Herz-Unter zuzugeben und den Alten zu behalten wäre die Alternative; sie kostet dich aber das Ausspielrecht und damit die Trumpfrunde, auf die dein ganzer Plan gebaut ist.",
  },
  {
    id: "b1-1.5-s16",
    regelId: "nicht-selber-suchen",
    seite: 16,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Du hast mit der Eichel-Sau gespielt und bist in Vorhand am Ausspiel. Vier Trümpfe — der Alte, Herz-Unter, Herz-Sau, Herz-Sieben —, dazu die Eichel-Zehn als einzige Karte der Ruffarbe und Gras-Zehn, -König und -Sieben. Schelln bist du frei.",
    stich: [],
    hand: ["EO", "HU", "HA", "H7", "EX", "GX", "GK", "G7"],
    frage: "Soll ich die Rufsau selber suchen?",
    optionen: ["Ja", "Nein"],
    loesung: ["Nein"],
    loesungstext: "Nein — lieber einen kleinen Trumpf spielen",
    begruendung:
      "„Der Dumme sucht selber.“ Suchst du mit einer Karte der Ruffarbe selbst, wird die Rufsau zu 30 Prozent von einem Gegner gestochen; sucht ein Nichtspieler, sind es nur 11 Prozent. Dazu verrätst du deine Schwäche: wer selbst sucht, hat meist keine freie Farbe und nur vier Trümpfe — eine Einladung zur Spritze. Spiel stattdessen die Herz-Sieben und hoffe auf einen trumpfstarken Partner, der die Farbe für dich bringt.",
  },
  {
    id: "b1-1.6-s18",
    regelId: "gesperrt-weiter-sagen",
    seite: 18,
    spiel: { type: "sauspiel", suit: "E" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    hinweis:
      "Mit diesem Blatt ist gar kein Rufspiel möglich — es ist gesperrt. Die Eichel-Sau im Kopf der Übung dient nur der Sortierung; du hast keine einzige Eichel-Karte.",
    lage:
      "Du bist in Vorhand. Fünf ordentliche Trümpfe: Eichel- und Schelln-Ober, Gras- und Herz-Unter, dazu der Herz-König. An Farbe hältst du Gras-Sau, Gras-König und die Schelln-Sau — Eichel bist du komplett frei.",
    stich: [],
    hand: ["EO", "SO", "GU", "HU", "HK", "GA", "GK", "SA"],
    frage: "Soll ich spielen oder Weiter sagen?",
    optionen: ["Weiter sagen", "Ein Herz-Solo", "Ein Sauspiel"],
    loesung: ["Weiter sagen"],
    loesungstext: "Weiter sagen",
    begruendung:
      "Du bist gesperrt: zwei Sauen in der Hand, von der dritten Farbe keine Karte — ein Rufspiel ist unmöglich, denn zu Gras und Schelln hast du die Sau selbst, und Eichel kannst du mangels Karte nicht rufen. Für ein Alleinspiel reicht das Blatt nicht, und ein schwaches Solo aus Verlegenheit ist der schlechteste Ausweg. Sag schnell und emotionslos „Weiter“ und hoffe, dass jemand nach dir ansagt: erwischt er dich, seid ihr kaum zu schlagen; ruft er die Eichel-Sau, bist du stark genug für eine Spritze.",
  },
  {
    id: "b1-1.7-s20",
    regelId: "sich-rufen-lassen",
    seite: 20,
    spiel: { type: "sauspiel", suit: "S" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    hinweis: "Vor der Ansage abgebildet; die Schelln-Sau im Kopf ist nur die Sortierhilfe.",
    lage:
      "Du bist in Vorhand. Vier Trümpfe — Gras- und Herz-Ober, Trumpf-Zehn und Herz-Sieben — dazu zwei Farb-Sauen in Eichel und Gras sowie Schelln-König und Schelln-Sieben.",
    stich: [],
    hand: ["GO", "HO", "HX", "H7", "EA", "GA", "SK", "S7"],
    frage: "Soll ich ein Sauspiel machen oder Weiter sagen?",
    optionen: ["Eher Weiter sagen", "Ein Sauspiel mit der Schelln-Sau"],
    loesung: ["Eher Weiter sagen"],
    loesungstext: "Eher Weiter sagen und sich rufen lassen",
    begruendung:
      "Ein Sauspiel wäre kein Fehler — mit der Schelln-Sau des Partners beherrschst du alle drei Farben. An Position 1 lohnt aber das Kalkül, gerufen zu werden: bei zwei Sauen steht es dafür zwei zu eins. Wird ein starker Spieler dein Partner, ist das Spiel locker gewonnen, und hat er obendrein den Alten, kommen Laufende dazu. Die Rechnung hängt am Sitz: an Position 3 würdest du eher selbst spielen, an Position 4 gäbe es nichts zu überlegen.",
  },
  {
    id: "b1-1.8-s22",
    regelId: "hinterhand-vier-truempfe",
    seite: 22,
    spiel: { type: "sauspiel", suit: "E" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 4,
    spielmacher: 4,
    hinweis: "Vor der Ansage abgebildet; die Eichel-Sau im Kopf ist nur die Sortierhilfe.",
    lage:
      "Alle drei Vorderleute haben „Weiter“ gesagt, du sitzt in Hinterhand. Vier eher schwache Trümpfe: Herz-Ober, Gras-Unter, Herz-Neun und Herz-Sieben. Dazu die Eichel-Neun als einzige Karte der Ruffarbe, Gras-Sau, Gras-König und die Schelln-Sau.",
    stich: [],
    hand: ["HO", "GU", "H9", "H7", "E9", "GA", "GK", "SA"],
    frage: "Soll ich ein Sauspiel machen oder Weiter sagen?",
    optionen: ["Ein Sauspiel mit der Eichel-Sau", "Weiter sagen"],
    loesung: ["Ein Sauspiel mit der Eichel-Sau"],
    loesungstext: "Ein Sauspiel mit der Eichel-Sau",
    begruendung:
      "Vier schwache Trümpfe sind eigentlich zu wenig — hier kommen drei Dinge zusammen. Zusammen mit dem Partner hältst du alle drei Sauen: gehen sie durch und kommt der Herz-Ober zum Stich, muss dein Freund gar nicht stark sein. Die drei „Weiter“ vor dir sprechen für gleichmäßig verteilte Trümpfe. Und mit dem Herz-Ober hast du einen Bremser, musst im Verlustfall also keine Laufenden zahlen. Wer alle drei Farben kontrolliert, darf auch mit mittelmäßigen Trümpfen rufen.",
  },
  {
    id: "b1-1.9-s24",
    regelId: "trostlos-ansagen",
    seite: 24,
    spiel: { type: "sauspiel", suit: "S" },
    label: "Ansage — noch ist nichts gesagt",
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    hinweis: "Vor der Ansage abgebildet; die Schelln-Sau im Kopf ist nur die Sortierhilfe.",
    lage:
      "Du bist in Vorhand. Vier magere Trümpfe: Herz-Ober, Eichel- und Gras-Unter, Herz-Sieben. Dazu Eichel-Neun und -Sieben, der Gras-König und die Schelln-Zehn — drei Farben, keine Sau.",
    stich: [],
    hand: ["HO", "EU", "GU", "H7", "E9", "E7", "GK", "SX"],
    frage: "Soll ich ein Sauspiel machen oder Weiter sagen?",
    optionen: ["Weiter sagen", "Ein Sauspiel mit der Schelln-Sau"],
    loesung: ["Weiter sagen"],
    loesungstext: "Eigentlich ein klares Weiter — aber hin und wieder mit so einem Blatt auch einmal spielen",
    begruendung:
      "Nach dem Buchstaben der Kapitel 1.1 und 1.2 ist das ein klares „Weiter“. Genau darin liegt aber der Reiz des Gegenteils: Mit diesen Karten kannst du als Gegenpartei ohnehin nicht eingreifen, sondern nur verlieren — eine kleine Gewinnchance entsteht erst, wenn du locker ansagst und einen potenten Partner ziehst. Nebenbei verunsicherst du einen Hintermann, der über ein Herz-Solo nachdenkt. Zwei Bedingungen nennt das Buch selbst: nur mit einem eigenen Ober als Bremser, und eher im Turnier als in der Freundesrunde, wo sich ein gerufener Partner nach einer Spritze zu Recht verschaukelt fühlt. Gerufen würde die Schelln-Sau — zur Zehn, dem punktreichsten Einzelgänger.",
  },
  {
    id: "b1-1.10-s26",
    regelId: "schmiertruempfe-zurueckhalten",
    seite: 26,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 2,
    spielmacher: 2,
    lage:
      "Du hast mit der Eichel-Sau gespielt und sitzt an Position 2. Spieler 1 eröffnet mit dem Gras-Ober — also wohl dein Partner. Dein Blatt ist trumpfstark: der Alte, Herz-Ober, Eichel- und Herz-Unter, Herz-Sau und Herz-Sieben, dazu der Eichel-König und eine blanke Schelln-Sieben.",
    stich: [{ sitz: 1, card: "GO" }],
    hand: ["EO", "HO", "EU", "HU", "HA", "H7", "EK", "S7"],
    frage: "Welchen Trumpf soll ich zugeben?",
    loesung: ["H7"],
    loesungstext: "Die Herz-Sieben",
    begruendung:
      "Der Trumpf des Ausspielers legt nahe, dass er dein Partner ist — sicher ist es aber nicht. Gelegentlich „lügt“ ein Nichtspieler und eröffnet mit einem blank stehenden großen Ober, gerade weil der Spielmacher dann bereitwillig schmiert. Mit sechs Trümpfen hast du es nicht nötig, dieses Risiko einzugehen: die elf Augen deiner Trumpf-Sau bringst du notfalls im letzten Stich nach Hause. Der Umkehrschluss gilt übrigens auch — bekommst du als gerufener Partner auf deinen Ober einen Schmiertrumpf, ist dein Freund vermutlich nicht übermäßig stark.",
  },
  {
    id: "b1-1.11-s28",
    regelId: "ruffarbe-abwerfen",
    seite: 28,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 3,
    spielmacher: 3,
    lage:
      "Du hast mit der Eichel-Sau gespielt und sitzt an Position 3. Spieler 1 eröffnet mit der Schelln-Sieben — er sucht die Rufsau also nicht und wird die Ruffarbe frei sein. Spieler 2 legt den Schelln-König dazu. Du bist Schelln frei und hältst den Alten, Herz-Ober, Gras-Unter, Herz-Sau und Herz-Sieben, dazu den Eichel-König als einzige Karte der Ruffarbe sowie Gras-Sau und Gras-Zehn.",
    stich: [{ sitz: 1, card: "S7" }, { sitz: 2, card: "SK" }],
    hand: ["EO", "HO", "GU", "HA", "H7", "EK", "GA", "GX"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["EK"],
    loesungstext: "Den Eichel-König",
    begruendung:
      "Wer als Nichtspieler die Rufsau nicht sucht, ist die Ruffarbe meist frei und hofft, sie später mit einem Schmiertrumpf zu stechen. Wirfst du deine einzige Eichel-Karte ab, kann er das nicht mehr: du bist die Ruffarbe frei und musst nicht mehr bedienen. Übernimmt Spieler 4 mit der Schelln-Sau und sucht Eichel, hast du mit dem Alten immer den höheren Trumpf und holst eure Sau zurück — im ungünstigsten Fall kostet der Stich 19 Punkte statt der 25 oder 35, die ein Suchen mit der Zehn gebracht hätte. Einstechen wäre besser bei zwei Karten der Ruffarbe, mit den zwei höchsten Obern zum Nachziehen, oder wenn schon Sau oder Zehn in Schelln auf dem Tisch lägen.",
  },
  {
    id: "b1-1.12-s30",
    regelId: "freie-farbe-des-partners-lesen",
    seite: 30,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 2,
    spielmacher: 2,
    gespielt: ["EX", "HK"],
    lage:
      "Zwei Stiche sind gespielt. Spieler 1 hat sich sofort als dein Partner gezeigt, indem er die gerufene Eichel-Sau ausspielte — du gabst die Eichel-Zehn zu. Statt mit Trumpf nachzusetzen, brachte er dann eine kleine Gras-Karte; du hast mit dem Herz-König gestochen und bist am Ausspiel. Es bleiben dir Gras- und Herz-Ober, der Eichel-Unter, die Herz-Sieben sowie Schelln-König und Schelln-Sieben.",
    stich: [],
    hand: ["GO", "HO", "EU", "H7", "SK", "S7"],
    frage: "Welche Karte soll ich nachspielen?",
    loesung: ["SK"],
    loesungstext: "Den Schelln-König",
    begruendung:
      "Dass dein Partner nach der Rufsau nicht Trumpf, sondern Farbe bringt, kann heißen, dass er trumpflos ist. Meist steckt aber eine Mitteilung dahinter: es gibt eine Farbe, die er frei ist und für euch stechen würde. Welche, ist leicht zu sehen — Eichel ist die Ruffarbe, gespielt wurde Gras, also bleibt nur die dritte Farbe Schelln. Nimm das Angebot an. Selbst wenn er die Farbe nur mangels Trumpf gespielt hat, machst du damit nichts schlechter: Schelln käme ohnehin irgendwann auf den Tisch. Kommst du später erneut ans Ausspiel, folgt die zweite Schelln-Karte.",
  },
  {
    id: "b1-1.13-s32",
    regelId: "nach-spritze-ungewoehnlich",
    seite: 32,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    lage:
      "Du hast in Vorhand mit der Eichel-Sau gespielt — und Spieler 2 hat sofort „Spritze!“ gesagt. Fünf Trümpfe: Gras-Ober, Gras-Unter, Herz-Sau, Herz-König, Herz-Neun. Dazu Eichel-Zehn, -Neun und -Sieben; Gras und Schelln bist du frei.",
    stich: [],
    hand: ["GO", "GU", "HA", "HK", "H9", "EX", "E9", "E7"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["E7"],
    loesungstext: "Die Eichel-Sieben",
    begruendung:
      "Durch die Spritze ist die sonst unterstellte Trumpfhoheit der Spielerpartei Makulatur: der Gegner ist mindestens ebenbürtig und lässt sich nicht mit den üblichen Trumpfrunden ausschalten. Normal wäre nach „Spieler spielt Trumpf“ ein kleines Herz — „nicht normal“ bleibt nur die Farbe. Also suchst du deinen Partner ausnahmsweise selbst. Dass der Spritzengeber bedient, erwartest du gar nicht; sticht er ein, ist er einen Trumpf kürzer und muss gegen dich in Hinterhand fortsetzen. Deine nächste Karte wäre dann nicht wieder Eichel, sondern ein kleiner Trumpf — damit Spieler 2 keinen Spatz abwerfen und sich freimachen kann.",
  },
  {
    id: "b1-1.14-s34",
    regelId: "wesensart-des-rufspiels",
    seite: 34,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "rufender Spieler",
    ich: 1,
    spielmacher: 1,
    gespielt: ["EO"],
    lage:
      "Du hast in Vorhand mit der Eichel-Sau gespielt und planmäßig mit dem Alten eröffnet, um am Ausspiel zu bleiben. Spieler 2 gab die Herz-Neun, Spieler 3 die Herz-Sieben — und Spieler 4 schmierte die Eichel-Zehn: er ist trumpffrei und damit dein Partner ohne einen einzigen Trumpf. Dir bleiben Schelln-Ober, Gras-Unter, Herz-König und Herz-Acht, dazu Eichel-König, Gras-Sau und Schelln-Sau.",
    stich: [],
    hand: ["SO", "GU", "HK", "H8", "EK", "GA", "SA"],
    frage: "Welche Karte soll ich nachspielen?",
    loesung: ["GA", "SA"],
    loesungstext: "Die Gras- oder die Schelln-Sau",
    begruendung:
      "Die Rechnung ist unerfreulich: hattest du fünf Trümpfe und dein Freund keinen, halten die Gegner zusammen neun — einer von ihnen mindestens fünf. Spielst du klassisch weiter Trumpf, gehen dir die Trümpfe schneller aus als ihnen, und schlimmstenfalls zieht der Gegner dir selbst den letzten ab. Also Strategiewechsel: das Spiel muss über die Farben gewonnen werden. Deine beiden blanken Sauen und die Rufsau des Partners sind eure einzigen brauchbaren „Trümpfe“. Dein Partner sitzt in Hinterhand und kann situationsbedingt reagieren — bleiben die Sauen hoch, schmiert er risikofrei; wird eine gestochen, weicht er mit einer Lusche aus.",
  },
  {
    id: "b1-2.1-s38",
    regelId: "trumpf-spielen-als-partner",
    seite: 38,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "gerufener Partner",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 hat mit der Eichel-Sau gespielt — die du hast. Du bist in Vorhand am Ausspiel. Drei Trümpfe: Eichel-Ober, Herz-Ober, Herz-Neun. Dazu die Rufsau und der Eichel-König sowie Gras-König, -Neun und -Sieben.",
    stich: [],
    hand: ["EO", "HO", "H9", "EA", "EK", "GK", "G9", "G7"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["EO"],
    loesungstext: "Den Eichel-Ober",
    begruendung:
      "„Spieler spielt Trumpf, Nichtspieler spielt Farbe.“ Mit Trumpf gibst du dich dem Spielmacher als Partner zu erkennen, und zwar mit dem höchsten — das hilft ihm, deine Stärke einzuschätzen. Die Reihenfolge ist nicht gleichgültig: auf den Alten folgt im zweiten Ausspiel der Herz-Ober und danach die Herz-Neun; brächtest du in der zweiten Runde zuerst die Neun, wärst anschließend du am Ausspiel und nicht dein Partner — und ohne vierten Trumpf hättest du keinen sicheren Weg, ihn wieder an den Stich zu bringen.",
  },
  {
    id: "b1-2.2-s40",
    regelId: "davonlaufen-abwaegen",
    seite: 40,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "gerufener Partner",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 hat mit der Eichel-Sau gespielt — du hast sie, dazu Eichel-Zehn, -König und -Sieben: vier Karten der Ruffarbe, du darfst also davonlaufen. An Trumpf nur Herz-Unter und Herz-König, dazu Gras-Neun und Schelln-König. Du bist in Vorhand.",
    stich: [],
    hand: ["HU", "HK", "EA", "EX", "EK", "E7", "G9", "SK"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["EK"],
    loesungstext: "Den Eichel-König — davonlaufen, aber nicht mit der Sieben",
    begruendung:
      "Davonlaufen ist hier richtig, weil du die Zehn der Ruffarbe selbst hast: der Stich geht zwar an die Gegenpartei, aber mit Acht und Neun stehen noch kleine Karten aus. Nimm dazu aber nicht die Sieben, sondern den König — auch wenn das den Gegnern vier Punkte mehr bringt. Sonst könnte dein Partner auf die Sieben die Acht zugeben, Spieler 3 mit der Neun übernehmen und dessen Hintermann eine Schmierkarte dazulegen. Mit dem König muss die Gegenpartei wenigstens einen Trumpf einsetzen.",
  },
  {
    id: "b1-2.3-s42",
    regelId: "nicht-davonlaufen-bei-fuenf",
    seite: 42,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "gerufener Partner",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 hat mit der Eichel-Sau gespielt. Bei dir stehen fünf Eichel-Karten: Sau, Zehn, Neun, Acht und Sieben — die sechste hat dein Partner. An Trumpf hast du nur den Herz-König, dazu Gras-König und Schelln-Sieben. Du bist in Vorhand.",
    stich: [],
    hand: ["HK", "EA", "EX", "E9", "E8", "E7", "GK", "S7"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["HK"],
    loesungstext: "Den Herz-König — nicht mit der Eichel-Sieben davonlaufen",
    begruendung:
      "Davonlaufen ist eine Kann- und keine Muss-Regel. Alle Eichel-Karten liegen in euren Händen, kein Gegenspieler kann die Rufsau also überhaupt suchen. Davonzulaufen würde den Gegnern nur einen mächtigen Stich bescheren: spätestens der zweite freie Nichtspieler erkennt Freund und Feind und schmiert kräftig — oder er wirft eine blanke Karte ab, macht sich eine Farbe frei, und sein Partner bringt sie umgehend nach. Auch das Argument „damit sich mein Partner auskennt“ trägt nicht: das Ausspielen einer Trumpfkarte bewirkt genau dasselbe.",
  },
  {
    id: "b1-2.4-s44",
    regelId: "partner-in-hinterhand-manoevrieren",
    seite: 44,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "gerufener Partner",
    ich: 4,
    spielmacher: 3,
    lage:
      "Spieler 3 hat mit der Eichel-Sau gespielt — die du hast. Spieler 1 bringt eine kleine Schelln-Karte, Spieler 2 den Schelln-König, und dein Partner übernimmt bereits mit der Schelln-Sau. Du sitzt an Position 4 und bist Schelln frei. Dein Blatt: Schelln-Ober und Trumpf-Zehn, dazu Eichel-Sau, -König und -Acht sowie Gras-Zehn, -König und -Sieben.",
    stich: [{ sitz: 1, card: "S7" }, { sitz: 2, card: "SK" }, { sitz: 3, card: "SA" }],
    hand: ["SO", "HX", "EA", "EK", "E8", "GX", "GK", "G7"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["HX"],
    loesungstext: "Die Herz-Zehn",
    begruendung:
      "Die naheliegende Zugabe wäre die Gras-Zehn — aber geh vorher durch, wie dein Partner fortsetzen könnte. Kommt er nicht mit dem Alten, sondern nur mit dem Blauen oder dem Roten, wären sowohl dein Schelln-Ober als auch deine Trumpf-Zehn ungünstige Zugaben: beide Gegner sitzen hinter euch und können nach Belieben unterstehen oder mit dem Alten übernehmen und schmieren. Die Initiative läge bei der Gegenpartei. Reiß den Stich deshalb mit der Herz-Zehn an dich — nach einer kleinen Denkpause, um deinen Partner nicht zu verwirren. Damit rutscht er in die Hinterhand und kann abwarten, wie die Gegner auf deinen nachgespielten Schelln-Ober reagieren.",
  },
  {
    id: "b1-2.5-s46",
    regelId: "spielplan-des-spielmachers",
    seite: 46,
    spiel: { type: "sauspiel", suit: "E" },
    rolle: "gerufener Partner",
    ich: 4,
    spielmacher: 1,
    gespielt: ["EA"],
    lage:
      "Spieler 1 hat mit der Eichel-Sau gespielt und den ersten Stich mit der Eichel-Sieben eröffnet — er sucht die Rufsau also selbst und deutet damit Trumpfschwäche an. Du hast als Gerufener die Sau zugegeben und den Stich gemacht. Es bleiben dir Herz-Ober, Herz-Unter und Herz-König an Trumpf, dazu Gras-Zehn, -König und -Acht sowie ein einzelner Schelln-König.",
    stich: [],
    hand: ["HO", "HU", "HK", "GX", "GK", "G8", "SK"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["SK"],
    loesungstext: "Den Schelln-König",
    begruendung:
      "Der rufende Spieler ist der Impulsgeber: nur er weiß, wie das Spiel angelegt werden muss, und deine Aufgabe ist es, seinen Gewinnplan zu unterstützen. Bringt er selbst eine Farbe statt Trumpf, ist er vermutlich trumpfschwach und beherrscht dafür die beiden anderen Farben — über deren Sauen oder weil er sie frei ist. Also folgst du ihm und bringst ebenfalls Farbe. Eine weitere Sau hättest du zuerst gespielt; ohne Sau nimmst du die kurze Farbe, weil dein Partner direkt hinter dir sitzt: sonst sticht er womöglich mit einem Schmiertrumpf ein und wird von einem ebenfalls freien Hintermann überstochen.",
  },
];

export const regelById = (id) => REGELN.find((r) => r.id === id) || null;
