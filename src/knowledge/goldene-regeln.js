/* ============================================================
   KAPITEL 7 (Seiten 229–239)
   „Goldene Regeln im Überblick“

   Kapitel 7 zeigt keine Stellungen und bringt auch keine neuen
   Merksätze. Es ist eine durchnummerierte Kurzfassung dessen, was
   das ganze Buch vorher erklärt hat, nach Rollen geordnet. Sein
   Wert für uns liegt in der Gegenprobe: an diesen Listen lässt
   sich ablesen, welcher Merksatz schon eingearbeitet ist und
   welcher fehlt.

   Stand jetzt: alle 111 Punkte haben eine Entsprechung. Damit ist
   belegt, dass die Merksätze des Buches vollständig abgetippt
   sind — nicht, weil jemand mitgezählt hat, sondern weil das Buch
   selbst die Liste dazu liefert.

   Deshalb steht Kapitel 7 nicht in `buecher.js` bei REGELN und
   STELLUNGEN, sondern für sich. Es ist kein Lernstoff, sondern
   eine Inventarliste.

   Die Listen folgen der Kapitelfolge des Buches
   ------------------------------------------------------------
   Das sagt das Buch auf S. 3 selbst: „Dabei entspricht die
   Regelnummer dem jeweiligen Kapitel.“ Punkt n ist also Kapitel n,
   und der Abgleich bestätigt es ohne eine einzige Ausnahme:

       7.1, Punkte  1–14  →  Kapitel 1.1 – 1.14
       7.2, Punkte  1–11  →  Kapitel 2.1 – 2.11
       7.3, Punkte  1–24  →  Kapitel 3.1 – 3.24
       7.4, Punkte  1–18  →  Kapitel 4.1 – 4.18
       7.5, Punkte  1–33  →  Kapitel 5.1 – 5.33
       7.6, Punkte  1–11  →  Kapitel 6.1 – 6.11

   Genau diese Zuordnung hat die Seiten 8–47 erschlossen: bevor sie
   gelesen waren, stand hier schwarz auf weiß, dass hinter den 15
   offenen Punkten die Kapitel 1.1–1.14 und 2.1–2.5 stecken müssen.

   `verweis` sagt, wo ein Punkt schon steht
   ------------------------------------------------------------
   Das Wissen des Buches liegt in drei Dateien, deshalb trägt der
   Verweis seine Herkunft im Namen:

       regel:<id>      REGELN aus buecher.js (Kapitel 1.1 – 6.11)
       strategie:<id>  Ansageregeln aus strategy.js (S. 9/11)
       prinzip:<id>    eigene Taktikregeln aus principles.js

   `verweis: null` hieße: dieser Punkt hat noch keine Entsprechung.
   Zurzeit steht das nirgends — der Test meldet es, sobald wieder
   ein Punkt ohne Verweis dazukommt.
   `anmerkung` steht dort, wo die Zuordnung eine Erklärung braucht —
   etwa weil ein Punkt nur die Spiegelseite eines Merksatzes ist
   oder weil verwandtes Wissen zwar da ist, aber nicht dasselbe sagt.

   Kapitel 7 ist vollständig: es endet mit 7.6 auf Seite 239,
   danach kommen nur noch Glossar (S. 240–242, siehe glossar.js)
   und Danksagung (S. 243).
   ============================================================ */

