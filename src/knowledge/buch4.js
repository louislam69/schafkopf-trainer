/* ============================================================
   BUCH 4, KAPITEL 5.1–5.33 (Seiten 150–215), vollständig
   Alleinspiel als Gegenspieler — wie die drei Gegner eines Solos,
   Wenzes oder Farbwenzes zusammenspielen.

   Gleiche Konventionen wie in buch2.js und buch3.js: die Hände
   stehen in der Reihenfolge, in der das Buch sie auslegt, und
   test/buchstellungen.js rechnet diese Sortierung nach.

   REGELN     = die Merksätze, in eigenen Worten zusammengefasst.
   STELLUNGEN = die abgebildeten Blätter, als Übungsaufgaben.
   ============================================================ */

export const REGELN = [
  {
    id: "kurzer-weg-lange-farbe",
    kapitel: "5.1",
    seite: 151,
    titel: "Bei kurzem Weg eine lange Farbe spielen",
    kurz: "Gegen ein Solo oder einen Farbwenz in Mittelhand spiele ich meine längste Farbe an: „Kurzer Weg – lange Farbe“.",
    lang:
      "Sitzt der Alleinspieler an Position 2 oder 3, ist der Weg vom Ausspieler zu ihm kurz — hinter ihm sitzt also noch mindestens ein Partner. Dann bringe ich eine Karte meiner längsten Farbe, und habe ich davon die Sau und ist sie nicht gerade meine einzige Schmierkarte, spiele ich die Sau. Mit etwas Glück erwische ich damit einen Spatz des Alleinspielers, bleibe am Ausspiel und kann die Farbe gleich noch einmal bringen; mit einer blanken Sau wäre das nicht möglich. Habe ich von der langen Farbe keine Sau, ist die Hoffnung eine andere: je mehr Karten einer Farbe bei mir liegen, desto wahrscheinlicher ist ein Mitspieler sie frei und kann überstechen, wenn der Solospieler mit seiner Sau einsticht. Habe ich gar keine wirklich lange Farbe — etwa drei Trümpfe, zwei Farben doppelt besetzt und eine blank —, bringe ich die einzeln stehende Karte; mitunter ergibt sich später ein überraschender Stich, wenn die Farbe noch einmal auf den Tisch kommt.",
  },
  {
    id: "langer-weg-kurze-farbe",
    kapitel: "5.2",
    seite: 153,
    titel: "Bei langem Weg eine kurze Farbe spielen",
    kurz: "Gegen ein Solo oder einen Farbwenz in Hinterhand spiele ich eine einzeln stehende oder meine kürzeste Farbe an, niemals aber eine Sau: „Langer Weg – kurze Farbe“.",
    lang:
      "Sitzt der Alleinspieler an Position 4, ist der Weg lang: komme ich später wieder ans Ausspiel, sitze ich unmittelbar vor ihm und bedrohe ihn mit der Farbe, die ich jetzt frei mache. Der Idealfall: auf meine einzeln stehende kleine Karte gibt ein Partner die Sau zu und erwischt den Spatz des Alleinspielers. Wir bleiben am Ausspiel, der Spielmacher steht in Mittelhand, und der Partner, der gestochen hat, spielt die Zehn nach — nun muss der Spielmacher fürchten, dass ich frei bin und einen zu kleinen Trumpf überstechen würde. Auch wenn er den ersten Stich mit Sau oder Trumpf gewinnt, war das Anspiel richtig: kommen meine Partner später durch einen Trumpfstich ans Ausspiel, bringen sie die Farbe erneut, denn sie halten mich inzwischen für frei. Eine Sau spiele ich gegen die Hinterhand dagegen nie an — blank oder nicht.",
  },
  {
    id: "ranggleiche-von-unten",
    kapitel: "5.3",
    seite: 155,
    titel: "Ranggleiche Karten von unten her abwerfen",
    kurz: "Eine gespielte Karte schließt den Besitz einer kleineren Karte gleichen Ranges aus — nur Schmiertrümpfe sind die Ausnahme.",
    lang:
      "Ranggleich sind Karten, zwischen denen für mich kein Unterschied besteht: in einer Farbe die Neun, die Acht und die Sieben, im Trumpf etwa Schelln-Ober, Eichel-Unter und Gras-Unter. Habe ich mehrere davon zur Auswahl, nehme ich immer die kleinste. Denn wer die Acht sieht, schließt daraus, dass ich die Sieben nicht habe und die Farbe frei bin — und richtet sein Spiel danach. Gebe ich die Acht statt der Sieben, bringt der Ausspieler später seine Zehn und zählt darauf, dass ich den Solospieler überstechen kann; stattdessen muss ich mit rotem Kopf die Sieben bedienen. Aus demselben Grund steche ich lieber mit dem Eichel-Unter als mit dem ranggleichen Schelln-Ober, obwohl der einen Punkt mehr brächte: sonst folgert ein Partner, ich hätte keinen hohen Trumpf mehr, und traut sich später nicht zu schmieren. Bei Schmiertrümpfen gilt die Regel nicht — auf den gegnerischen Eichel-Ober werfe ich natürlich den Schelln-Unter ab und nicht die Herz-Sau.",
  },
  {
    id: "abwuerfe-der-partner-lesen",
    kapitel: "5.4",
    seite: 157,
    titel: "Auf die Abwürfe der Partner achten",
    kurz: "Werfen die Partner auf Stiche des Spielmachers sehr hohe Trümpfe oder Schmiertrümpfe ab, haben sie in aller Regel keinen oder nur noch einen weiteren Trumpf.",
    lang:
      "Wer sich vom zweithöchsten Trumpf trennt, hat keinen kleineren mehr — sonst hätte er den abgeworfen, und einen noch höheren hätte er erst recht vorher hergegeben (Kapitel 5.3). Daraus folgt zweierlei. Erstens brauche ich auf diesen Stich nicht zu schmieren; ich werfe lieber eine Lusche ab und mache mich dadurch eine Farbe frei. Zweitens lässt sich die Trumpfverteilung ausrechnen: im Solo gibt es vierzehn Trümpfe. Hatten mein Hintermann und ich zusammen nur zwei, verteilen sich zwölf auf den Spielmacher und den dritten Gegenspieler — hatte der Spielmacher acht, hält der Partner vier, und unterstellt man dem Spielmacher noch einen Spatz, sogar fünf. Mit einem so trumpfstarken Mitstreiter riskiere ich keine Schmierkarte mehr in einem Farbstich, auch wenn dabei einmal ein paar Punkte liegen bleiben: die Vollen gehören in seine Trumpfstiche.",
  },
  {
    id: "spielmacher-in-mittelhand",
    kapitel: "5.5",
    seite: 159,
    titel: "Den Alleinspieler in Mittelhand bringen",
    kurz: "Die wichtigste Strategie der Verteidigung gegen ein Alleinspiel besteht darin, den Spielmacher so oft wie möglich in die Mittelhand zu bringen.",
    lang:
      "Mittelhand ist die Position, in die ein Alleinspieler am wenigsten geraten möchte: er muss auf das Vorgehen der Gegner reagieren, statt das Spiel selbst zu gestalten, und die Gelegenheiten, etwas falsch zu machen, sind zahlreich — stechen statt abwerfen, abwerfen statt stechen, zu klein einstechen, unnötig hoch einstechen, die falsche Farbe abwerfen. An Position 2 ist es für ihn noch ungünstiger als an Position 3, weil dort gleich zwei Gegner hinter ihm sitzen. Für diesen Vorteil lohnt es sich, auch einmal einen scheinbar wertlosen Trumpf einzusetzen und dafür sogar den eigenen Mitspieler zu überstechen. Denn wer als Gegner am Ausspiel ist und eine Farbe bringt, die der Alleinspieler frei ist, zwingt ihn zur Entscheidung: er darf weder einen Spatz abwerfen noch mit einem Schmiertrumpf einstechen, weil er damit rechnen muss, dass ein Hintermann die Farbe ebenfalls frei ist.",
  },
  {
    id: "lusche-statt-schmierkarte-lesen",
    kapitel: "5.6",
    seite: 161,
    titel: "Nachspielen, was der Partner abspatzt",
    kurz: "Kommt in einer Situation, in der ich vom Partner eine Schmierkarte erwarte, lediglich eine Lusche, könnte sich dieser wohlweislich die Farbe der abgeworfenen Karte frei gemacht haben.",
    lang:
      "Wer auf einen sicheren Stich seiner eigenen Partei nichts Volles zugibt, hat dafür meist einen Grund. Entweder er hat gerade nichts zu schmieren — oder er hat sich ganz bewusst eine Farbe frei gemacht; sonst hätte er wenigstens einen König beigesteuert. Auf dieses Zeichen antworte ich, indem ich die punktreichste Karte genau dieser Farbe nachspiele. Übernimmt der Spielmacher, kann der Freund in Hinterhand einen schönen Stich für die Partei machen; ist der Spielmacher die Farbe selbst frei, kommt er in die Klemme: einen weiteren teuren Stich kann er sich nicht leisten und muss deshalb hoch einstechen, obwohl er nicht wissen kann, wo die noch fehlenden Trümpfe stehen. Auf diese Weise wird mitunter ein einfach besetzter kleiner Trumpf hoch, mit dem zu Beginn nicht zu rechnen war.",
  },
  {
    id: "auf-einen-wenz-eine-sau",
    kapitel: "5.7",
    seite: 163,
    titel: "Gegen einen Wenz eine Sau anspielen",
    kurz: "Im Wenz spiele ich als Gegenspieler, wenn immer möglich, Böcke aus. Zu Beginn des Spiels lautet die Devise: „Auf einen Wenz gehört eine Sau“.",
    lang:
      "Im Wenz gibt es nur vier Trümpfe, und gerade deshalb ist jeder einzelne davon kostbar. Als Verteidiger am Ausspiel will ich vermeiden, dass der Spieler über einen Farbstich ans Spiel kommt, ohne einen Unter einsetzen zu müssen. Dafür bringe ich einen Bock — eine Karte, die keine andere Farbkarte stechen kann. Zu Beginn der Partie sind das die Säue; später wird auch ein König zum Bock, sobald Sau und Zehn seiner Farbe gefallen sind. Will der Spieler gegen einen Bock an den Stich kommen, muss er einen seiner wenigen Trümpfe hergeben. Zweifelsfrei richtig ist das, wenn der Wenzspieler in Mittelhand sitzt. Sitzt er an Position 4, scheiden sich die Geister: wer der goldenen Regel der Verteidigung den Vorrang gibt und ihn vor allem in die Mittelhand bringen will, spielt statt einer Sau lieber eine kurze Farbe an.",
  },
  {
    id: "von-der-farbe-gehen",
    kapitel: "5.8",
    seite: 165,
    titel: "Neue Farben anspielen, wenn Sau und Zehn gefallen sind",
    kurz: "Im Wenz verzichte ich als Gegner auf das Nachspielen einer Farbe, wenn sich der Spielmacher dabei günstig abspatzen könnte: „Hast Du Sau und Zehn gesehen, sollst Du von der Farbe gehen“.",
    lang:
      "Auch ein König, der nach dem Fall von Sau und Zehn hoch geworden ist, gehört nicht gegen einen Alleinspieler in Hinterhand nachgespielt. In der Farbe sind dann nur noch die vier Punkte dieses Königs zu holen, und im ungünstigen Fall haben beide Partner noch eine kleine Karte der Farbe — dann wird der Spieler seine Fehlkarte praktisch für ein Butterbrot los. Nur wenn der Spielmacher an Position 3 oder besser noch an Position 2 sitzt und ich außerdem mindestens zwei Karten der Farbe halte und somit weiß, dass wenigstens ein Partner sie frei ist, bringt das Nachspielen ihn in Entscheidungsnot: wirft er eine Fehlkarte ab, schmieren die freien Partner gefahrlos; sticht er mit einem Unter ein, gewinnt er nur wenige Punkte und meine Freunde können ihr Blatt bereinigen. Sonst bringe ich lieber eine neue Farbe und zwinge ihn, einen seiner wenigen Trümpfe zu investieren oder einen teuren Stich abzugeben.",
  },
  {
    id: "fuenfzehn-punkte-anbieten",
    kapitel: "5.9",
    seite: 167,
    titel: "Fünfzehn Punkte anbieten",
    kurz: "Im Idealfall sollten etwa 15 Punkte im Stich liegen, wenn der Alleinspieler an die Reihe kommt.",
    lang:
      "Wie viele Punkte in einem Farbstich liegen, entscheidet darüber, ob sich der Alleinspieler billig abspatzen kann. Elf Punkte — eine blanke Sau — sind zu wenig: von einer Fehlfarbe trennt er sich dafür gern. Einundzwanzig sind unter normalen Umständen zu viel: hat er die Farbe frei und einen Schmiertrumpf, hat er damit schon die halbe Miete zusammen. Der goldene Mittelweg sind 14 oder 15 Punkte, also etwa Sau und König. Das ist zu teuer zum Abwerfen und lockt ihn zum Einstechen — und sticht er doch nicht, stehen bereits 15 Punkte auf unserem Konto. Auch der Ausspieler muss dafür mitarbeiten: hat er von seiner Farbe den König und ein paar Luschen, bringt er den König, denn woher sollten die 15 Punkte sonst kommen? Beim Farbwenz gilt dasselbe, dort ist die Zahl wegen des Obers als zweitem mittelhohen Wert sogar leichter zu treffen.",
  },
  {
    id: "auf-verdacht-schmieren",
    kapitel: "5.10",
    seite: 169,
    titel: "Auf Verdacht schmieren",
    kurz: "Kommt der Spielmacher nicht mit der höchsten Karte heraus, kann ich bedenkenlos meinen Schmiertrumpf zugeben, wenn der Gegner den Stich durch Anziehen aller Laufenden ohnedies gewinnen würde.",
    lang:
      "Zieht ein Wenzspieler mit zwei laufenden Untern zuerst den Gras-Unter an, fehlt ihm der Eichel-Unter — vielleicht. Habe ich neben meiner Schmiersau nur noch einen weiteren Trumpf, kann ich nichts falsch machen, wenn ich auf Verdacht schmiere: hat ein Partner den Eichel-Unter, bringe ich meine Punkte nach Hause; hat ihn der Spielmacher, zieht er ihn in der zweiten Runde nach und meine Trumpf-Sau fällt eben dann. Nur die kleine Karte zuzugeben wäre also der Fehler. Anders liegt es mit einem dritten Trumpf: dann halte ich die Schmiersau zurück und hoffe auf einen starken Partner in der dritten Trumpfrunde. Und gibt ein Partner dem Spielmacher eine Spritze, vermute ich bei ihm neben dem hohen Unter noch weitere Trümpfe; dann gebe ich fürs Erste nur die kleine Karte, damit mein zweiter Partner eine womöglich blank stehende Trumpfkarte abwerfen kann und später eine zweite Schmierkarte zu meiner Sau in den Stich legt.",
  },
  {
    id: "farbe-des-freien-partners",
    kapitel: "5.11",
    seite: 171,
    titel: "Nachspielen einer Farbe",
    kurz: "Sitzt hinter dem Spielmacher ein Partner, der offensichtlich eine Farbe frei ist, übe ich durch An- oder Nachspielen dieser Farbe großen Druck auf den Spielmacher aus.",
    lang:
      "Dass in einer Farbe nur noch wenige Punkte zu holen sind, spricht nicht gegen das Nachspielen — entscheidend ist, wer hinter dem Spielmacher sitzt. Ist sein direkter Hintermann sichtbar frei, gerät er in die Zange: klein einstechen kann er nicht riskieren, weil dort die Trumpf-Sau liegen könnte; einen Spatz abwerfen kann er auch nicht, weil sonst ein zweites Mal geschmiert würde und er in Mittelhand bliebe. Also sticht er mit einem Unter ein und ist einen guten Trumpf kürzer. Für den freien Partner dahinter ist das eine angenehme Wahl: entweder überstechen und weitere acht oder neun Punkte holen — sinnvoll, wenn er ohnehin nur wenige Trümpfe hat, die er später auf die Ober des Spielmachers zugeben müsste — oder nicht übernehmen und stattdessen das eigene Blatt bereinigen, sich in einer weiteren Farbe frei machen oder einen alleinstehenden Trumpf abwerfen.",
  },
  {
    id: "gegen-tout-laengste-farbe-ohne-sau",
    kapitel: "5.12",
    seite: 173,
    titel: "Gegen einen Tout in Mittelhand ausspielen",
    kurz: "Gegen einen Toutspieler in Mittelhand komme ich als Ausspieler mit einer Karte meiner längsten Farbe heraus, von der ich keine Sau habe.",
    lang:
      "Gegen einen Tout wird anders verteidigt als gegen ein gewöhnliches Alleinspiel: es genügt ein einziger Stich. Die größte Schwäche eines Toutspielers in Mittel- oder Hinterhand ist in aller Regel eine Fehlfarben-Sau — es sei denn, er hat acht Trümpfe. Diese Sau anzuspielen und von einem freien Mitspieler stechen zu lassen, ist das Ziel; kommt der Toutspieler erst einmal selbst ans Ausspiel, ist meist nichts mehr zu holen. Um seine Sau zu fangen, muss ich eine Farbe bringen, von der ich selbst keine Sau habe — und je mehr Karten ich davon halte, desto wahrscheinlicher ist einer meiner Partner sie frei. Habe ich meine eigene Sau dagegen fünffach besetzt, kann ich auch diese Farbe anspielen, dann aber nicht die Sau selbst, sondern eine kleine Karte, auf die der Spielmacher vielleicht nur mit einem kleineren Trumpf einsticht. Für Solo-Tout und Wenz-Tout gilt dasselbe.",
  },
  {
    id: "schmierkarten-schonen",
    kapitel: "5.13",
    seite: 175,
    titel: "Mit seinen Schmierkarten sorgfältig umgehen",
    kurz: "Je weniger Trümpfe ich als Gegenspieler habe, desto sorgfältiger achte ich auf meine Schmierkarten und riskiere sie nicht auf Verdacht bei Farbstichen.",
    lang:
      "Wer nur einen Trumpf hält, wird die Partie nicht mit Trumpfstichen entscheiden — sein wichtigster Beitrag besteht darin, alle eigenen Punkte nach Hause zu bringen und keinen einzigen zu verschenken. Denn wenn ich selbst wenige Trümpfe habe, stehen unerwartet viele bei einem Partner; diesem zu schmieren, wenn er zum Stich kommt, ist das erklärte Ziel. Gewonnen wird dann meist über drei Trumpf- oder Farbstiche, in denen genügend Punkte liegen. Also spiele ich zu Beginn konservativ eine kleine Karte meiner langen Farbe an und riskiere weder die Zehn noch den König. Meine Punkte gebe ich erst und nur dann zu, wenn wir den Stich wirklich sicher bekommen. Auch wenn der Spielmacher die Sau der Farbe hält und ein Partner sie frei ist und stechen kann, ist damit nichts vertan: die Farbkarten lassen sich später in den Stichen der Partner unterbringen.",
  },
  {
    id: "trumpf-sau-nicht-vorschnell",
    kapitel: "5.14",
    seite: 177,
    titel: "Die Trumpf-Sau nicht vorschnell schmieren",
    kurz: "Im Farbwenz schmiere ich Trumpf-Sau und Trumpf-Zehn nur, wenn ich dadurch keinen Trumpfstich verschenke.",
    lang:
      "Im Farbwenz sind die Trumpf-Sau und die Trumpf-Zehn nicht nur Punktelieferanten, sondern die Nummern fünf und sechs der Rangfolge — also hohe Trümpfe. Ihre Punkte nach Hause zu bringen reicht für einen Sieg oft nicht; richtig eingesetzt sollen sie dem Spielmacher auch Stiche abnehmen. Wer sie vorschnell in einen Stich wirft, den die eigene Partei ohnehin gewinnt, verschenkt einen kompletten Stich: der Spielmacher hält vermutlich noch den Trumpf-Unter und die Trumpf-Zehn, kommt erneut zum Ausspiel und nimmt mir damit meine kleinen Trümpfe ab. Gebe ich stattdessen zunächst nur den König zu, kann ich dem Trumpf-Unter mit einer kleinen Trumpffarbkarte ausweichen und mache mit der verbliebenen Sau später einen dicken Trumpfstich. Risikolos ist das obendrein: die Punkte bekomme ich genauso, nur ein paar Stiche später — und dann sind meine Freunde vermutlich trumpffrei und können nach Kräften schmieren.",
  },
  {
    id: "herz-spatz-vermuten",
    kapitel: "5.15",
    seite: 179,
    titel: "Einen Herz-Spatz beim Solospieler vermuten",
    kurz: "Bei einem Eichel-, Gras- oder Schelln-Solo hat der Alleinspieler mit höherer Wahrscheinlichkeit einen Spatz in der Farbe Herz als in einer der anderen Farben.",
    lang:
      "Der Grund liegt nicht im Spiel, sondern im Kartenstapel. War das letzte Spiel ein gewöhnliches Sauspiel, sind dort in den Trumpfstichen Ober, Unter und Herz-Karten zusammen gefallen und liegen anschließend beieinander. Da nie wirklich sauber gemischt wird, bleiben ganze Stiche oder Teile davon zusammen — und so landet mit den Obern und Untern gern auch eine Herz-Karte beim Solospieler. Weiß ich also nicht recht, welche Farbe ich gegen ein Solo anspielen soll, wähle ich Herz, sofern nicht gerade ein Herz-Solo gespielt wird. Habe ich neben einer blanken Herz-Karte aber eine andere, lange Farbe, gilt weiter „Kurzer Weg – lange Farbe“. Aus demselben Grund ist das Herz-Solo das gefährlichste Solo für den Alleinspieler: bei den anderen drei Farben darf er von einer Gleichverteilung der Farbtrümpfe bei den Gegnern ausgehen, bei Herz muss er mit einer Häufung von Bildtrümpfen und Herz-Karten auf einer Gegnerhand rechnen. Fürs Spiel im Internet gilt das alles nicht.",
  },
  {
    id: "als-starker-gegenspieler-punkte-anbieten",
    kapitel: "5.16",
    seite: 181,
    titel: "Als starker Gegenspieler Punkte anbieten",
    kurz: "Als vermeintlich stärkster Gegenspieler in einem Alleinspiel biete ich selbst Punkte an, damit meine Partner ihre Schmierkarten für meine Stiche zurückhalten können.",
    lang:
      "Wer als Gegenspieler mehrere Trumpfstiche erwartet, braucht dafür Punkte von den Partnern — also darf er ihre Schmierkarten nicht in Farbstichen verheizen. Deshalb biete ich dem Spielmacher die Punkte lieber selbst an und eröffne mit einer Zehn. Der Partner darf den Stich durch Zugabe des Königs auf 14 Punkte aufwerten, um dem Solospieler das Abwerfen einer Fehlfarbe zu verleiden; die Sau soll er dagegen nur zugeben, wenn er mindestens drei weitere Schmierkarten besitzt. Zugleich ist das Ausspiel einer Zehn ein Zeichen: aus welchem anderen Grund sollte jemand eine Zehn anspielen? Verstärken lässt es sich durch eine Spritze vor dem Ausspiel — oder wenigstens durch Zögern und ein nachdenkliches Gesicht. Bei der Überlegung zu einer Spritze zählt übrigens nicht nur die Zahl der Trümpfe, sondern auch das Beiblatt: habe ich selbst zwei oder drei Volle, verzichte ich auch mit fünf Trümpfen darauf, denn Schmierkarten, die bei mir liegen, fehlen den Partnern.",
  },
  {
    id: "nicht-die-sau-schinden",
    kapitel: "5.17",
    seite: 183,
    titel: "Nicht die Sau schinden",
    kurz: "Als Verteidiger darf ich bei Farbstichen keine Sau schinden, solange der Alleinspieler noch einen Spatz haben könnte.",
    lang:
      "Die Sau zurückzuhalten, aus Angst der Alleinspieler könnte die Farbe frei sein, kostet meist mehr als es einbringt. Hat er tatsächlich einen Spatz, wird er ihn in dieser Runde außerordentlich billig los, und anschließend spielt wieder der Ausspieler an — der Gegner behält also die angenehme Hinterhandposition. Und übernehme ich statt mit der Sau nur mit der Zehn, um wenigstens einen Punkt zu retten, kann das einen Partner in die Irre führen: er darf berechtigterweise annehmen, die Sau sei vor ihm schon gespielt worden, vermutet sie beim Solospieler und legt einen Schmiertrumpf drauf — im schlimmsten Fall sticht er mit der Trumpf-Zehn ein und wird vom Spielmacher mit der Trumpf-Sau überstochen. Anders liegt es erst, wenn der Solospieler vor diesem Stich schon einen Spatz abgeworfen hat: einen zweiten erwarte ich dann nicht, und auf einen angespielten König gebe ich meine Sau nicht mehr zu.",
  },
  {
    id: "keine-sau-gegen-hinterhand",
    kapitel: "5.18",
    seite: 185,
    titel: "Keine Sau ausspielen gegen die Hinterhand",
    kurz: "In den allermeisten Fällen ist es ein schwerwiegender Fehler, auf ein Solo oder einen Farbwenz in Hinterhand eine Sau auszuspielen.",
    lang:
      "Das Buch nennt dies vielleicht das wichtigste Kapitel überhaupt; nicht selten ist ein Solo nach dieser ersten Karte für die Verteidiger nicht mehr zu gewinnen. Zum einen bringt die Sau die Partner in eine schwierige Lage: sie müssen raten, wie viele Punkte sie zulegen sollen, denn ob der Spieler in dieser Farbe einen Spatz hat, ist nicht zu erkennen — die Zehn wäre im einen Fall die einzig richtige Karte, im anderen ein unverzeihlicher Fehler. Zum anderen eröffnet die Sau dem Spielmacher, der sich als Letzter entscheiden darf, alle Optionen: liegen nur elf Punkte im Stich, spatzt er entspannt ab und bleibt in Hinterhand; kommen Punkte hinzu, sticht er ungefährdet mit einem Schmiertrumpf ein und hat oft schon die halbe Miete. Und selbst wenn die Sau seinen Spatz erwischt, kam von den Partnern meist nur der König dazu. Vor allem aber widerspricht das Sau-Anspiel der wichtigsten Strategie der Verteidigung: den Alleinspieler in die Mittelhand zu bringen. Beim farblosen Wenz sieht es anders aus, siehe Kapitel 5.7.",
  },
  {
    id: "sau-gegen-hinterhand-ausnahme",
    kapitel: "5.19",
    seite: 187,
    titel: "Wann doch eine Sau gegen die Hinterhand ausspielen",
    kurz: "Gegen ein Solo oder einen Farbwenz in Hinterhand spiele ich nur dann eine Sau aus, wenn ich voraussichtlich drei Trumpfstiche machen werde.",
    lang:
      "Die eine sinnvolle Ausnahme zum vorigen Kapitel: Ich bin selbst sehr trumpfstark und rechne mit drei Trumpfstichen für unser Team — die allein sollten den Sieg bringen, sofern die Partner ausreichend schmieren können. Damit deren Schmierkarten geschont werden, müssen dem Solospieler die Punkte wohl oder übel von mir angeboten werden. Meine Partner sollen mein Anspiel deshalb richtig lesen: die Sau zeigt an, dass ich mehrfach mit Trumpf stechen werde, und sie dürfen jetzt auf keinen Fall die Zehn dazugeben. Unsere Gewinnhoffnung hängt nicht an meinen Schmierkarten; sticht sie der Spieler, ist das unerheblich, solange er nicht die Vollen der Partner bekommt. Erwische ich mit der Sau seinen Spatz, spiele ich dieselbe Farbe klein nach — vielleicht ist ein Partner inzwischen frei und kann einen alleinstehenden Trumpf abwerfen. Eine zweite, seltene Ausnahme ist die Zwangslage, in der ich nur Farben halte, von denen ich auch die Sau habe: dann eröffne ich lieber mit der Sau als mit einer Lusche, weil das Schinden die Freunde verwirren würde.",
  },
  {
    id: "letzten-trumpf-abwerfen",
    kapitel: "5.20",
    seite: 189,
    titel: "Den letzten Trumpf abwerfen",
    kurz: "Ich werfe einen blanken kleinen Trumpf zu Beginn des Spiels so rasch wie möglich ab, damit ich meinen Partnern im folgenden Trumpfstich möglicherweise schmieren kann.",
    lang:
      "Ein einzelner kleiner Trumpf, mit dem sicher kein Stich mehr zu machen ist, ist nicht nur nutzlos, sondern hinderlich: kommt der Spielmacher nicht gerade mit dem höchsten Trumpf, sondern mit einem kleineren heraus, darf ich nicht einmal schmieren, weil ich erst die Trumpflusche bedienen muss. Also werfe ich ihn bei der ersten Gelegenheit ab und habe in der zweiten Runde alle Optionen: kommt der Alte, gebe ich eine leere Farbkarte zu; kommt ein kleiner Trumpf, den meine Partner stechen können, schmiere ich einen Vollen. Sinnvoll ist dieses freiwillige Abwerfen aber nur, wenn ich anschließend wirklich trumpflos bin. Das wissen auch die Partner: sie dürfen aus meiner Spielweise ableiten, dass bei mir kein Trumpf mehr steht, ihr Gegenspiel danach ausrichten und mir optimistisch ein paar Schmierkarten zutrauen.",
  },
  {
    id: "erster-partner-gibt-richtung-vor",
    kapitel: "5.21",
    seite: 191,
    titel: "Ebenfalls schmieren, wenn alle schmieren",
    kurz: "Beim Schmieren gibt der erste Partner die Richtung vor: Schmiert er, schmiere ich als zweiter Partner ebenfalls. Bleibt er klein, bleibe auch ich klein.",
    lang:
      "Ob auf einen Trumpfstich des Spielmachers geschmiert werden soll, lässt sich als Einzelner nicht entscheiden — man weiß ja nicht, wo der höchste noch fehlende Trumpf steht. Deshalb gilt: hopp oder top. Entweder schmiert keiner und wir setzen darauf, dass der starke Spieler mit einem kleinen Trumpf ausweichen kann; oder alle schmieren und hoffen auf den dritten Partner. Der erste Partner gibt den Weg vor, der zweite geht ihn mit, so oder so. Nichts wäre unglücklicher, als wenn der Mitstreiter dahinter den höchsten Trumpf hätte und sich entscheiden müsste, entweder die schon geschmierte Zehn dem Spieler zu überlassen oder seinen Riesentrumpf für eine magere Summe zu verbrauchen. Natürlich geht das Vorgehen regelmäßig schief. Aber dann war das Spiel meist ohnehin nicht zu gewinnen — so hatten wir wenigstens eine Chance.",
  },
  {
    id: "vorstechen",
    kapitel: "5.22",
    seite: 193,
    titel: "Im richtigen Moment vorstechen",
    kurz: "Vorstechen ist eine gute Möglichkeit, dem Spielmacher einen hohen Trumpf zu ziehen oder ihn in Mittelhand zu bringen.",
    lang:
      "Vorstechen heißt einzustechen, obwohl der Spielmacher erst nach mir an die Reihe kommt. Wer nur einen blanken Trumpf hat, ist damit oft besser bedient als mit einer Schmierkarte auf gut Glück. Ist der Spieler die angespielte Farbe ebenfalls frei, lockt das Vorstechen ihm einen Ober heraus, den er für den Stich jetzt schon braucht — und der ihm später beim Ziehen unserer Trümpfe fehlt; vielleicht macht der starke Partner dadurch einen zusätzlichen Trumpfstich. Zugleich mache ich mich trumpffrei und kann von da an bei den Trumpfstichen der Partner wertvolle Punkte schmieren, statt erst den Unter zugeben zu müssen. Und selbst wenn der erste Stich schon einen Spatz des Spielers erwischt hat, war das Vorstechen richtig: es holt ihn aus der gemütlichen Hinterhand in die Mittelhand, und der starke Partner muss den gezogenen Trumpf nicht mehr beim Spielmacher vermuten.",
  },
  {
    id: "doppelstich-verhindern",
    kapitel: "5.23",
    seite: 195,
    titel: "Doppelstich in einer Farbe verhindern",
    kurz: "Könnte der Spielmacher im Wenz oder Farbwenz eine Sau-Lusche-Kombination haben, achte ich als Gegner darauf, dass er mit dieser Lusche nicht zum Stechen kommt.",
    lang:
      "Im Wenz und im Farbwenz sind die Ober gewöhnliche Farbkarten — mittelhohe dazu. Hält der Spielmacher in einer Fehlfarbe die Sau und eine solche mittelhohe Karte, macht er darin zwei Stiche, wenn ich ihm die kleinere billig durchgehen lasse: erst nimmt er mit der Lusche, und nachdem er die Trümpfe gezogen hat, folgt der zweite Stich mit der Sau. Um das zu verhindern, investiere ich lieber die vier Punkte meines Königs. Dann muss er mit der Sau übernehmen, denn sich mit der kleineren Karte unterzustellen kann er nicht riskieren: er muss damit rechnen, dass ich die Farbe nachbringe und seine Sau verliert, falls ein Partner sie inzwischen frei ist. Im weiteren Verlauf achte ich darauf, wann die mittelhohe Karte fällt: meine Zehn halte ich so lange zurück, bis das geschehen ist oder bis ich damit stechen kann.",
  },
  {
    id: "sau-fuer-die-zehn-zurueckhalten",
    kapitel: "5.24",
    seite: 197,
    titel: "Die Sau für die gegnerische Zehn zurückhalten",
    kurz: "Könnte der Spielmacher im Wenz oder Farbwenz eine Zehn-König-Kombination haben, stehe ich beim König unter, um dann später mit der Sau die Zehn zu stechen.",
    lang:
      "Eine Zehn-König-Kombination als Fehlfarbe ist für einen Wenzspieler nichts Ungewöhnliches: weil die fehlende Sau höchstens eine der beiden Karten stechen kann, zählen Zehn und zugehöriger König zusammen nur als ein Spatz. Gibt er auf ein Anspiel dieser Farbe nur den König, wäre es ein Fehler, mit der Sau zu übernehmen — zehn Punkte sind für den Gegner viel wertvoller als vier. Also stehe ich erst einmal mit einer kleinen Karte unter. Früher oder später muss er die Zehn bringen, oder ich fange sie, indem ich die Sau selbst anspiele; sind die Partner die Farbe dann schon frei, können sie obendrein kräftig schmieren. Nicht selten gewinnt ein solcher Stich die Partie. Umgekehrt heißt das für den Spielmacher: hat er sich gleich von der Zehn getrennt, hätten die Gegner mit dem Ober nur drei Punkte beisteuern können.",
  },
  {
    id: "ober-ziehen",
    kapitel: "5.25",
    seite: 199,
    titel: "Dem Solospieler einen Ober ziehen",
    kurz: "Wird eine Farbe mit einer punktreichen Karte nachgespielt, kann ich einem Solospieler an Position 3 durch Vorstechen oder Schmieren einen sehr hohen Trumpf abnötigen.",
    lang:
      "Hat das erste Anspiel einen Spatz des Solospielers erwischt und wird die Farbe nachgespielt, kann er den zweiten Stich nicht durchlassen — sonst schmiert der freie Mitspieler dahinter, und die Gegenpartei hätte fast vierzig Punkte. Er wird also einstechen. Werfe ich nur eine Lusche dazu, kommt er mit einem Unter aus. Ich will ihm aber einen Ober abluchsen, der ihm später beim Ziehen unserer Trümpfe fehlt. Dafür gibt es zwei Wege: kräftig schmieren und die Punktzahl so hoch treiben, dass er sie mit einem Laufenden sichern muss — oder selbst mit einem hohen Trumpf vorstechen, worauf er zwangsläufig überstechen muss, weil er den Hintermann fürchtet. Habe ich nur wenige Schmierkarten und werde mit meinem hohen Trumpf nach dem Trumpfziehen ohnehin kaum noch zum Stechen kommen, wähle ich das Vorstechen. Sinnvoll ist es allerdings nur, wenn ich den hohen Trumpf blank oder höchstens einfach besetzt halte und dadurch keinen Trumpfstich verschenke.",
  },
  {
    id: "zusaetzlichen-trumpfstich-erarbeiten",
    kapitel: "5.26",
    seite: 201,
    titel: "Sich einen zusätzlichen Trumpfstich erarbeiten",
    kurz: "Durch Anbieten genügend vieler Punkte kann ich einen Solospieler in Mittelhand nötigen, zum Stechen dieser Punkte einen Laufenden aufzuwenden.",
    lang:
      "Der Gegenentwurf zum Vorstechen: Wer einen hohen Trumpf mehrfach besetzt hält, verschenkt beim Vorstechen einen sicheren Trumpfstich, weil der Spieler überstechen wird. Dann ist Schmieren der bessere Weg. Reichere ich den nachgespielten Farbstich so weit an, dass der Solospieler in Mittelhand ihn nicht mehr abgeben darf, ist er fast gezwungen, einen seiner großen Ober aufzubieten: er muss davon ausgehen, dass sein Hintermann die Farbe ebenfalls frei ist, und er weiß nicht, ob dieser nicht auch noch einen hohen Trumpf hat. Durch dieses erzwungene hohe Einstechen kann er anschließend nur noch einmal von oben anziehen — und ich mache neben dem Stich mit meinem hohen Trumpf noch einen zweiten mit dem nächsten. Das gleicht das geopferte Volle mehr als aus.",
  },
  {
    id: "auf-mageren-stich-verzichten",
    kapitel: "5.27",
    seite: 203,
    titel: "Auf einen mageren Stich verzichten",
    kurz: "Gelegentlich opfere ich eine Schmierkarte oder verzichte auf einen Stich, wenn ich dafür erwarten darf, später im Spiel einen zusätzlichen oder einen umso wertvolleren Stich zu gewinnen.",
    lang:
      "Nicht jeder Stich, den man nehmen kann, ist es wert. Wer trumpfstark ist und ohnehin zwei sichere Trumpfstiche vor sich hat, verliert einen davon, wenn er einen Schmiertrumpf vorschnell in einen mageren Farbstich wirft. Elf Punkte jetzt sind weniger wert als derselbe Stich später, wenn die Freunde dazu schmieren können — und obendrein bleibt die starke Trumpfhand zusammen und man wird durch das Abwerfen eine weitere Farbe frei. Der Verzicht hat noch einen zweiten Nutzen: die Mitspieler können aus dem abwägenden Überlegen schließen, dass sie einen trumpfstarken Partner in ihren Reihen haben. Denn wer nur unbedeutende Trümpfe hätte, hätte sicher einen davon im ersten Stich investiert. Sie sollten ihre Schmierkarten daraufhin nicht mehr leichtfertig riskieren, sondern auf die Trumpfstiche warten.",
  },
  {
    id: "unscheinbare-karten-nicht-freudlos",
    kapitel: "5.28",
    seite: 205,
    titel: "Bereits gespielte Farben schnell auflösen",
    kurz: "Auch bei einem trostlosen Blatt bleibe ich stets konzentriert und werfe meine vermeintlich unscheinbaren Karten nicht freudlos ab.",
    lang:
      "Auch wer nichts mehr zu gewinnen hat, kann seinen Partnern das Leben leichter machen. Hat der Wenzspieler in einer Farbe die Sau genommen, muss ein Partner, der dort den König hält, diesen behalten, solange die kleineren Karten der Farbe noch nicht gefallen sind — denn nicht selten hat ein Wenzspieler zur Sau noch eine zweite Karte derselben Farbe. Dieses Festhalten kann den Freund in Schwierigkeiten bringen: er muss womöglich eine andersfarbige Zehn-Lusche- oder König-Lusche-Lusche-Kombination auflösen. Wer stattdessen seine eigenen kleinen Karten dieser Farbe rasch abwirft, nimmt ihm die Sorge ab. Ein schwaches Blatt bedeutet ohnehin meist, dass ein Partner umso stärker sitzt — Grund genug, auch in scheinbar aussichtslosen Momenten konzentriert zu bleiben. Manchmal ist das erklärte Ziel eben nur, aus dem Schneider zu kommen; gelingt das durch durchdachtes Spiel, ist es moralisch so wertvoll wie ein Sieg.",
  },
  {
    id: "farbe-nachspielen-vor-dem-spielmacher",
    kapitel: "5.29",
    seite: 207,
    titel: "Dem Alleinspieler einen hohen Trumpf ziehen",
    kurz: "Insbesondere wenn ich direkt vor dem Spielmacher sitze, bringe ich durch das Nachspielen einer Farbe den Alleinspieler in arge Bedrängnis.",
    lang:
      "„Kurzer Weg – lange Farbe“ hilft nicht weiter, wenn ich von jeder Farbe genau zwei Karten habe. Halte ich aber den höchsten Trumpf und werde deshalb bald wieder ans Ausspiel kommen, gibt es eine bessere Konstellation: Ich bringe eine Farbe, von der ich auch die Zehn habe — zuerst aber die Lusche. Übernimmt der Spielmacher oder sticht er ein, wird er voraussichtlich mit Trumpf fortsetzen; mit meinem großen Trumpf komme ich rasch erneut ans Ausspiel und bringe dann die Zehn nach. Weil er weder weiß, wie viele Karten dieser Farbe ich habe, noch ob die Partner hinter ihm sie inzwischen frei sind, muss er zwischen zwei unangenehmen Möglichkeiten wählen: hoch einstechen und sich meine Zehn sichern, dafür aber einmal weniger anziehen können — oder klein einstechen und riskieren, überstochen zu werden. Hat er nicht beide Schmiertrümpfe selbst, kann das teuer werden.",
  },
  {
    id: "nach-spritze-punkte-schonen",
    kapitel: "5.30",
    seite: 209,
    titel: "Nach einer Spritze seine Punkte schonen",
    kurz: "Nach einer ausgesprochenen oder auch nur erwogenen Spritze eines trumpfstarken Partners achte ich sehr auf meine Schmierkarten, um ja genügend Punkte auf dessen Stiche zugeben zu können.",
    lang:
      "Mit seiner Spritze übernimmt der Mitspieler die Führungsrolle für das Gegenspiel: er stellt ein, zwei Trumpfstiche mehr in Aussicht, als der Solospieler eingeplant hat. Sollen die zum Sieg führen, müssen die Partner im richtigen Moment genügend Punkte zugeben können — also darf jetzt keine Schmierkarte mehr in einem Farbstich verheizt werden. Eine Spritze relativiert damit sogar die Grundregel „Kurzer Weg – lange Farbe“; Vorrang hat das Schonen der Schmierkarten sämtlicher Partner. Ich bringe deshalb als erste Karte eine einzeln stehende Lusche und hoffe, keinem Freund Bauchschmerzen zu bereiten. Kommt der spritzende Spieler selbst ans Ausspiel, muss auch er sein Möglichstes tun, um den Partnern die Schmierkarten nicht zu ziehen: das gelingt ihm am ehesten, wenn er von sich aus Punkte anbietet, also eine Sau oder eine blanke Zehn ausspielt — selbst wenn er damit rechnen muss, dass der Solospieler sie sticht.",
  },
  {
    id: "wenz-tout-sau-abwerfen",
    kapitel: "5.31",
    seite: 211,
    titel: "Richtig abwerfen auf einen Wenz-Tout",
    kurz: "Bei einem Wenz-Tout zeige ich durch Abwerfen einer Sau den Partnern, welche Farbe sie bedenkenlos abwerfen können.",
    lang:
      "Wer einen Wenz-Tout riskiert, hat keine Schwäche im Trumpf: er holt sich mit Eichel- und Gras-Unter zuerst die fehlenden Trümpfe und beginnt dann, seine Farben zu spielen. Angreifbar ist er in aller Regel nur in einer Farbe, von der er Sau, Zehn und zwei Luschen hält — und selbst dann nur, wenn der König bei einem Gegenspieler mit den beiden fehlenden Karten dieser Farbe zusammensteht und dieser keine davon vorzeitig abwirft. In ganz seltenen Fällen hat er neben drei Untern eine Farbe fünffach besetzt und es fehlt ihm die Zehn; dann hofft er darauf, dass sie bei den Gegnern blank sitzt — was sie mit fünf Karten dieser Farbe auf der eigenen Hand zu rund 70 Prozent auch tut. Halte ich selbst die Sau einer Farbe, kann der Toutspieler dort keinen Spatz haben. Werfe ich sie früh ab, zeige ich das den Partnern an: sie dürfen diese Farbe daraufhin ebenfalls bedenkenlos abwerfen und dafür eine andersfarbige König-Lusche-Lusche-Kombination zusammenhalten.",
  },
  {
    id: "hohen-trumpf-rasch-abwerfen",
    kapitel: "5.32",
    seite: 213,
    titel: "Schelln-Unter statt kleinem Trumpf abwerfen",
    kurz: "Durch rasches Abwerfen hoher Trümpfe, die nicht zum Stich kommen werden, kann ich den Partnern helfen, die Stärke des Spielmachers richtig einzuschätzen.",
    lang:
      "Für mich selbst macht es keinen Unterschied, in welcher Reihenfolge ich zwei ohnehin verlorene Trümpfe zugebe — für meine vor mir sitzenden Partner sehr wohl. Solange ein hoher Trumpf nicht auf dem Tisch war, müssen sie ihn beim Spielmacher vermuten und richten ihr Spiel danach aus: wer etwa Trumpf-Unter und Trumpf-Sau hält, gibt dann die Sau her, um mit dem Unter später einen sicheren Stich zu machen. Werfe ich den hohen Trumpf dagegen sofort ab, kann der Partner beim nächsten Anziehen ruhigen Gewissens seinen Unter abwerfen und behält die Sau als höchsten Trumpf — statt mit einem Unter sticht die Partei dann mit der Sau und bekommt neun Punkte mehr. Nicht selten sind es diese neun Punkte, die zum Schneiderfrei oder zum Sieg verhelfen. Das Risiko: steht der fehlende hohe Trumpf doch bei einem Partner, habe ich zwei Punkte verschenkt. Die entscheiden nur selten über Gewinn und Verlust.",
  },
  {
    id: "nicht-von-intuition-verleiten-lassen",
    kapitel: "5.33",
    seite: 215,
    titel: "Sich nicht von der Intuition verleiten lassen",
    kurz: "Ich verzichte auch auf einen verlockend profitablen Stich, wenn ich dafür im Gegenzug einen zusätzlichen zweiten Trumpfstich mache.",
    lang:
      "Ein fetter Stich, den man mit dem höchsten Trumpf an sich reißen kann, ist eine Versuchung — und oft ein schlechtes Geschäft. Denn ist der Alte einmal gefallen, zieht der Spieler mit den nächsten beiden Obern die restlichen Trümpfe, und es bleibt bei diesem einen Trumpfstich. Bleibe ich dagegen weg, kann ich dem gegnerischen Ober mit einem kleinen Trumpf ausweichen und steche danach zweimal sicher. Zwei Trumpfstiche bringen unter normalen Umständen weit mehr ein als die geopferten Punkte des einen Farbstichs, zumal Schmiertrümpfe und Schmierkarten noch im Spiel sind und einige davon bei den Partnern liegen. So kann es zum Sieg reichen, auch wenn der Spielmacher sonst keine Schwäche mehr hat.",
  },
];

export const STELLUNGEN = [
  {
    id: "b4-5.1-s150",
    regelId: "kurzer-weg-lange-farbe",
    seite: 150,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 3,
    lage:
      "Spieler 3 hat ein Herz-Solo angesagt, du sitzt in Vorhand. Der Weg zu ihm ist kurz — hinter ihm sitzt noch dein Partner auf Platz 4. An Trumpf hast du nur den Schelln-Ober und die Herz-Sieben. Deine längste Farbe ist Eichel mit Sau, König und Sieben; dazu Gras-Zehn und Gras-Neun und die Schelln-Sau.",
    stich: [],
    hand: ["SO", "H7", "EA", "EK", "E7", "GX", "G9", "SA"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["EA"],
    loesungstext: "Die Eichel-Sau",
    begruendung:
      "Kurzer Weg — lange Farbe. Eichel ist mit drei Karten deine längste Farbe, und du hast die Sau; deine einzige Schmierkarte ist sie auch nicht, denn die Schelln-Sau bleibt dir. Also spielst du sie: Erwischst du damit einen Spatz des Solospielers, bleibst du am Ausspiel und kannst Eichel gleich noch einmal bringen. Sticht er ein, sitzt dein Partner auf Platz 4 hinter ihm und kann überstechen. Die Schelln-Sau anzuspielen wäre falsch — sie steht blank, und nach ihr wärst du die Farbe los, ohne nachsetzen zu können.",
  },
  {
    id: "b4-5.2-s152",
    regelId: "langer-weg-kurze-farbe",
    seite: 152,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 4,
    lage:
      "Spieler 4 hat ein Herz-Solo angesagt, du sitzt in Vorhand — der Weg zu ihm ist lang, er sitzt in Hinterhand. An Trumpf hast du nur den Schelln-Ober und die Herz-Sieben. In Eichel liegen Sau, Zehn und Sieben, in Gras Zehn und Neun, in Schelln steht der König einzeln.",
    stich: [],
    hand: ["SO", "H7", "EA", "EX", "E7", "GX", "G9", "SK"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["SK"],
    loesungstext: "Den Schelln-König",
    begruendung:
      "Langer Weg — kurze Farbe. Der Schelln-König steht einzeln; spielst du ihn, bist du die Farbe frei und bedrohst den Solospieler später, wenn du wieder ans Ausspiel kommst und unmittelbar vor ihm sitzt. Im besten Fall gibt ein Partner die Schelln-Sau zu und erwischt einen Spatz des Spielmachers; dann bleibt unsere Partei am Ausspiel und der Spielmacher steht in der ungeliebten Mittelhand. Die Eichel-Sau kommt nicht in Frage: gegen einen Alleinspieler in Hinterhand spielt man keine Sau an — blank oder nicht.",
  },
  {
    id: "b4-5.3-s154",
    regelId: "ranggleiche-von-unten",
    seite: 154,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 3,
    lage:
      "Spieler 3 spielt ein Herz-Solo, du sitzt in Hinterhand. Dein Partner in Vorhand hat die Eichel-Sau angespielt, Spieler 2 gab die Eichel-Neun, der Solospieler den Eichel-König. Du musst bedienen und hast dafür die Eichel-Acht und die Eichel-Sieben — für dich zwei gleichwertige Karten.",
    stich: [{ sitz: 1, card: "EA" }, { sitz: 2, card: "E9" }, { sitz: 3, card: "EK" }],
    hand: ["HU", "H7", "E8", "E7", "GA", "G7", "SK", "S7"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["E7"],
    loesungstext: "Die Eichel-Sieben, nicht die Eichel-Acht",
    begruendung:
      "Für dich macht es keinen Unterschied, für deine Partner sehr wohl. Gibst du die Acht, schließt der Ausspieler daraus, dass du die Sieben nicht hast und eichelfrei bist. Er bringt später die Eichel-Zehn — womöglich seine einzige Schmierkarte — und erwartet, dass du den Solospieler überstichst. Der Partner auf Platz 2 vermutet die Sieben beim Ausspieler und legt eine weitere Schmierkarte dazu. Der Spielmacher sticht ein, und du musst mit rotem Kopf die Eichel-Sieben bedienen. Mit der Sieben zeigst du dagegen nichts Falsches an: von zwei ranggleichen Karten kommt immer die kleinere.",
  },
  {
    id: "b4-5.4-s156",
    regelId: "abwuerfe-der-partner-lesen",
    seite: 156,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 1,
    lage:
      "Spieler 1 spielt ein Herz-Solo. Im ersten Stich zog er mit dem Eichel-Ober; du gabst deine Herz-Sieben, Spieler 2 die Herz-Neun — und dein Hintermann auf Platz 4 warf den Gras-Ober ab. Jetzt zieht der Spielmacher mit dem Schelln-Ober nach, Spieler 2 bedient mit dem Schelln-Unter, und du bist trumpffrei.",
    stich: [{ sitz: 1, card: "SO" }, { sitz: 2, card: "SU" }],
    hand: ["EA", "EX", "E8", "E7", "GX", "GK", "S9"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["S9"],
    loesungstext: "Die Schelln-Neun",
    begruendung:
      "Der Gras-Ober im ersten Stich war eine klare Ansage: wer sich vom zweithöchsten Trumpf trennt, hat keinen kleineren mehr, und den Herz-Ober hätte er vorher abgegeben. Dein Hintermann ist also trumpffrei — auf diesen Stich zu schmieren lohnt nicht. Wirf die Lusche ab und mach dich dadurch schellnfrei. Zugleich lässt sich rechnen: von den vierzehn Trümpfen hattet ihr beide zusammen nur zwei, die zwölf übrigen verteilen sich auf den Spielmacher und Spieler 2 — der hält also mindestens vier, vermutlich fünf. Mit einem so starken Mitstreiter riskierst du deine Vollen nicht mehr in Farbstichen, sondern hebst sie für seine Trumpfstiche auf.",
  },
  {
    id: "b4-5.5-s158",
    regelId: "spielmacher-in-mittelhand",
    seite: 158,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 1,
    lage:
      "Spieler 1 spielt ein Herz-Solo und hat mit dem Eichel-Unter angezogen. Dein Partner auf Platz 2 hat mit dem Schelln-Ober übernommen, Spieler 3 die Herz-Zehn geschmiert. Du sitzt in Hinterhand und hältst nur zwei Trümpfe: den Herz-Ober, über dem nur noch Eichel- und Gras-Ober stehen, und die Herz-Neun.",
    stich: [{ sitz: 1, card: "EU" }, { sitz: 2, card: "SO" }, { sitz: 3, card: "HX" }],
    hand: ["HO", "H9", "EA", "EK", "GX", "GK", "SK", "S7"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["HO"],
    loesungstext: "Den Herz-Ober",
    begruendung:
      "Den eigenen Partner zu überstechen sieht nach Verschwendung aus, ist hier aber der stärkste Zug. Gibst du nur die Herz-Neun zu, bleibt Spieler 2 am Ausspiel — und der Solospieler sitzt dann in Hinterhand. Spielt dein Freund eine Farbe an, die der Spielmacher frei ist, kann der nach Belieben klein einstechen oder abwerfen, kommt anschließend mit einem großen Ober nach, und dein dann blanker Herz-Ober ist dahin. Übernimmst du dagegen, spielst du selbst an und bringst den Alleinspieler in die Mittelhand. Kommst du danach mit einer Sau und erwischst einen Spatz, können deine Mitspieler risikolos schmieren; und ist er die Farbe frei, darf er weder abspatzen noch mit einem Schmiertrumpf einstechen, weil er einen freien Hintermann fürchten muss.",
  },
  {
    id: "b4-5.6-s160",
    regelId: "lusche-statt-schmierkarte-lesen",
    seite: 160,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt einen Herz-Wenz. Du hast in Vorhand die Gras-Sau angespielt und damit eine Fehlfarbe des Spielmachers erwischt: er musste den Gras-König zugeben, Spieler 3 die Gras-Zehn. Spieler 4 aber war grasfrei und hat nicht etwa geschmiert, sondern die Schelln-Sieben abgeworfen. 25 Punkte liegen damit auf eurem Konto.",
    stich: [],
    hand: ["HU", "H7", "G9", "EX", "E7", "SX", "SK"],
    frage: "Welche Karte soll ich nachspielen?",
    loesung: ["SX"],
    loesungstext: "Die Schelln-Zehn",
    begruendung:
      "Die Schelln-Sieben deines Partners war kein Zufall: hätte er nur nichts zu schmieren gehabt, wäre wenigstens ein König gekommen. Er hat sich also bewusst schellnfrei gemacht. Antworte darauf mit deiner punktreichsten Karte dieser Farbe. Übernimmt der Spielmacher mit der Schelln-Sau, macht dein Freund in Hinterhand hoffentlich einen schönen Stich. Ist der Wenzspieler selbst schellnfrei, steckt er in der Klemme: einen weiteren teuren Stich kann er sich bei 25 Punkten nicht leisten, also muss er hoch einstechen — und da er nicht weiß, ob dein Herz-Unter nicht beim schellnfreien Hintermann sitzt, setzt er womöglich sogar den Eichel- oder Gras-Unter ein. Dann wird dein einfach besetzter Herz-Unter hoch, den er dir sonst mit seinen beiden hohen Untern abgenommen hätte.",
  },
  {
    id: "b4-5.7-s162",
    regelId: "auf-einen-wenz-eine-sau",
    seite: 162,
    spiel: { type: "wenz" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 hat einen Wenz angesagt, du sitzt in Vorhand — der Spielmacher also in Mittelhand. Trümpfe hast du keine. In Eichel liegen Sau, König und Neun, dazu der Gras-König, Herz-Zehn und Herz-Sieben sowie Schelln-Zehn und Schelln-Sieben.",
    stich: [],
    hand: ["EA", "EK", "E9", "GK", "HX", "H7", "SX", "S7"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["EA"],
    loesungstext: "Die Eichel-Sau",
    begruendung:
      "Auf einen Wenz gehört eine Sau. Im Wenz gibt es nur vier Trümpfe; jeden davon, den der Spielmacher für einen Farbstich hergeben muss, fehlt ihm später. Ein Bock — eine Karte, die keine Farbkarte mehr stechen kann — zwingt ihn genau dazu. Zu Beginn sind das die Säue, und deine einzige ist die Eichel-Sau. Weil der Wenzspieler hier in Mittelhand sitzt, ist das zweifelsfrei richtig. Bleibst du nach der ersten Runde am Ausspiel, bringst du mangels weiterer Böcke den Eichel-König nach, auch wenn die Eichel-Zehn noch nicht gefallen ist: sie steht dann zwar wahrscheinlich beim Spielmacher, aber mindestens einer deiner Freunde ist inzwischen eichelfrei und kann mit einem kleinen blanken Unter übernehmen, statt sich diesen eine Runde später ziehen zu lassen.",
  },
  {
    id: "b4-5.8-s164",
    regelId: "von-der-farbe-gehen",
    seite: 164,
    spiel: { type: "wenz" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt einen Wenz. Du hast die Eichel-Sau angespielt und den Stich gemacht: Spieler 4 gab die Eichel-Zehn, Spieler 1 den Eichel-Ober, der Spielmacher die Eichel-Sieben. In Eichel sind damit nur noch die vier Punkte deines Königs zu holen. Spielst du weiter an, sitzt der Spielmacher hinter allen anderen — an Position 4.",
    stich: [],
    hand: ["EK", "GX", "G7", "HK", "H9", "H7", "SK"],
    frage: "Welche Karte soll ich nachspielen?",
    optionen: [
      "Den Eichel-König",
      "Eine neue Farbe, zum Beispiel den Schelln-König",
    ],
    loesung: ["Eine neue Farbe, zum Beispiel den Schelln-König"],
    loesungstext: "Nicht den Eichel-König, sondern zum Beispiel den Schelln-König",
    begruendung:
      "Hast du Sau und Zehn gesehen, sollst du von der Farbe gehen. Der Eichel-König ist zwar hoch geworden, aber gegen den Alleinspieler in Hinterhand ist er ein Geschenk: in Eichel sind nur noch vier Punkte im Spiel, und steht es ungünstig, haben deine beiden Partner jeweils noch ein kleines Eichel — dann wird der Spieler eine Fehlkarte praktisch für ein Butterbrot los. Bring stattdessen eine neue Farbe. Dann muss er sich entscheiden, ob er einen seiner wenigen Trümpfe investiert oder einen teuren Stich abgibt. Nur wenn der Spielmacher an Position 3 oder besser an Position 2 säße und du mindestens zwei Eichel hieltest — und damit wüsstest, dass ein Partner eichelfrei ist —, brächte das Nachspielen der Farbe ihn in Bedrängnis.",
  },
  {
    id: "b4-5.9-s166",
    regelId: "fuenfzehn-punkte-anbieten",
    seite: 166,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt ein Herz-Solo und sitzt hinter dir. Spieler 1 hat die Gras-Sieben angespielt, Spieler 2 die Gras-Sau daraufgelegt. Du hältst selbst drei Gras-Karten und darfst deshalb annehmen, dass der Spielmacher grasfrei ist.",
    stich: [{ sitz: 1, card: "G7" }, { sitz: 2, card: "GA" }],
    hand: ["SO", "E8", "E7", "GX", "GK", "G9", "SX", "SK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["GK"],
    loesungstext: "Den Gras-König",
    begruendung:
      "Du entscheidest, wie teuer der Stich für den Spielmacher wird. Mit der Gras-Neun bliebe es bei den elf Punkten der Sau — davon trennt er sich billig, ein Spatz ist schnell abgeworfen. Mit der Gras-Zehn wären es 21; ist er grasfrei und hat einen Schmiertrumpf, hätte er damit schon die halbe Miete zusammen. Der Gras-König trifft den goldenen Mittelweg: 15 Punkte sind zu viel zum Abspatzen und locken ihn zum Einstechen — es sei denn, er bliebe dadurch in Hinterhand, was hier nicht der Fall ist. Und wirft er doch seinen Spatz ab, stehen 15 Punkte auf eurem Konto und mit zwei weiteren Stichen ist der Sack zu.",
  },
  {
    id: "b4-5.10-s168",
    regelId: "auf-verdacht-schmieren",
    seite: 168,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 2,
    spielmacher: 1,
    lage:
      "Spieler 1 spielt einen Herz-Wenz und zieht mit dem Gras-Unter an — dem zweithöchsten Trumpf. Ein Wenzspieler mit zwei laufenden Untern beginnt im Regelfall genau so. Neben deiner Herz-Sau, die im Herz-Wenz ein Trumpf mit elf Punkten ist, hast du nur noch die Herz-Sieben.",
    stich: [{ sitz: 1, card: "GU" }],
    hand: ["HA", "H7", "EA", "EK", "E7", "G9", "SK", "S7"],
    frage: "Welchen Trumpf soll ich zugeben?",
    loesung: ["HA"],
    loesungstext: "Die Herz-Sau",
    begruendung:
      "Schmiere auf Verdacht — falsch machen kannst du damit nichts, weil du neben der Sau nur einen weiteren Trumpf hast. Hat einer deiner Partner den Eichel-Unter, übersticht er und du bringst deine elf Punkte nach Hause. Steht der Eichel-Unter beim Spielmacher, zieht er ihn in der zweiten Runde nach — und deine Trumpf-Sau fällt dann eben da. Nur die Herz-Sieben zuzugeben wäre also der Fehler. Hättest du einen dritten Trumpf, etwa noch die Herz-Acht, sähe es anders aus: dann hieltest du die Schmiersau zurück und hofftest auf einen starken Partner in der dritten Trumpfrunde.",
  },
  {
    id: "b4-5.11-s170",
    regelId: "farbe-des-freien-partners",
    seite: 170,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt ein Herz-Solo. Spieler 1 hat die Gras-Sieben angespielt, der Spielmacher musste die Gras-Zehn zugeben — Gras ist seine Fehlfarbe. Spieler 3 war bereits grasfrei und schmierte die Eichel-Zehn, du hast mit der Gras-Sau gestochen: 31 Punkte, die halbe Miete. Spielst du jetzt an, steht der Solospieler an Position 3 in Mittelhand, und alle haben gesehen, dass sein direkter Hintermann grasfrei ist. Gras-Sau und Gras-Zehn sind allerdings schon gefallen.",
    stich: [],
    hand: ["HU", "HA", "G8", "EA", "E7", "SX", "S8"],
    frage: "Soll ich Gras nachspielen?",
    loesung: ["G8"],
    loesungstext: "Ja, die Gras-Acht",
    begruendung:
      "Dass in Gras nur noch die vier Punkte des Königs zu holen sind, spricht nicht dagegen — der freie Hintermann tut es. Auf die Gras-Acht kommt vom ersten Partner erwartungsgemäß der König, und der Spielmacher ist fast gezwungen, mit einem Unter einzustechen und damit einen guten Trumpf kürzer zu werden: klein einstechen kann er nicht riskieren, weil deine Trumpf-Sau bei seinem grasfreien Hintermann stehen könnte, und einen Spatz abwerfen kann er auch nicht, weil dann ein zweites Mal geschmiert würde und er in Mittelhand bliebe. Übernimmt er mit einem Unter, hat euer Freund hinter ihm die Wahl: überstechen und weitere acht oder neun Punkte holen, oder liegen lassen und stattdessen das eigene Blatt bereinigen.",
  },
  {
    id: "b4-5.12-s172",
    regelId: "gegen-tout-laengste-farbe-ohne-sau",
    seite: 172,
    spiel: { type: "farbwenz", suit: "H" },
    label: "Herz-Wenz-Tout",
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    hinweis:
      "Die Engine kennt kein Tout; als Spielart ist deshalb der Herz-Wenz eingetragen, der die Karten genauso ordnet.",
    lage:
      "Spieler 2 hat einen Herz-Wenz-Tout angesagt und will damit alle acht Stiche machen. Du sitzt in Vorhand, der Toutspieler also in Mittelhand. Trümpfe hast du keine: vier Gras-Karten von der Sau abwärts, drei Eichel-Karten ohne Sau und den Schelln-König.",
    stich: [],
    hand: ["GA", "GK", "G8", "G7", "EX", "EK", "E7", "SK"],
    frage: "Welche Karte soll ich ausspielen?",
    optionen: ["Eine Eichel-Karte", "Eine Gras-Karte", "Den Schelln-König"],
    loesung: ["Eine Eichel-Karte"],
    loesungstext: "Eine Eichel-Karte",
    begruendung:
      "Gegen einen Tout genügt der Gegenpartei ein einziger Stich, und die größte Schwäche eines Toutspielers in Mittelhand ist meist eine Fehlfarben-Sau. Diese Sau zu fangen ist das Ziel — dafür musst du eine Farbe bringen, von der du selbst keine Sau hast, denn nur dann kann seine Sau überhaupt fallen. Und je mehr Karten du von dieser Farbe hältst, desto wahrscheinlicher ist einer deiner Partner sie frei und kann stechen. Das ist hier Eichel mit drei Karten. Gras scheidet aus, weil du die Sau selbst hast; nur wenn du Gras fünffach besetzt hieltest, käme die Farbe in Frage — dann aber nicht mit der Sau, die deine Absicht verraten würde, sondern mit einer kleinen Karte. Für Solo-Tout und Wenz-Tout gilt dasselbe.",
  },
  {
    id: "b4-5.13-s174",
    regelId: "schmierkarten-schonen",
    seite: 174,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt einen Herz-Wenz und sitzt direkt hinter dir — kurzer Weg. Eine lange Farbe hast du auch: vier Eichel-Karten. Nur einen Trumpf hältst du, die Herz-Acht, und an Schmierkarten steht es schlecht: die Eichel-Zehn und der Eichel-König, zusammen 14 Punkte.",
    stich: [],
    hand: ["H8", "EX", "EK", "E9", "E7", "G9", "G7", "S7"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["E7"],
    loesungstext: "Die Eichel-Sieben, nicht die Eichel-Zehn oder den Eichel-König",
    begruendung:
      "Eichel anzuspielen ist richtig — kurzer Weg, lange Farbe. Die Frage ist, mit welcher Karte. Mit nur einem Trumpf wirst du das Spiel nicht über Trumpfstiche entscheiden; dein wichtigster Beitrag ist, alle vierzehn Punkte nach Hause zu bringen und keinen zu verschenken. Weil du so wenige Trümpfe hast, stehen vermutlich unerwartet viele bei einem Partner — dem willst du schmieren, wenn er zum Stich kommt. Also spielst du ganz konservativ ein kleines Eichel an und gibst deine Punkte erst zu, wenn der Stich wirklich sicher ist. Hat der Spielmacher die Eichel-Sau und sticht ein Partner, ist auch nichts vertan: deine Eichel-Karten bringst du später in den Stichen der Freunde unter.",
  },
  {
    id: "b4-5.14-s176",
    regelId: "trumpf-sau-nicht-vorschnell",
    seite: 176,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 1,
    lage:
      "Spieler 1 spielt einen Herz-Wenz und hat mit dem Gras-Unter angezogen. Dein Partner auf Platz 2 übernahm mit dem Eichel-Unter, Spieler 3 gab den Schelln-Unter zu. Der Stich gehört also eurer Partei. Du musst Trumpf bedienen und hast dafür Herz-Sau, Herz-König und Herz-Sieben.",
    stich: [{ sitz: 1, card: "GU" }, { sitz: 2, card: "EU" }, { sitz: 3, card: "SU" }],
    hand: ["HA", "HK", "H7", "E9", "GK", "G9", "SA", "S7"],
    frage: "Welchen Trumpf soll ich zugeben?",
    loesung: ["HK"],
    loesungstext: "Den Herz-König",
    begruendung:
      "Im Farbwenz ist die Trumpf-Sau nicht bloß eine Schmierkarte, sondern die Nummer fünf der Rangfolge. Wirfst du sie jetzt in einen Stich, den ihr ohnehin gewinnt, verschenkst du einen ganzen Stich: der Wenzspieler hält vermutlich noch Herz-Unter und Herz-Zehn, kommt damit erneut ans Ausspiel und nimmt dir deine beiden kleinen Trümpfe ab. Gibst du dagegen nur den König zu, kannst du dem Herz-Unter mit der Herz-Sieben ausweichen und machst mit der Herz-Sau später einen dicken Trumpfstich. Risikolos ist es obendrein: die elf Punkte bekommst du genauso, nur ein paar Stiche später — und dann sind deine Freunde vermutlich trumpffrei und können schmieren.",
  },
  {
    id: "b4-5.15-s178",
    regelId: "herz-spatz-vermuten",
    seite: 178,
    spiel: { type: "solo", suit: "E" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt ein Eichel-Solo, du sitzt in Vorhand. An Trumpf hast du den Eichel-Unter und die Eichel-Sieben. In den drei Fehlfarben hältst du jeweils eine Sau-Lusche-Kombination: Gras-Sau und Gras-Neun, Herz-Sau und Herz-Sieben, Schelln-Sau und Schelln-Acht.",
    stich: [],
    hand: ["EU", "E7", "GA", "G9", "HA", "H7", "SA", "S8"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["HA"],
    loesungstext: "Die Herz-Sau",
    begruendung:
      "Drei scheinbar gleichwertige Säue — und doch gibt es einen guten Grund für Herz. War das letzte Spiel ein Sauspiel, sind dort Ober, Unter und Herz-Karten in den Trumpfstichen zusammen gefallen und liegen anschließend beieinander im Stapel. Weil nie sauber gemischt wird, landet mit den Obern und Untern gern auch eine Herz-Karte beim Solospieler; die Chance auf einen Spatz in Herz ist deshalb deutlich höher als in einer anderen Farbe. Erwischst du damit seine Fehlfarbe, bringst du ihn anschließend mit deinem zweiten Herz ins Schwitzen. Hättest du neben einer blanken Herz-Karte eine wirklich lange Farbe, gälte weiter „Kurzer Weg – lange Farbe“; und beim Herz-Solo entfällt die Überlegung ohnehin.",
  },
  {
    id: "b4-5.16-s180",
    regelId: "als-starker-gegenspieler-punkte-anbieten",
    seite: 180,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 3,
    lage:
      "Spieler 3 spielt ein Herz-Solo, du sitzt in Vorhand. Drei gute Trümpfe hast du fünffach besetzt — Gras-Ober, Schelln-Ober und Herz-Unter, dazu Herz-Neun und Herz-Sieben. Damit bist du mit gutem Grund der stärkste der drei Gegenspieler und solltest zwei Trumpfstiche sicher machen, mit etwas Glück drei.",
    stich: [],
    hand: ["GO", "SO", "HU", "H9", "H7", "E7", "G8", "SX"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["SX"],
    loesungstext: "Die Schelln-Zehn",
    begruendung:
      "Deine Trumpfstiche bringen den Sieg nur, wenn die Partner dort schmieren können — also dürfen ihre Schmierkarten jetzt nicht in Farbstichen verheizt werden. Biete dem Spielmacher die Punkte lieber selbst an. Dein Partner auf Platz 2 darf den Stich mit dem König auf 14 Punkte aufwerten, damit dem Solospieler das Abspatzen vergeht; die Sau soll er nur zugeben, wenn er mindestens drei weitere Schmierkarten hat, sonst hält er sie für deine Trumpfstiche zurück. Zugleich ist das Anspiel einer Zehn ein Zeichen an die Partner: aus welchem anderen Grund sollte jemand eine Zehn bringen? Verstärken lässt sich der Hinweis durch eine Spritze — oder wenigstens durch Zögern und ein nachdenkliches Gesicht.",
  },
  {
    id: "b4-5.17-s182",
    regelId: "nicht-die-sau-schinden",
    seite: 182,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 2,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt ein Herz-Solo und sitzt in Hinterhand. Spieler 1 hat den Gras-König angespielt. Du hältst selbst vier Gras-Karten — Sau, Zehn, Neun und Sieben —, es fehlt also nur noch ein einziges Gras: vermutlich hat es euer dritter Partner, und der Alleinspieler ist grasfrei.",
    stich: [{ sitz: 1, card: "GK" }],
    hand: ["GU", "GA", "GX", "G9", "G7", "EX", "E7", "SK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["GA"],
    loesungstext: "Die Gras-Sau",
    begruendung:
      "Gerade weil der Spielmacher grasfrei sein dürfte, musst du die Sau zugeben. Gäbst du aus Angst nur eine kleine Gras-Karte, würde er seinen Spatz außerordentlich billig los — und anschließend spielt wieder Spieler 1 an, der Gegner behält also die angenehme Hinterhandposition. Übernähmst du stattdessen nur mit der Gras-Zehn, um einen Punkt zu retten, könnte das den Partner auf Platz 3 dazu verleiten, einen Schmiertrumpf zu versetzen: er darf annehmen, die Gras-Sau sei vor ihm schon gefallen, vermutet sie beim Solospieler und will den Stich punktreich kassieren — im schlimmsten Fall sticht er mit der Trumpf-Zehn ein und wird vom Spielmacher mit der Trumpf-Sau überstochen. Schmiert Spieler 3 dagegen und muss der Solospieler Gras bedienen, kommst du mit der Gras-Zehn nach: dann ist der Partner hinter ihm sicher grasfrei.",
  },
  {
    id: "b4-5.18-s184",
    regelId: "keine-sau-gegen-hinterhand",
    seite: 184,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt ein Herz-Solo und sitzt in Hinterhand, du bist am Ausspiel. An Trumpf hast du den Schelln-Ober und den Herz-König. Dazu Eichel-Sau und Eichel-Acht, Gras-Zehn und Gras-Sieben sowie Schelln-König und Schelln-Neun.",
    stich: [],
    hand: ["SO", "HK", "EA", "E8", "GX", "G7", "SK", "S9"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["SK"],
    loesungstext: "Den Schelln-König",
    begruendung:
      "Die Eichel-Sau wäre hier ein schwerwiegender, oft spielentscheidender Fehler. Sie bringt zuerst deine Partner in die Klemme: sie müssen raten, wie viele Punkte sie zulegen — die Zehn ist die einzig richtige Karte, wenn der Spieler eichelfrei ist, und ein unverzeihlicher Fehler, wenn nicht. Vor allem aber eröffnet sie dem Spielmacher in Hinterhand alle Optionen: liegen nur elf Punkte im Stich, spatzt er entspannt ab und darf auch im nächsten Stich wieder als Letzter entscheiden; kommen Punkte hinzu, sticht er ungefährdet mit einem Schmiertrumpf ein und hat oft schon die halbe Miete. Der Schelln-König ist die kurze Farbe: er bringt den Alleinspieler in die Mittelhand — die wichtigste Strategie der Verteidigung.",
  },
  {
    id: "b4-5.19-s186",
    regelId: "sau-gegen-hinterhand-ausnahme",
    seite: 186,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt ein Herz-Solo und sitzt wieder in Hinterhand — diesmal bist du aber sehr trumpfstark: Herz-Ober, Eichel-Unter, Herz-Unter, dazu Herz-Zehn und Herz-Sieben. Drei Trumpfstiche für eure Partei sind berechtigt zu erwarten. An Farbe hast du nur Eichel-Sau, Eichel-Acht und die Schelln-Sieben.",
    stich: [],
    hand: ["HO", "EU", "HU", "HX", "H7", "EA", "E8", "S7"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["EA"],
    loesungstext: "Die Eichel-Sau",
    begruendung:
      "Das ist die eine Ausnahme von der Regel, gegen die Hinterhand keine Sau zu spielen. Deine drei Trumpfstiche allein bringen den Sieg — aber nur, wenn die Partner dort schmieren können. Damit ihre Schmierkarten geschont werden, müssen die Punkte wohl oder übel von dir kommen. Die Sau im Anspiel ist zugleich das Zeichen: sie sagt den Partnern, dass du mehrfach stechen wirst und sie jetzt auf keinen Fall die Zehn dazugeben dürfen. Sticht der Spieler deine Sau, ist das unerheblich, solange er nicht die Vollen der Partner bekommt. Erwischst du damit seinen Spatz, spielst du die Eichel-Acht nach — vielleicht ist ein Partner inzwischen eichelfrei und kann einen alleinstehenden Trumpf abwerfen.",
  },
  {
    id: "b4-5.20-s188",
    regelId: "letzten-trumpf-abwerfen",
    seite: 188,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 3,
    lage:
      "Spieler 3 spielt ein Herz-Solo. Dein Partner in Vorhand eröffnet mit der Gras-Sieben — deiner freien Farbe —, Spieler 2 gibt die Gras-Zehn zu, und du freust dich schon auf einen Stich mit deinem einzigen kleinen Trumpf. Doch auch der Spielmacher ist grasfrei und sticht mit dem Schelln-Unter so hoch ein, dass deine Herz-Acht nicht mehr darüber kommt.",
    stich: [{ sitz: 1, card: "G7" }, { sitz: 2, card: "GX" }, { sitz: 3, card: "SU" }],
    hand: ["H8", "EX", "EK", "E8", "E7", "SX", "SK", "S9"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["H8"],
    loesungstext: "Die Herz-Acht",
    begruendung:
      "Der Spielmacher wird jetzt sicher mit Trumpf fortsetzen, und damit ist deine Herz-Acht wertlos geworden — stechen wirst du damit nicht mehr. Schlimmer noch: sie ist hinderlich. Kommt er nicht gerade mit dem Alten heraus, sondern mit einem kleineren Trumpf, kannst du nicht einmal schmieren, weil du erst die Trumpflusche bedienen musst. Also wirf sie gleich jetzt ab. In der zweiten Runde hast du dann alle Optionen: kommt der Alte, gibst du eine leere Farbkarte zu; kommt ein kleiner Trumpf, den deine Partner stechen können, schmierst du einen Vollen. Und weil deine Partner dieses Manöver kennen, dürfen sie daraus ableiten, dass bei dir kein Trumpf mehr steht, und ihr Gegenspiel danach ausrichten.",
  },
  {
    id: "b4-5.21-s190",
    regelId: "erster-partner-gibt-richtung-vor",
    seite: 190,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 1,
    lage:
      "Spieler 1 spielt ein Herz-Solo. Im ersten Stich zog er mit dem Gras-Ober an; Spieler 2 musste seinen einzigen Trumpf zugeben, den Eichel-Unter mit gerade zwei Punkten, du gabst deine kleine Herz-Sieben, und auch Spieler 4 blieb mit dem Herz-König klein. Jetzt zieht der Spielmacher mit dem Herz-Ober nach, und dein trumpffreier Vordermann schmiert die Eichel-Zehn. Wo der Eichel-Ober steht, weißt du nicht.",
    stich: [{ sitz: 1, card: "HO" }, { sitz: 2, card: "EX" }],
    hand: ["SU", "HA", "H8", "EK", "E7", "G9", "SX"],
    frage: "Welchen Trumpf soll ich zugeben?",
    loesung: ["HA"],
    loesungstext: "Die Herz-Sau",
    begruendung:
      "Dein Partner vor dir hat sich entschieden, eine Zehn zuzugeben — also gehst du auf sein Spiel ein und schmierst ebenfalls. Beim Schmieren gilt hopp oder top: entweder bleiben alle klein und setzen darauf, dass der Spieler mit einem kleinen Trumpf ausweichen kann, oder alle schmieren und hoffen auf den dritten Partner. Nichts wäre unglücklicher, als wenn euer Mitstreiter hinter dir den Eichel-Ober hätte und sich entscheiden müsste, entweder die Eichel-Zehn dem Spieler zu überlassen oder seinen Riesentrumpf für nur sechzehn Punkte zu verbrauchen. Geht es schief, war das Spiel vermutlich ohnehin verloren — so hattet ihr wenigstens eine Chance.",
  },
  {
    id: "b4-5.22-s192",
    regelId: "vorstechen",
    seite: 192,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt ein Herz-Solo und sitzt hinter dir. Dein Partner in Vorhand hat die Eichel-Sau angespielt — er hat offensichtlich eine starke Trumpfhand, denn sonst dürfte er niemals eine Sau gegen ein Solo in Hinterhand bringen. Spieler 2 gab den Eichel-König dazu. Du bist eichelfrei; dein einziger Trumpf ist der blanke Eichel-Unter, dazu hältst du eine lange Gras-Flöte.",
    stich: [{ sitz: 1, card: "EA" }, { sitz: 2, card: "EK" }],
    hand: ["EU", "GX", "GK", "G9", "G7", "SX", "S9", "S8"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["EU"],
    loesungstext: "Den Eichel-Unter",
    begruendung:
      "Eine Schmierkarte zuzugeben und zu hoffen, der Spielmacher habe einen Eichel-Spatz, wäre riskant bis töricht. Deutlich vielversprechender ist das Vorstechen mit dem blanken Trumpf. Ist der Spieler ebenfalls eichelfrei, lockst du ihm damit einen Ober heraus, den er für diesen Stich jetzt schon braucht — und der ihm später beim Ziehen eurer Trümpfe fehlt; vielleicht macht dein starker Partner dadurch einen zusätzlichen Trumpfstich. Gleichzeitig machst du dich trumpffrei und kannst ab sofort bei Trumpfstichen der Partner wertvolle Punkte schmieren, statt erst den Unter zugeben zu müssen. Und selbst wenn im ersten Stich schon ein Eichel-Spatz gefallen ist, war das Vorstechen richtig: es holt den Spieler aus der Hinterhand in die Mittelhand, und mit deiner langen Gras-Flöte setzt du ihn sofort unter Druck.",
  },
  {
    id: "b4-5.23-s194",
    regelId: "doppelstich-verhindern",
    seite: 194,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt einen Herz-Wenz und sitzt hinter dir. Spieler 1 hat die Eichel-Sieben angespielt, Spieler 2 die Eichel-Acht zugegeben. Hätte einer deiner Partner die Eichel-Sau, läge sie jetzt auf dem Tisch — die Runde geht also mit einem Farbstich an den Spielmacher. Der könnte neben der Sau aber auch den Eichel-Ober haben, der im Farbwenz eine gewöhnliche Farbkarte zwischen König und Neun ist.",
    stich: [{ sitz: 1, card: "E7" }, { sitz: 2, card: "E8" }],
    hand: ["SU", "H8", "EX", "EK", "E9", "GK", "G8", "SK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["EK"],
    loesungstext: "Den Eichel-König",
    begruendung:
      "Gibst du nur die Eichel-Neun zu, übernimmt dein Hintermann eventuell mit dem Eichel-Ober — und macht später, nachdem er euch die Trümpfe gezogen hat, einen zweiten Eichel-Stich mit der Sau. Genau das verhinderst du, indem du die vier Punkte deines Königs investierst: der Spielmacher muss ihn mit der Sau übernehmen, denn er kann es nicht riskieren, sich mit dem Ober unterzustellen. Er muss ja davon ausgehen, dass du Eichel nachbringen kannst — und verliert seine Sau, wenn Spieler 1 inzwischen eichelfrei ist. Im weiteren Verlauf achtest du darauf, wann der Eichel-Ober fällt: deine Eichel-Zehn hältst du so lange zurück, bis das geschehen ist oder bis du damit stechen kannst.",
  },
  {
    id: "b4-5.24-s196",
    regelId: "sau-fuer-die-zehn-zurueckhalten",
    seite: 196,
    spiel: { type: "wenz" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt einen Wenz. Spieler 1 hat die Gras-Sieben angespielt, der Spielmacher gab den Gras-König, Spieler 3 den Gras-Ober — im Wenz eine gewöhnliche Farbkarte. Drei Gras-Karten liegen damit auf dem Tisch, drei weitere hast du selbst. Wo ist die Gras-Zehn?",
    stich: [{ sitz: 1, card: "G7" }, { sitz: 2, card: "GK" }, { sitz: 3, card: "GO" }],
    hand: ["EA", "E8", "GA", "G9", "G8", "HX", "H7", "SK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["G8"],
    loesungstext: "Die Gras-Acht",
    begruendung:
      "Beim Vordermann liegt die Gras-Zehn sicher nicht, sonst hätte er damit den König des Spielmachers übernommen. Und beim Ausspieler höchstwahrscheinlich auch nicht: er hätte sich durch das Anspielen der Lusche seine Zehn blank gestellt und müsste fürchten, dass die gegnerische Sau sie später herausholt. Also steht sie beim Spielmacher — eine Zehn-König-Kombination als Fehlfarbe ist bei einem Wenzspieler nicht überraschend, denn weil die fehlende Sau höchstens eine der beiden Karten stechen kann, zählen sie zusammen nur als ein Spatz. Als Gegenspieler willst du lieber die Zehn als den König gewinnen. Also stehst du erst einmal unter. Früher oder später muss er die Zehn bringen, oder du fängst sie, indem du die Gras-Sau selbst anspielst — deine Partner sind jetzt schon grasfrei und können kräftig schmieren. Nicht selten gewinnt ein solcher Stich die Partie.",
  },
  {
    id: "b4-5.25-s198",
    regelId: "ober-ziehen",
    seite: 198,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 2,
    spielmacher: 3,
    lage:
      "Spieler 3 spielt ein Herz-Solo und sitzt hinter dir in Mittelhand. Im ersten Stich hat der Ausspieler mit der Eichel-Sau einen Spatz des Solospielers erwischt: du gabst den Eichel-König, der Spielmacher die Eichel-Sieben, Spieler 4 die Eichel-Acht — fünfzehn Punkte für euch. Jetzt bringt Spieler 1 die Eichel-Zehn nach. Von deinen beiden Trümpfen steht der Schelln-Ober blank; Schmierkarten hast du kaum.",
    stich: [{ sitz: 1, card: "EX" }],
    hand: ["SO", "HK", "GX", "GK", "SK", "S9", "S7"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["SO"],
    loesungstext: "Den Schelln-Ober",
    begruendung:
      "Durchlassen kann der Solospieler den Stich nicht: wäre euer Mitstreiter auf Platz 4 eichelfrei und könnte schmieren, hättet ihr knapp vierzig Punkte. Er wird also einstechen — und wenn du nur eine Lusche dazuwirfst, kommt er mit einem Unter aus. Du willst ihm aber einen Ober abluchsen, der ihm später beim Ziehen eurer Trümpfe fehlt. Zwei Wege führen dahin: kräftig schmieren und die Punktzahl auf zwanzig treiben, oder selbst mit dem Schelln-Ober vorstechen. Weil du mit dem Ober nach dem Trumpfziehen ohnehin kaum noch zum Stechen kämst und nur wenige Schmierkarten hältst, ist das Vorstechen die bessere Wahl. Der Spielmacher weiß nicht, ob euer letzter Freund nicht inzwischen eichelfrei ist und schmieren kann — also muss er zwangsläufig überstechen, und auch das kostet ihn einen großen Ober.",
  },
  {
    id: "b4-5.26-s200",
    regelId: "zusaetzlichen-trumpfstich-erarbeiten",
    seite: 200,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 2,
    spielmacher: 3,
    lage:
      "Dieselbe Lage wie im Kapitel davor, nur dein Blatt ist ein anderes: Spieler 3 spielt ein Herz-Solo und sitzt in Mittelhand, im ersten Eichel-Stich habt ihr fünfzehn Punkte gemacht, und Spieler 1 bringt jetzt die Eichel-Zehn nach. Dein Herz-Ober ist diesmal dreifach besetzt: dazu hast du den Eichel-Unter und die Herz-Neun.",
    stich: [{ sitz: 1, card: "EX" }],
    hand: ["HO", "EU", "H9", "GX", "G7", "S9", "S7"],
    frage: "Welche Karte soll ich spielen?",
    loesung: ["GX"],
    loesungstext: "Die Gras-Zehn",
    begruendung:
      "Vorstechen wäre hier ein schlimmer Fehler: unterstellst du dem Spieler die beiden höchsten Ober, machst du mit dem dreifach besetzten Herz-Ober genau einen Trumpfstich, sobald er die Trümpfe zu ziehen beginnt — und den verschenkst du, wenn du jetzt vorstichst und überstochen wirst. Reicherst du den Stich stattdessen mit der Gras-Zehn auf zwanzig Punkte an, ist der Spieler fast gezwungen, einen seiner großen Ober aufzubieten: er muss annehmen, dass sein Hintermann jetzt ebenfalls eichelfrei ist, und weiß nicht, ob der nicht auch noch einen hohen Trumpf hat — diese zwanzig Punkte darf er nicht abgeben. Durch das erzwungene hohe Einstechen kann er anschließend nur noch einmal von oben anziehen, und du machst neben dem Stich mit dem Herz-Ober einen weiteren mit dem Eichel-Unter. Das gleicht die geopferte Zehn mehr als aus.",
  },
  {
    id: "b4-5.27-s202",
    regelId: "auf-mageren-stich-verzichten",
    seite: 202,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 3,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt einen Herz-Wenz und sitzt hinter dir. Spieler 1 hat die Eichel-Sieben angespielt, Spieler 2 die Eichel-Acht zugegeben — die Eichel-Sau liegt also nicht auf dem Tisch und müsste demnach beim Wenzspieler hinter dir stehen. Du bist eichelfrei und trumpfstark: Herz-Unter, Herz-Sau, Herz-Neun und Herz-Sieben. Deine Schelln-Karte steht blank.",
    stich: [{ sitz: 1, card: "E7" }, { sitz: 2, card: "E8" }],
    hand: ["HU", "HA", "H9", "H7", "GX", "GK", "G9", "SK"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["SK"],
    loesungstext: "Den Schelln-König",
    begruendung:
      "Sofort mit einem Schmiertrumpf einzustechen und die Eichel-Sau zu kassieren, wirkt logisch — ist es aber nicht unbedingt. Zum einen könnte der Wenzspieler eine zweite kleine Eichel-Karte haben und ausweichen. Zum anderen wirst du in diesem Spiel ohnehin zweimal auf Trumpf stechen, mit dem Herz-Unter und mit der Herz-Sau, und zwar selbst dann, wenn der Spielmacher die anderen drei Unter hält. Stichst du jetzt vor, machst du nur noch einen weiteren Trumpfstich. Im Moment bekämst du bestenfalls die elf Punkte der Eichel-Sau; wartest du ab, werden es später mit den Beiträgen der Freunde leicht mehr. Also wirfst du — nach einem kurzen, aber vielsagenden Moment des Nachdenkens — deine blanke Schelln-Karte ab, überlässt dem Spielmacher diesen Stich, hältst deine starke Trumpfhand zusammen und bist obendrein eine weitere Farbe frei.",
  },
  {
    id: "b4-5.28-s204",
    regelId: "unscheinbare-karten-nicht-freudlos",
    seite: 204,
    spiel: { type: "wenz" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 4,
    lage:
      "Spieler 4 spielt einen Wenz. Du hast in Vorhand die Herz-Sieben angespielt; Spieler 2 gab die Herz-Zehn, Spieler 3 den Herz-Ober, und der Spielmacher nahm den Stich mit der Herz-Sau. Jetzt zieht er mit dem Eichel-Unter an. Dein Blatt ist trostlos — aber der Herz-König steht womöglich bei Spieler 3, und den darf er nicht abwerfen, solange Herz-Acht und Herz-Neun nicht gefallen sind: nicht selten hat ein Wenzspieler zur Sau noch eine weitere Karte derselben Farbe.",
    stich: [{ sitz: 4, card: "EU" }],
    hand: ["H8", "EK", "E7", "GX", "G7", "SK", "S7"],
    frage: "Welche Karte soll ich zugeben?",
    loesung: ["H8"],
    loesungstext: "Die Herz-Acht",
    begruendung:
      "Auch mit einem trostlosen Blatt lässt sich den Partnern das Leben leichter machen. Muss dein Freund den Herz-König festhalten, kann ihn das in Schwierigkeiten bringen: er wäre womöglich gezwungen, eine andersfarbige Zehn-Lusche- oder König-Lusche-Lusche-Kombination aufzulösen. Wirfst du die Herz-Acht ab, nimmst du ihm diese Sorge. Es ist also nicht ganz unwichtig, seine vermeintlich unscheinbaren Karten nicht freudlos abzuwerfen, sondern mit Bedacht und in der richtigen Reihenfolge. Ein schwaches Blatt bedeutet ohnehin meist, dass ein Partner umso stärker sitzt — Grund genug, konzentriert zu bleiben. Manchmal ist das erklärte Ziel nur, aus dem Schneider zu kommen; gelingt das durch durchdachtes Spiel, ist es moralisch so wertvoll wie ein Sieg.",
  },
  {
    id: "b4-5.29-s206",
    regelId: "farbe-nachspielen-vor-dem-spielmacher",
    seite: 206,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 spielt einen Herz-Wenz und sitzt direkt hinter dir — kurzer Weg. „Kurzer Weg – lange Farbe“ hilft dir hier aber nicht weiter: von jeder Farbe hast du genau zwei Karten. Dafür hältst du mit dem Eichel-Unter den höchsten Trumpf und wirst deshalb bald wieder ans Ausspiel kommen.",
    stich: [],
    hand: ["EU", "HX", "EK", "E9", "GX", "G9", "SK", "S8"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["G9"],
    loesungstext: "Die Gras-Neun",
    begruendung:
      "Bring eine Farbe, von der du auch die Zehn hast — hier Gras —, und zwar zuerst die Lusche. Übernimmt der Wenzspieler mit der Gras-Sau oder sticht er ein, wird er voraussichtlich mit Trumpf fortsetzen; mit dem Eichel-Unter kommst du schnell wieder ans Ausspiel und bringst dann die Gras-Zehn nach. Jetzt steckt er in der Klemme: er weiß weder, wie viele Gras-Karten du hast, noch ob deine Mitspieler hinter ihm die Farbe schon frei sind. Sticht er hoch ein, sichert er sich zwar die Zehn, kann dafür aber einmal weniger anziehen; sticht er klein ein, riskiert er, überstochen zu werden — und hat er nicht beide Schmiertrümpfe selbst, wird das teuer. Wärst du mit Eichel oder Schelln herausgekommen, hättest du nach deinem Eichel-Unter-Stich kein Nachspiel, das ihn auch nur ansatzweise so unter Druck setzt.",
  },
  {
    id: "b4-5.30-s208",
    regelId: "nach-spritze-punkte-schonen",
    seite: 208,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 1,
    spielmacher: 2,
    lage:
      "Spieler 2 hat ein Herz-Solo angesagt — und Spieler 3 hat gespritzt. Damit übernimmt er die Führungsrolle für euer Gegenspiel und stellt ein bis zwei Trumpfstiche mehr in Aussicht, als der Solospieler eingeplant haben dürfte. Du bist in Vorhand und hast keinen Trumpf: vier Eichel-Karten mit Sau und Zehn, drei Gras-Luschen und die einzeln stehende Schelln-Neun.",
    stich: [],
    hand: ["EA", "EX", "E8", "E7", "G9", "G8", "G7", "S9"],
    frage: "Welche Karte soll ich ausspielen?",
    loesung: ["S9"],
    loesungstext: "Die Schelln-Neun",
    begruendung:
      "Ohne die Spritze würdest du mit deiner langen Eichel-Farbe beginnen. So aber nicht: Eichel-Sau und Eichel-Zehn sind deine einzigen Schmierkarten, und die darfst du nach der Spritze auf keinen Fall mehr riskieren — sie gehören auf die Trumpfstiche deines Partners. Auch eine kleine Eichel-Karte hilft nicht: wirft der Solospieler darauf seinen Spatz ab und stehen König und Neun verteilt bei deinen Freunden, kommen nur vier Punkte zusammen und die Spritze geht nach hinten los. Und eine Gras-Lusche würde deinen Partnern zwangsläufig wertvolle Schmierkarten entreißen, denn sie können ja nur punktreiche Gras-Karten haben. Eine Spritze relativiert damit sogar „Kurzer Weg – lange Farbe“: Vorrang hat das Schonen der Schmierkarten.",
  },
  {
    id: "b4-5.31-s210",
    regelId: "wenz-tout-sau-abwerfen",
    seite: 210,
    spiel: { type: "wenz" },
    label: "Wenz-Tout",
    rolle: "Gegenspieler",
    ich: 2,
    spielmacher: 1,
    hinweis:
      "Die Engine kennt kein Tout; als Spielart ist deshalb der Wenz eingetragen, der die Karten genauso ordnet.",
    lage:
      "Spieler 1 hat einen Wenz-Tout angesagt und zieht mit dem Eichel-Unter an. Du bist trumpffrei und musst abwerfen. In Eichel hast du Zehn und Sieben, in Herz eine König-Dreierkombination, in Schelln Sau, Ober und Acht.",
    stich: [{ sitz: 1, card: "EU" }],
    hand: ["EX", "E7", "HK", "H8", "H7", "SA", "SO", "S8"],
    frage: "Welche Karte soll ich abwerfen?",
    loesung: ["SA"],
    loesungstext: "Die Schelln-Sau",
    begruendung:
      "Weil dir die Schelln-Sau gehört, kann der Toutspieler in dieser Farbe keinen Spatz haben — und genau das willst du deinen Partnern anzeigen. Wirfst du die Sau früh weg, dürfen sie Schelln ebenfalls bedenkenlos abwerfen und dafür etwa eine andersfarbige König-Lusche-Lusche-Kombination zusammenhalten. Auf die nächsten Karten des Spielmachers, bei denen du nicht dem Farbzwang unterliegst, gibst du zunächst deine weiteren Schelln-Karten zu und löst gegebenenfalls danach die Zehn-Lusche-Kombination in Eichel auf. Die König-Dreierkombination in Herz ist deine vermeintlich stärkste Waffe — die behältst du so lange wie möglich.",
  },
  {
    id: "b4-5.32-s212",
    regelId: "hohen-trumpf-rasch-abwerfen",
    seite: 212,
    spiel: { type: "farbwenz", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 1,
    lage:
      "Spieler 1 spielt einen Herz-Wenz und hat mit dem Gras-Unter angezogen. Spieler 2 gab den Herz-König, Spieler 3 die Herz-Acht — keiner deiner Partner hat also gestochen, weshalb der Spielmacher mit hoher Wahrscheinlichkeit auch den Eichel-Unter hält und ein zweites Mal anziehen wird. Deine beiden Trümpfe sind der Schelln-Unter und die Herz-Sieben; beide sind verloren, in welcher Reihenfolge du sie hergibst, ist für dich einerlei.",
    stich: [{ sitz: 1, card: "GU" }, { sitz: 2, card: "HK" }, { sitz: 3, card: "H8" }],
    hand: ["SU", "H7", "EX", "E9", "E8", "GX", "GK", "S7"],
    frage: "Welchen Trumpf soll ich zugeben?",
    loesung: ["SU"],
    loesungstext: "Den Schelln-Unter",
    begruendung:
      "Intuitiv käme die Herz-Sieben als der kleinere der beiden Trümpfe. Für deine vor dir sitzenden Partner ist der Schelln-Unter aber die deutlich bessere Wahl. Hat einer von ihnen noch Herz-Unter und Herz-Sau, müsste er auf den Eichel-Unter des Wenzspielers seine Sau zugeben, um mit dem Unter später einen sicheren Stich zu machen — denn solange der Schelln-Unter nicht gefallen ist, muss er ihn beim Spielmacher vermuten. Wirfst du ihn dagegen jetzt ab, kann er im zweiten Anspiel ruhigen Gewissens seinen Herz-Unter abwerfen und behält mit der Herz-Sau den höchsten Trumpf: ihr stecht dann nicht mit einem Unter, sondern mit der Sau und bekommt neun Punkte mehr. Steht der Eichel-Unter doch bei einem Partner, hast du zwei Punkte verschenkt — die entscheiden nur selten über Gewinn und Verlust.",
  },
  {
    id: "b4-5.33-s214",
    regelId: "nicht-von-intuition-verleiten-lassen",
    seite: 214,
    spiel: { type: "solo", suit: "H" },
    rolle: "Gegenspieler",
    ich: 4,
    spielmacher: 3,
    lage:
      "Spieler 3 spielt ein Herz-Solo. Der erste Eichel-Stich ging mit 21 Punkten an eure Partei. Jetzt bringt Spieler 1 den Eichel-König nach, Spieler 2 schmiert die Schelln-Zehn, und der Solospieler sticht mit dem Herz-Ober ein — siebzehn Punkte liegen im Stich. Mit dem Eichel-Ober könntest du übernehmen; deine anderen beiden Trümpfe sind der Eichel-Unter und der Herz-König.",
    stich: [{ sitz: 1, card: "EK" }, { sitz: 2, card: "SX" }, { sitz: 3, card: "HO" }],
    hand: ["EO", "EU", "HK", "GX", "G7", "SK", "S9"],
    frage: "Welche Karte soll ich spielen?",
    loesung: ["S9"],
    loesungstext: "Die Schelln-Neun",
    begruendung:
      "So verlockend die zwanzig Punkte aussehen — das Überstechen mit dem Alten verschenkt einen kompletten Trumpfstich. Ist er gefallen, zieht dir der Spieler womöglich mit Gras- und Schelln-Ober die beiden verbliebenen Trümpfe, und es bleibt bei diesem einen Stich; hat er dann keine Fehlkarte mehr, verhungert ihr bei 41 Punkten. Vergeudest du in dieser Runde dagegen keinen Trumpf, kannst du dem gegnerischen Gras-Ober mit dem Herz-König ausweichen und stichst danach sicher zweimal. Das sollte weit mehr einbringen als die geopferten siebzehn Punkte: beide Schmiertrümpfe und drei weitere Schmierkarten in Gras und Schelln sind noch im Spiel, und einige davon liegen bei deinen Partnern.",
  },
];

export const regelById = (id) => REGELN.find((r) => r.id === id) || null;