export const LISTEN = [
  {
    nummer: "7.1",
    seite: 230,
    titel: "Sauspiel als rufender Spieler",
    /* Vollständig eingearbeitet: Punkt n ist Kapitel 1.n. */
    punkte: [
      {
        nr: 1,
        text: "Ein solides Sauspiel basiert auf der Kontrolle von mindestens zwei Farben.",
        verweis: "regel:kontrolle-zweier-farben",
        anmerkung: "Als ausführbare Ansageregel steht dasselbe Kapitel in strategy.js (strategie:kontrolle-zwei-farben) — danach sagen die Bots an.",
      },
      {
        nr: 2,
        text: "Ein Rufspiel mit drei Farben ohne Sauen ist oft auch mit fünf Trümpfen nicht zu gewinnen.",
        verweis: "regel:drei-farben-ohne-sauen-meiden",
        anmerkung: "Als Sperre bei der Ansage in strategy.js (strategie:drei-farben-ohne-sauen).",
      },
      {
        nr: 3,
        text: "Für ein Rufspiel bietet sich diejenige Sau an, von deren Farbe ich nur eine einzelne Karte habe. Bei mehreren blanken Karten bevorzuge ich diejenige mit dem höchsten Punktewert.",
        verweis: "regel:sau-zur-zehn-rufen",
        anmerkung: "buchSauspiel() in strategy.js wählt die Ruffarbe noch nach der Stärke des Blattes, nicht nach dieser Regel.",
      },
      {
        nr: 4,
        text: "Als die Partei mit der vermeintlich größeren Anzahl an Trümpfen sollten die Spielmacher versuchen, zu Beginn des Spiels mehrere Trumpfrunden zu erzwingen.",
        verweis: "regel:trumpfrunden-erzwingen",
      },
      {
        nr: 5,
        text: "Die alte Schafkopfweisheit „Der Dumme sucht selber“ ist zutreffend.",
        verweis: "regel:nicht-selber-suchen",
      },
      {
        nr: 6,
        text: "Als gesperrter Spieler lasse ich mich zu keinem schwachen Solo hinreißen, sondern sage emotionslos und ohne zu zögern „Weiter“.",
        verweis: "regel:gesperrt-weiter-sagen",
      },
      {
        nr: 7,
        text: "Als Ausspieler kann ich mit vier Trümpfen und zwei Farb-Sauen auch einmal „Weiter“ sagen und darauf hoffen, von einem starken Partner gerufen zu werden.",
        verweis: "regel:sich-rufen-lassen",
        anmerkung: "Hängt am Sitz — den kennen die Ansageregeln in strategy.js nicht.",
      },
      {
        nr: 8,
        text: "Haben alle drei Vorderleute „Weiter“ gesagt, kann ich als Spieler in Hinterhand auch einmal mit nur vier Trümpfen ein Sauspiel wagen.",
        verweis: "regel:hinterhand-vier-truempfe",
        anmerkung: "Wie Punkt 7: die Schwellen in strategy.js gelten unabhängig vom Sitz.",
      },
      {
        nr: 9,
        text: "Wenn ich hin und wieder mit einem trostlosen Blatt ein Sauspiel ansage, wirke ich schematischem Handeln entgegen und werde dadurch ein Stückchen weniger durchschaubar.",
        verweis: "regel:trostlos-ansagen",
      },
      {
        nr: 10,
        text: "Solange nicht wirklich feststeht, welcher Mitspieler mein Partner ist, gebe ich meine Schmiertrümpfe nicht unüberlegt zu.",
        verweis: "regel:schmiertruempfe-zurueckhalten",
      },
      {
        nr: 11,
        text: "Ist ein Gegenspieler offensichtlich die Ruffarbe frei, werfe ich mitunter eher eine blanke Karte der Ruffarbe ab, bevor ich in eine freie Farbe einsteche.",
        verweis: "regel:ruffarbe-abwerfen",
      },
      {
        nr: 12,
        text: "Bringt der gerufene Partner früh im Spiel eine Farbe, will er mir als Spielmacher damit oftmals andeuten, die dritte Farbe frei zu sein.",
        verweis: "regel:freie-farbe-des-partners-lesen",
        anmerkung: "Die Spielerseite von 2.6: dort sendet der Partner das Signal, hier liest der Spielmacher es. Das Auswerten fehlt den Bots noch — siehe ARBEITSSTAND, „Die Gegenseite des Signals“.",
      },
      {
        nr: 13,
        text: "Nach einer Spritze spiele ich ungewöhnlich.",
        verweis: "regel:nach-spritze-ungewoehnlich",
      },
      {
        nr: 14,
        text: "Wenn es die Not gebietet, weiche ich auch einmal von den Standardregeln ab.",
        verweis: "regel:wesensart-des-rufspiels",
      },
    ],
  },
  {
    nummer: "7.2",
    seite: 231,
    titel: "Sauspiel als gerufener Mitspieler",
    /* Vollständig eingearbeitet: Punkt n ist Kapitel 2.n. Die
       Kapitel 2.1–2.5 stehen in buch1.js, 2.6–2.11 in buch2.js —
       eine Grenze der Aufnahmeserien, nicht des Buches. */
    punkte: [
      {
        nr: 1,
        text: "Spieler spielt Trumpf, Nichtspieler spielt Farbe.",
        verweis: "regel:trumpf-spielen-als-partner",
        anmerkung: "Die Nichtspieler-Hälfte des Merksatzes steht zusätzlich als prinzip:trumpf-dem-spieler bei den Bots.",
      },
      {
        nr: 2,
        text: "Bevor ich ohne die Zehn der Ruffarbe davonlaufe, wäge ich das Für und Wider sorgfältig ab.",
        verweis: "regel:davonlaufen-abwaegen",
      },
      {
        nr: 3,
        text: "Mit der Rufsau und insgesamt fünf Karten der Ruffarbe brauche ich nicht davonzulaufen, weil die Gegenspieler ohnehin nicht suchen können.",
        verweis: "regel:nicht-davonlaufen-bei-fuenf",
      },
      {
        nr: 4,
        text: "Gelegentlich ist es vorteilhaft, wenn ich durch Überstechen des Partners oder durch Verzichten auf einen Stich meinen Freund oder mich selbst in die Hinterhandposition manövriere.",
        verweis: "regel:partner-in-hinterhand-manoevrieren",
      },
      {
        nr: 5,
        text: "Hat der Spielmacher eine Farbkarte ausgespielt, gehe ich als gerufener Partner auf seine Strategie ein und bringe im weiteren Verlauf statt Trumpf ebenfalls Farbe.",
        verweis: "regel:spielplan-des-spielmachers",
      },
      {
        nr: 6,
        text: "Durch das Ausspielen einer Farbkarte anstelle eines Trumpfs zeige ich als gerufener Partner dem Spielmacher an, die dritte Farbe frei zu sein.",
        verweis: "regel:freie-farbe-anzeigen",
      },
      {
        nr: 7,
        text: "Sitzt der Spielmacher in Mittelhand, spiele ich als gerufener Partner nur dann meinen höchsten Trumpf aus, wenn ich einen der drei großen Ober habe.",
        verweis: "regel:nicht-immer-hoechster-trumpf",
      },
      {
        nr: 8,
        text: "Wenn ich als gerufener Partner keinen Trumpf habe, gebe ich mich dem Spielmacher schnell zu erkennen, nötigenfalls durch Ausspielen der Rufsau.",
        verweis: "regel:ohne-trumpf-rufsau-spielen",
      },
      {
        nr: 9,
        text: "Wirft der Spielmacher eine Lusche der Ruffarbe ab statt auf eine freie Farbe einzustechen, laufe ich nicht davon, sondern spiele besser Trumpf.",
        verweis: "regel:nicht-davonlaufen-nach-abspatzen",
      },
      {
        nr: 10,
        text: "Nach einer Spritze verhalte ich mich als Spieler eher wie ein Nichtspieler und als Nichtspieler eher wie ein Spieler.",
        verweis: "regel:nach-spritze-rollen-tauschen",
      },
      {
        nr: 11,
        text: "Im Falle von mehreren Optionen bedenke ich auch die nächsten Stiche und achte besonders darauf, wer wann am Ausspiel sein soll.",
        verweis: "regel:vorausdenken-ausspiel",
      },
    ],
  },
  {
    nummer: "7.3",
    seite: 232,
    titel: "Sauspiel als Gegenspieler",
    /* Vollständig eingearbeitet: Punkt n ist Kapitel 3.n. Den 24
       Punkten stehen 24 Kapitel gegenüber, obwohl REGELN nur 23
       Einträge dafür hat — 3.8 und 3.9 sind dort zusammengefasst. */
    punkte: [
      {
        nr: 1,
        text: "Es gibt keinen triftigen Grund, auf das Suchen der Rufsau mit einer blanken Zehn zu verzichten.",
        verweis: "regel:blanke-zehn-suchen",
      },
      {
        nr: 2,
        text: "Ich suche nur dann mit einer dreifach besetzten Zehn, wenn mir für die sicheren Stiche meines Partners weitere Schmierkarten bleiben.",
        verweis: "regel:dreifach-besetzte-zehn",
      },
      {
        nr: 3,
        text: "In der Regel verzichte ich auf das Suchen der Rufsau, wenn der Partner offensichtlich keinen Trumpf mehr hat.",
        verweis: "regel:nicht-suchen-ohne-partnertrumpf",
      },
      {
        nr: 4,
        text: "Habe ich keine Karte der Ruffarbe, spiele ich zunächst eine Farbe an, von der ich keine Sau habe.",
        verweis: "regel:anspiel-farbe-ohne-sau",
      },
      {
        nr: 5,
        text: "Als Voraussetzung für eine Spritze im Sauspiel sollte ich möglichst zwei Farben kontrollieren und eine berechtigte Hoffnung auf vier Stiche haben.",
        verweis: "regel:spritze-voraussetzung",
      },
      {
        nr: 6,
        text: "Habe ich keine Karte der Ruffarbe, lasse ich bevorzugt den Partner zum Stich kommen, damit er suchen kann.",
        verweis: "regel:partner-zum-suchen-lassen",
      },
      {
        nr: 7,
        text: "Manchmal muss ich einen Schmiertrumpf abwerfen und den höchsten verbliebenen Trumpf behalten, um nicht Schwarz zu werden.",
        verweis: "regel:nicht-schwarz-werden",
      },
      {
        nr: 8,
        text: "Sitze ich als Nichtspieler an Position 2 und mein Partner an Position 4, gilt für mich beim Anspiel eines hohen Trumpfes die Devise: „Schmieren oder stechen“.",
        verweis: "regel:schmieren-oder-stechen",
      },
      {
        nr: 9,
        text: "Sitze ich als Nichtspieler an Position 2 und mein Partner an Position 4, gilt für mich beim Anspiel eines hohen Trumpfes die Devise: „Stechen oder schmieren“.",
        verweis: "regel:schmieren-oder-stechen",
        anmerkung: "Kein Druckfehler, sondern die beiden Kapitel 3.8 und 3.9 mit identischer Sitzbeschreibung. In REGELN sind sie zu einem Eintrag zusammengefasst, deshalb zeigen Punkt 8 und 9 auf dieselbe Kennung.",
      },
      {
        nr: 10,
        text: "Gelegentlich muss ich einen hohen Trumpf opfern, um mir die Möglichkeit zu erhalten, meinem Partner einen Schmiertrumpf zugeben zu können.",
        verweis: "regel:hohen-trumpf-opfern",
      },
      {
        nr: 11,
        text: "Ich steche, weil ich will und nicht, weil ich kann.",
        verweis: "regel:stechen-oder-unterstehen",
      },
      {
        nr: 12,
        text: "Sind gleich zu Beginn der Runde zwei punktreiche Farbstiche absehbar, kann ich mit nur einem weiteren sicheren Trumpfstich eine Spritze wagen.",
        verweis: "regel:spritze-nach-farbanspiel",
      },
      {
        nr: 13,
        text: "Um nicht unnötigerweise einen Trumpfstich zu verschenken, muss ich unter Umständen von der ungünstigsten Trumpfverteilung ausgehen.",
        verweis: "regel:trumpfstich-sichern",
      },
      {
        nr: 14,
        text: "Sitze ich als Nichtspieler an Position 2 und mein Partner an Position 4, gilt beim Anspiel eines Schmiertrumpfs die Devise: „Die zweite Hand gibt nichts“.",
        verweis: "regel:zweite-hand-gibt-nichts",
      },
      {
        nr: 15,
        text: "Als der starke Gegenspieler setze ich meine Trümpfe rechtzeitig ein und warte nicht darauf, am Ende des Spiels groß aufzutrumpfen.",
        verweis: "regel:truempfe-rechtzeitig",
      },
      {
        nr: 16,
        text: "Habe ich Sau und Zehn einer Farbe, und müssen beide Gegner noch zugeben, kann das Spielen der Zehn anstelle der Sau den ersten Gegner zu einer falschen Annahme verleiten, wer die Sau hat.",
        verweis: "regel:zehn-statt-sau",
      },
      {
        nr: 17,
        text: "Nicht selten hat der Spielmacher im Sauspiel zwei Fehlkarten der gleichen Farbe.",
        verweis: "regel:zwei-fehlkarten-vermuten",
      },
      {
        nr: 18,
        text: "Gelegentlich übersteche ich bewusst meinen eigenen Partner, um sofort suchen zu können oder auch, um ihn in Hinterhand zu bringen.",
        verweis: "regel:partner-uebertsechen",
      },
      {
        nr: 19,
        text: "Als Nichtspieler einen blanken Eichel-Ober auszuspielen, gewinnt das Vertrauen des Spielmachers, wodurch eine nachgespielte Sau von ihm nicht unbedingt gestochen wird.",
        verweis: "regel:blanker-alter-eroeffnung",
      },
      {
        nr: 20,
        text: "Gelegentlich opfere ich eine Schmierkarte oder verzichte auf einen Stich, wenn ich dafür erwarten darf, später im Spiel einen zusätzlichen oder einen umso wertvolleren Stich zu gewinnen.",
        verweis: "regel:schmierkarte-opfern",
      },
      {
        nr: 21,
        text: "Ich steche, weil ich will und nicht, weil ich kann. Das gilt auch bei der Rufsau.",
        verweis: "regel:rufsau-nicht-stechen",
      },
      {
        nr: 22,
        text: "Um einem Gegenspieler, der davongelaufen ist, nicht in eine freie Farbe zu laufen, kann ich als Nichtspieler auch einmal einen Trumpf bringen.",
        verweis: "regel:trumpf-nach-davonlaufen",
      },
      {
        nr: 23,
        text: "Gerade mit trostlosen Karten verstoße ich hin und wieder gegen alle Routine und spiele etwas Ungewöhnliches.",
        verweis: "regel:trostlos-ungewoehnlich",
      },
      {
        nr: 24,
        text: "Durch wiederholtes Ausspielen der gleichen Farbe kann ich dem Spielmacher in gewissen Situationen mehrere, auch hohe Trümpfe ziehen.",
        verweis: "regel:farbe-wiederholt-anspielen",
      },
    ],
  },
  {
    nummer: "7.4",
    seite: 234,
    titel: "Alleinspiel als Spieler",
    /* Vollständig eingearbeitet: Punkt n ist Kapitel 4.n. */
    punkte: [
      {
        nr: 1,
        text: "Gebe ich unter Zugrundelegung einer normalen Kartenverteilung nicht mehr als drei Stiche ab, ziehe ich grundsätzlich ein Alleinspiel in Betracht.",
        verweis: "regel:alleinspiel-wagen",
      },
      {
        nr: 2,
        text: "Um nicht durchschaubar zu werden, variiere ich mein Spiel in gleichen Situationen immer wieder.",
        verweis: "regel:ausspiel-variieren",
      },
      {
        nr: 3,
        text: "Für den Spielmacher sind abgegebene Trumpfstiche im Schnitt günstiger als abgegebene Farbstiche.",
        verweis: "regel:trumpfstiche-billiger-als-farbstiche",
      },
      {
        nr: 4,
        text: "Beim Einstechen auf eine freie Farbe zu Beginn eines Solos gilt die alte Weisheit: „Mit einem Unter gehst´ nicht unter“.",
        verweis: "regel:mit-unter-einstechen",
      },
      {
        nr: 5,
        text: "Wird gegen mich als Alleinspieler in Mittelhand eine freie Farbe angespielt, wäge ich gründlich ab, ob ich wirklich einen Spatz abwerfen oder doch besser einstechen sollte.",
        verweis: "regel:abspatzen-mittelhand",
      },
      {
        nr: 6,
        text: "Wird gegen mich als Alleinspieler in Hinterhand eine freie Farbe angespielt, wäge ich gründlich ab, ob ich einstechen oder einen Spatz abwerfen sollte.",
        verweis: "regel:abspatzen-hinterhand",
      },
      {
        nr: 7,
        text: "Hat ein Spieler vor mir bereits den Wunsch zu spielen geäußert, verzichte ich besser auf ein nicht ganz sicheres Alleinspiel in der Farbe Herz.",
        verweis: "regel:kein-herz-solo-nach-spielwunsch",
      },
      {
        nr: 8,
        text: "Sobald alle gegnerischen Trümpfe gefallen sind, spiele ich als Alleinspieler umgehend meine Spatzen.",
        verweis: "regel:spatzen-spielen-wenn-gegner-trumpflos",
      },
      {
        nr: 9,
        text: "Ich gebe so wenig wie möglich über mein Blatt preis und lasse die Gegner so lange wie möglich über meine Stärken und Schwächen im Unklaren.",
        verweis: "regel:wenig-preisgeben",
      },
      {
        nr: 10,
        text: "Je früher die Gegenspieler unvermeidliche Trumpfstiche machen, umso weniger Punkte werden sie damit erzielen.",
        verweis: "regel:frueh-trumpfstiche-abgeben",
      },
      {
        nr: 11,
        text: "Bevor ich durch Abwerfen eines Spatzes in eine Zwickmühle gerate, steche ich auf eine freie Farbe besser ein.",
        verweis: "regel:zwickmuehle-vermeiden",
      },
      {
        nr: 12,
        text: "Im Farbwenz besteht die Hauptaufgabe der Schmiertrümpfe in erster Linie darin, die gegnerischen Trümpfe zu ziehen, und nicht, punktreiche Stiche zu machen.",
        verweis: "regel:schmiertruempfe-farbwenz",
      },
      {
        nr: 13,
        text: "Nicht nur im Farbwenz, sondern auch im Solo steche ich nicht vorschnell mit meinen Schmiertrümpfen, weil diese gegen Ende des Spiels hoch werden könnten.",
        verweis: "regel:schmiertruempfe-solo",
      },
      {
        nr: 14,
        text: "Auch wenn ein Farbwenz verlockend erscheint, ist ein normaler Wenz manchmal die bessere Wahl.",
        verweis: "regel:wenz-oder-farbwenz",
      },
      {
        nr: 15,
        text: "Auch für Spieler mit langjähriger Erfahrung ist es lohnenswert, sich unter Zuhilfenahme geeigneter Literatur mit Gewinn- und Verteilungswahrscheinlichkeiten beim Schafkopf zu beschäftigen.",
        verweis: "regel:gewinnchancen-einschaetzen",
      },
      {
        nr: 16,
        text: "Muss ich im Wenz eine Zehn-König-Kombination selbst auflösen, ist es meist klüger, wenn ich zuerst die Zehn und nicht den König anbiete.",
        verweis: "regel:zehn-vor-koenig-anbieten",
      },
      {
        nr: 17,
        text: "Im Wenz löse ich Farbenkombinationen in der richtigen Reihenfolge auf, indem ich zuerst meine blanken Karten spiele und eine Sau-König-Kombination möglichst lange zurückhalte.",
        verweis: "regel:wenz-farbkombinationen-reihenfolge",
      },
      {
        nr: 18,
        text: "Die goldene Regel des Schafkopfspielens: Ich gehe bei all meinen Entscheidungen immer von den wahrscheinlichsten Umständen aus und nicht von den ungünstigsten.",
        verweis: "regel:wahrscheinlichste-umstaende",
      },
    ],
  },
  {
    nummer: "7.5",
    seite: 236,
    titel: "Alleinspiel als Gegenspieler",
    /* Vollständig eingearbeitet: Punkt n ist Kapitel 5.n. Die 33
       Punkte bestätigen, dass buch4.js komplett ist. */
    punkte: [
      {
        nr: 1,
        text: "Gegen ein Solo oder einen Farbwenz in Mittelhand spiele ich meine längste Farbe an: „Kurzer Weg – Lange Farbe“.",
        verweis: "regel:kurzer-weg-lange-farbe",
      },
      {
        nr: 2,
        text: "Gegen ein Solo oder einen Farbwenz in Hinterhand spiele ich eine einzeln stehende oder meine kürzeste Farbe an, jedoch niemals eine Sau: „Langer Weg – Kurze Farbe“.",
        verweis: "regel:langer-weg-kurze-farbe",
      },
      {
        nr: 3,
        text: "Eine gespielte Karte, egal ob Trumpf oder Farbe, schließt den Besitz einer kleineren Karte gleichen Ranges aus, wobei Schmiertrümpfe eine Ausnahme darstellen.",
        verweis: "regel:ranggleiche-von-unten",
      },
      {
        nr: 4,
        text: "Werfen meine Partner auf Stiche des Spielmachers sehr hohe Trümpfe oder Schmiertrümpfe ab, haben sie in aller Regel keinen oder nur noch einen weiteren Trumpf.",
        verweis: "regel:abwuerfe-der-partner-lesen",
      },
      {
        nr: 5,
        text: "Die wichtigste Strategie der Verteidigung gegen ein Alleinspiel besteht darin, den Spielmacher so oft wie möglich in die Mittelhand zu bringen.",
        verweis: "regel:spielmacher-in-mittelhand",
      },
      {
        nr: 6,
        text: "Kommt in einer Situation, in der ich vom Partner eine Schmierkarte erwarte, lediglich eine Lusche, könnte sich dieser wohlweislich die Farbe der abgeworfenen Karte frei gemacht haben.",
        verweis: "regel:lusche-statt-schmierkarte-lesen",
      },
      {
        nr: 7,
        text: "Im Wenz spiele ich als Gegenspieler, wenn immer möglich, Böcke aus. Zu Beginn des Spiels lautet folglich die Devise: „Auf einen Wenz gehört eine Sau“.",
        verweis: "regel:auf-einen-wenz-eine-sau",
      },
      {
        nr: 8,
        text: "Im Wenz verzichte ich als Gegner auf das Nachspielen einer Farbe, wenn sich der Spielmacher dabei günstig abspatzen könnte: „Hast Du Sau und Zehn gesehen, sollst Du von der Farbe gehen“.",
        verweis: "regel:von-der-farbe-gehen",
      },
      {
        nr: 9,
        text: "Im Idealfall sollten etwa 15 Punkte im Stich liegen, wenn der Alleinspieler an die Reihe kommt.",
        verweis: "regel:fuenfzehn-punkte-anbieten",
      },
      {
        nr: 10,
        text: "Kommt der Spielmacher nicht mit der höchsten Karte heraus, kann ich bedenkenlos meinen Schmiertrumpf zugeben, wenn der Gegner diesen durch Anziehen aller Laufenden ohnedies gewinnen würde.",
        verweis: "regel:auf-verdacht-schmieren",
      },
      {
        nr: 11,
        text: "Sitzt hinter dem Spielmacher ein Partner, der offensichtlich eine Farbe frei ist, übe ich durch An- oder Nachspielen dieser Farbe großen Druck auf den Spielmacher aus.",
        verweis: "regel:farbe-des-freien-partners",
      },
      {
        nr: 12,
        text: "Gegen einen Toutspieler in Mittelhand komme ich als Ausspieler mit einer Karte meiner längsten Farbe heraus, von der ich keine Sau habe.",
        verweis: "regel:gegen-tout-laengste-farbe-ohne-sau",
      },
      {
        nr: 13,
        text: "Je weniger Trümpfe ich als Gegenspieler habe, desto sorgfältiger achte ich auf meine Schmierkarten und riskiere sie nicht auf Verdacht bei Farbstichen.",
        verweis: "regel:schmierkarten-schonen",
      },
      {
        nr: 14,
        text: "Im Farbwenz schmiere ich Trumpf-Sau und Trumpf-Zehn nur, wenn ich dadurch keinen Trumpfstich verschenke.",
        verweis: "regel:trumpf-sau-nicht-vorschnell",
      },
      {
        nr: 15,
        text: "Bei einem Eichel-, Gras- oder Schelln-Solo hat der Alleinspieler mit einer höheren Wahrscheinlichkeit einen Spatz in der Farbe Herz als in einer der anderen Farben.",
        verweis: "regel:herz-spatz-vermuten",
      },
      {
        nr: 16,
        text: "Als vermeintlich stärkster Gegenspieler in einem Alleinspiel biete ich selbst Punkte an, damit meine Partner ihre Schmierkarten für meine Stiche zurückhalten können.",
        verweis: "regel:als-starker-gegenspieler-punkte-anbieten",
      },
      {
        nr: 17,
        text: "Als Verteidiger darf ich bei Farbstichen keine Sau schinden, solange der Alleinspieler noch einen Spatz haben könnte.",
        verweis: "regel:nicht-die-sau-schinden",
      },
      {
        nr: 18,
        text: "In den allermeisten Fällen ist es ein schwerwiegender Fehler, auf ein Solo oder einen Farbwenz in Hinterhand eine Sau auszuspielen.",
        verweis: "regel:keine-sau-gegen-hinterhand",
      },
      {
        nr: 19,
        text: "Gegen ein Solo oder einen Farbwenz in Hinterhand spiele ich nur dann eine Sau aus, wenn ich voraussichtlich drei Trumpfstiche machen werde.",
        verweis: "regel:sau-gegen-hinterhand-ausnahme",
      },
      {
        nr: 20,
        text: "Ich werfe einen blanken kleinen Trumpf zu Beginn des Spiels so rasch wie möglich ab, damit ich meinen Partnern im folgenden Trumpfstich möglicherweise schmieren kann.",
        verweis: "regel:letzten-trumpf-abwerfen",
      },
      {
        nr: 21,
        text: "Beim Schmieren gibt der erste Partner die Richtung vor: Schmiert er, schmiere ich als zweiter Partner ebenfalls. Bleibt er klein, bleibe auch ich klein.",
        verweis: "regel:erster-partner-gibt-richtung-vor",
      },
      {
        nr: 22,
        text: "Vorstechen ist eine gute Möglichkeit, dem Spielmacher einen hohen Trumpf zu ziehen oder ihn in Mittelhand zu bringen.",
        verweis: "regel:vorstechen",
      },
      {
        nr: 23,
        text: "Könnte der Spielmacher im Wenz oder Farbwenz eine Sau-Lusche-Kombination haben, achte ich als Gegner darauf, dass er mit dieser Lusche nicht zum Stechen kommt.",
        verweis: "regel:doppelstich-verhindern",
      },
      {
        nr: 24,
        text: "Könnte der Spielmacher im Wenz oder Farbwenz eine Zehn-König-Kombination haben, stehe ich beim König unter, um dann später mit der Sau die Zehn zu stechen.",
        verweis: "regel:sau-fuer-die-zehn-zurueckhalten",
      },
      {
        nr: 25,
        text: "Wird eine Farbe mit einer punktreichen Karte nachgespielt, kann ich einem Solospieler an Position 3 durch Vorstechen oder Schmieren einen sehr hohen Trumpf abnötigen.",
        verweis: "regel:ober-ziehen",
      },
      {
        nr: 26,
        text: "Durch Anbieten genügend vieler Punkte kann ich einen Solospieler in Mittelhand nötigen, zum Festhalten der Punkte einen Laufenden aufzuwenden.",
        verweis: "regel:zusaetzlichen-trumpfstich-erarbeiten",
      },
      {
        nr: 27,
        text: "Gelegentlich opfere ich eine Schmierkarte oder verzichte auf einen Stich, wenn ich dafür erwarten darf, später im Spiel einen zusätzlichen oder einen umso wertvolleren Stich zu gewinnen.",
        verweis: "regel:auf-mageren-stich-verzichten",
        anmerkung: "Wortgleich mit 7.3, Punkt 20 (Kapitel 3.20) — das Buch führt denselben Gedanken in beiden Rollen.",
      },
      {
        nr: 28,
        text: "Auch bei einem trostlosen Blatt bleibe ich stets konzentriert und werfe meine vermeintlich unscheinbaren Karten nicht freudlos ab.",
        verweis: "regel:unscheinbare-karten-nicht-freudlos",
      },
      {
        nr: 29,
        text: "Insbesondere wenn ich direkt vor dem Spielmacher sitze, bringe ich durch das Nachspielen einer Farbe den Alleinspieler in arge Bedrängnis.",
        verweis: "regel:farbe-nachspielen-vor-dem-spielmacher",
      },
      {
        nr: 30,
        text: "Nach einer ausgesprochenen oder auch nur erwogenen Spritze eines trumpfstarken Partners achte ich sehr auf meine Schmierkarten, um ja genügend Punkte auf dessen Stiche zugeben zu können.",
        verweis: "regel:nach-spritze-punkte-schonen",
      },
      {
        nr: 31,
        text: "Bei einem Wenz-Tout zeige ich durch Abwerfen einer Sau den Partnern, welche Farbe sie bedenkenlos abwerfen können.",
        verweis: "regel:wenz-tout-sau-abwerfen",
      },
      {
        nr: 32,
        text: "Durch rasches Abwerfen hoher Trümpfe, die nicht zum Stich kommen werden, kann ich den Partnern helfen, die Stärke des Spielmachers richtig einzuschätzen.",
        verweis: "regel:hohen-trumpf-rasch-abwerfen",
      },
      {
        nr: 33,
        text: "Ich verzichte auch auf einen verlockend profitablen Stich, wenn ich dafür im Gegenzug einen zusätzlichen zweiten Trumpfstich mache.",
        verweis: "regel:nicht-von-intuition-verleiten-lassen",
      },
    ],
  },
  {
    nummer: "7.6",
    seite: 239,
    titel: "Informelle Techniken",
    /* Vollständig eingearbeitet: Punkt n ist Kapitel 6.n. */
    punkte: [
      {
        nr: 1,
        text: "Ich variiere die Anzahl der abgehobenen Karten und gebe Acht, dass die abgehobenen Karten unten in den Stapel kommen.",
        verweis: "regel:abheben",
      },
      {
        nr: 2,
        text: "Ich nehme alle acht Karten auf einmal auf und gebe weder durch Bemerkungen noch durch Körpersprache Hinweise auf meine Stärken und Schwächen.",
        verweis: "regel:aufnehmen",
      },
      {
        nr: 3,
        text: "Ich vermeide so weit wie möglich das Sortieren der Karten von links nach rechts und variiere immer wieder die Art und Weise, wie ich meine Karten aufstecke.",
        verweis: "regel:aufstecken",
      },
      {
        nr: 4,
        text: "Ich kontrolliere bewusst das Tempo meiner Spielansage und verhindere damit Rückschlüsse auf die Qualität meiner Karten.",
        verweis: "regel:ansage-tempo",
      },
      {
        nr: 5,
        text: "Ich überlege genau, zu welchem Zeitpunkt ich eine Spritze gebe: Bevor die erste Karte ausgespielt wird oder erst danach.",
        verweis: "regel:spritze-zeitpunkt",
      },
      {
        nr: 6,
        text: "Ich gebe alle Karten mit etwa gleicher Verzögerung zu und ermögliche keine Rückschlüsse auf die Zusammensetzung meines Blattes.",
        verweis: "regel:zugeben-tempo",
      },
      {
        nr: 7,
        text: "Ich verzögere die Zugabe einer kleinen Karte, wenn ich meinen Mitspielern andeuten möchte, dass ich die vorliegende Karte auch stechen könnte.",
        verweis: "regel:stich-andeuten",
      },
      {
        nr: 8,
        text: "Ich kann mich um so einfacher entscheiden, welche Karte ich als nächste spielen soll, je mehr ich vom bisherigen Spielverlauf im Kopf behalte.",
        verweis: "regel:mitzaehlen",
      },
      {
        nr: 9,
        text: "Ich gehe auf die Charakterzüge meiner Mitspieler ein und berücksichtige sie in meinem Handeln.",
        verweis: "regel:eigenheiten-der-mitspieler",
      },
      {
        nr: 10,
        text: "Ich muss mir auch als Turnier-Neuling oder weniger geübter Spieler unanständiges Verhalten von alten Hasen nicht gefallen lassen.",
        verweis: "regel:turnier-besonderheiten",
      },
      {
        nr: 11,
        text: "Ich glaube an meinen Erfolg!",
        verweis: "regel:glaube-an-den-erfolg",
      },
    ],
  },
];

/** Alle Punkte am Stück, jeder mit seiner Liste versehen. */
export const PUNKTE = LISTEN.flatMap((l) =>
  l.punkte.map((p) => ({ ...p, liste: l.nummer, seite: l.seite, kennung: `${l.nummer}.${p.nr}` })));

/** Punkte ohne Entsprechung — das ist die eigentliche Ausbeute der Gegenprobe. */
export const offenePunkte = () => PUNKTE.filter((p) => !p.verweis);

/** „regel:xyz“ → { art: "regel", id: "xyz" }, null für offene Punkte. */
export const zerlegeVerweis = (v) => {
  if (!v) return null;
  const i = v.indexOf(":");
  return i < 0 ? null : { art: v.slice(0, i), id: v.slice(i + 1) };
};
