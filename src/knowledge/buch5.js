/* ============================================================
   BUCH 5, KAPITEL 6.1–6.11 (Seiten 218–228)
   Informelle Techniken — alles, was neben den Karten passiert:
   abheben, aufnehmen, aufstecken, ansagen, zögern, mitzählen.

   Dieses Kapitel ist anders gebaut als die vorigen: es zeigt keine
   Blätter, sondern besteht aus je einer Textseite mit Merksatz.
   `STELLUNGEN` bleibt deshalb leer — die Merksätze stehen trotzdem
   in der Regelsuche der App.

   Das Buch merkt in 6.3 selbst an, dass die sauber sortierten
   Blätter seiner Beispielaufgaben zeigen, wie man es *nicht* machen
   sollte. Für uns sind sie trotzdem die Vorlage: `hand` bildet ab,
   was abgedruckt ist.
   ============================================================ */

export const REGELN = [
  {
    id: "abheben",
    kapitel: "6.1",
    seite: 218,
    titel: "Das Abheben der Karten",
    kurz: "Ich variiere die Anzahl der abgehobenen Karten und gebe Acht, dass die abgehobenen Karten unten in den Stapel kommen.",
    lang:
      "Speziell bei Turnieren mit hohen Preisgeldern soll es vorkommen, dass sich jemand schon beim Abheben einen Vorteil verschafft. Der Trick: Nach dem Mischen wirft der Geber unauffällig einen Blick auf die unterste Karte. Gefällt sie ihm, sorgt er dafür, dass sie auch nach dem Abheben unten bleibt — legt der Hintermann sein abgehobenes Päckchen unaufmerksam neben den Rest, nimmt der Betrüger es einfach und legt es wieder auf den unteren Stapel; das Abheben ist damit rückgängig gemacht. Dagegen hilft: das eigene Päckchen so lange in der Hand behalten, bis der Geber den unteren Stapel aufgenommen hat. Manche Turniere lassen deshalb gar nicht abheben, sondern nachmischen — der Hintermann mischt den fertigen Stapel ein zweites Mal. Auch unter Freunden schadet es nicht, jedes Mal an einer anderen Stelle abzuheben; die Regeln erlauben bis zu dreimaliges Abheben.",
  },
  {
    id: "aufnehmen",
    kapitel: "6.2",
    seite: 219,
    titel: "Das Aufnehmen der Karten",
    kurz: "Ich nehme alle acht Karten auf einmal auf und gebe weder durch Bemerkungen noch durch Körpersprache Hinweise auf meine Stärken und Schwächen.",
    lang:
      "Gerade beim Aufnehmen verraten viele Spieler mehr über ihr Blatt, als ihnen bewusst ist. Sind die ersten vier Karten gut und zu einem Alleinspiel ausbaufähig, werden die nächsten vier einzeln aufgenommen — und der Gesichtsausdruck sagt für jede, ob sie passt. Kommt es zum Alleinspiel, kennt jeder aufmerksame Mitspieler die Zahl der Schwachpunkte. Ähnlich leicht zu lesen ist, wer seine Karten nicht auffächert, sondern enttäuscht zusammenschiebt: sie sind offensichtlich grausam anzusehen. Bei guten Blättern richtet sich der Oberkörper auf oder es folgt ein entspanntes Zurücklehnen, nicht selten mit einem breiten Grinsen. Ein praktikabler Gegenentwurf: die ersten Karten zunächst auf dem Tisch liegen lassen, die Zeit zum Beobachten der anderen nutzen und dann alle acht auf einmal aufnehmen — zu einem Zeitpunkt, an dem alle in ihre Karten vertieft sind.",
  },
  {
    id: "aufstecken",
    kapitel: "6.3",
    seite: 220,
    titel: "Das Aufstecken der Karten",
    kurz: "Ich vermeide so weit wie möglich das Sortieren der Karten von links nach rechts und variiere immer wieder die Art und Weise, wie ich meine Karten aufstecke.",
    lang:
      "Wer sein Blatt sauber von links nach rechts ordnet — höchster Trumpf ganz links, dann absteigend, danach die Farben —, hat perfekten Überblick, und leider nicht nur für sich selbst. Zieht ein Alleinspieler die zweite Karte von links und spielt den Gras-Ober, sitzt der Alte bestimmt bei ihm; kommt der Blaue von ganz links, ist niemand überrascht, wenn ein Gegner mit dem Eichel-Ober übersticht. Der Rat der Profis lautet, gar nicht zu sortieren, doch mit unsortierten Karten den Überblick zu behalten gelingt nicht jedem. Praktikabler: so wenig wie möglich sortieren und vor allem nicht immer gleich — die Trümpfe in die Mitte, ein bis zwei Farben nach links, den Rest nach rechts, und innerhalb der Gruppen das eine Mal von links nach rechts, das andere Mal umgekehrt. Braucht ein Mitspieler länger zum Nachdenken, lässt sich die Zeit nutzen, um auch während des Spiels einmal umzustecken.",
  },
  {
    id: "ansage-tempo",
    kapitel: "6.4",
    seite: 221,
    titel: "Die Ansage des Spiels",
    kurz: "Ich kontrolliere bewusst das Tempo meiner Spielansage und verhindere damit Rückschlüsse auf die Qualität meiner Karten.",
    lang:
      "Hier geht es nicht um das „was“ der Ansage, sondern um das „wie“. Ein allzu schnelles „Weiter“, noch dazu mit verdrossenem Gesicht, verrät die Schwäche des Blattes — und womöglich fällt die eine oder andere Entscheidung der Gegner daraufhin anders aus. Nicht besser ist es, bei einem starken Sauspiel schnell und siegesbewusst „Ich spiele“ zu rufen: wachsame Gegner stellen ihre Taktik um und spielen statt auf Sieg auf Schneiderfrei — und kommen so aus dem Schneider, was ihnen ohne die Andeutung vielleicht nicht geglückt wäre. Im Idealfall sage ich also immer etwa gleich schnell an, unabhängig von meinen Emotionen. Fortgeschrittene machen aus dem Minus ein Plus: mit einem Blatt zum Grausen „überlege“ ich gelegentlich länger, bevor ich wie geplant weitersage — das kann einem Mitspieler sein Herz-Solo verleiden. Mit einem starken Blatt warte ich nachdenklich, bis ich doch „Ich spiele“ sage; vielleicht lässt sich jemand zu einer Spritze hinreißen.",
  },
  {
    id: "spritze-zeitpunkt",
    kapitel: "6.5",
    seite: 222,
    titel: "Das Geben einer Spritze",
    kurz: "Ich überlege genau, zu welchem Zeitpunkt ich eine Spritze gebe: bevor die erste Karte ausgespielt wird oder erst danach.",
    lang:
      "Eine weit verbreitete Regel erlaubt Spritzen und Retour-Spritzen, solange die zweite Karte noch nicht auf dem Tisch liegt. Bin ich nicht der Ausspieler, kann ich also wählen — und das ist keineswegs gleichgültig. Eine Spritze bedeutet einen Rollentausch: für den Spielmacher ist es danach oft günstiger, sich wie ein Nichtspieler zu verhalten und Farben statt Trümpfe zu spielen, und umgekehrt. Ist der Spielmacher in Vorhand am Ausspiel und ich bin trumpfstark, warte ich, bis er einen Trumpf gebracht hat, und spritze erst danach; bin ich dagegen eine oder zwei Farben frei und hätte lieber eine Farbe gesehen, gebe ich sofort. Auch bei einem Sauspiel lässt sich steuern: der Partner sucht ohnehin zuerst die Rufsau, der Freund des Spielmachers beginnt ohne Spritze meist mit Trumpf, nach einer Spritze mit einer Farbe. Will ich einen Alleinspieler in Mittel- oder Hinterhand spritzen, ist dagegen Eile geboten — die schnelle Spritze soll verhindern, dass der ausspielende Partner leichtfertig eine kostbare Schmierkarte riskiert.",
  },
  {
    id: "zugeben-tempo",
    kapitel: "6.6",
    seite: 223,
    titel: "Das Zugeben von Karten",
    kurz: "Ich gebe alle Karten mit etwa gleicher Verzögerung zu und ermögliche keine Rückschlüsse auf die Zusammensetzung meines Blattes.",
    lang:
      "Je länger jemand beim Zugeben zaudert, desto offensichtlicher hat er mehrere Karten zur Auswahl; wer allzu schnell abwirft, verrät, dass die Karte blank steht — und verstärkt das noch, wenn er eine einzeln stehende Karte vorzieht. Beides schenkt dem Gegner Informationen. Abhilfe: das Zugeben einer alternativlosen Karte bewusst etwas verlangsamen und bei mehreren Optionen nicht erst zu überlegen beginnen, wenn man an der Reihe ist, sondern vorher schon die Varianten durchdenken und dann schnell reagieren. Wird beides Routine, gleichen sich die Reaktionszeiten aus und verlieren ihren verräterischen Charakter. Aus der Not lässt sich sogar eine Tugend machen: ein kurzes „Nachdenken“ vor dem Zugeben sagt dem Partner, dass ich mehrere Karten dieser Farbe habe. Und zum Lügen taugt es auch — eine einzeln stehende Karte etwas zögerlich zugeben, zwei gleichfarbige Spatzen dagegen sehr schnell, damit der Spatz wie ein Einzelkind wirkt. Übertreiben sollte man diese Spielchen nicht, sonst werden sie wirkungslos.",
  },
  {
    id: "stich-andeuten",
    kapitel: "6.7",
    seite: 224,
    titel: "Das Andeuten eines Stichs",
    kurz: "Ich verzögere die Zugabe einer kleinen Karte, wenn ich meinen Mitspielern andeuten möchte, dass ich die vorliegende Karte auch stechen könnte.",
    lang:
      "Ein wichtiger Spezialfall des verzögerten Zugebens: Der Alleinspieler sitzt in Vorhand, ich als sein stärkster Gegenspieler in Rückhand, und er eröffnet mit einem relativ hohen, aber nicht dem höchsten Trumpf. Für die Partner in Mittelhand stellt sich die Frage, ob sie schmieren oder klein bleiben sollen — gewöhnlich bleiben sie klein und warten ab. Habe ich als Letzter tatsächlich die Wahl zwischen Stechen und Ausweichen, werde ich wegen der geringen Punktezahl zunächst auch nur unterstehen. Aber ich werfe meine kleine Karte nicht sofort dazu, sondern mache eine künstlerische Pause. Das kurze, vielleicht etwas übertriebene Zögern deutet an, dass ich mehrere Karten zur Auswahl hatte — und die Freunde werden bei der nächsten vergleichbaren Gelegenheit Punkte zugeben.",
  },
  {
    id: "mitzaehlen",
    kapitel: "6.8",
    seite: 225,
    titel: "Das Mitzählen der Punkte",
    kurz: "Ich kann mich um so einfacher entscheiden, welche Karte ich als nächste spielen soll, je mehr ich vom bisherigen Spielverlauf im Kopf behalte.",
    lang:
      "Mitzählen ist einer der drei Grundpfeiler fortgeschrittenen Schafkopfens. Optimal wäre, sämtliche Fakten zu kennen: die Punkte beider Parteien, Zahl und Wertigkeit der gefallenen Trümpfe, die gefallenen und verbliebenen Farbkarten. Wir sind aber keine Computer — es kommt darauf an, sich die richtigen Dinge zu merken, ohne sich zu überfordern. Anfänger merken sich zuerst die Ober und die angespielten Farben, erweitern das Feld dann um Trumpf-Sau und Trumpf-Zehn, nehmen die Unter dazu und zählen erst danach die Punkte mit. Beim Sauspiel zählt man die eigenen Punkte, bei einem Alleinspiel die der drei Gegenspieler — gleich, ob man selbst Spielmacher oder Verteidiger ist. Vieles ist leichter, als es scheint: bestimmte Kartenbilder tauchen immer wieder auf, sticht eine Sau die Zehn und fällt der König dazu, sieht man ohne zu rechnen 25 Punkte. Vorsicht dagegen beim Umdrehen eines verdeckten Stichs — das ist streng genommen nicht erlaubt und gibt den Gegnern das Gefühl, ich sähe mein Spiel auf der Kippe.",
  },
  {
    id: "eigenheiten-der-mitspieler",
    kapitel: "6.9",
    seite: 226,
    titel: "Die Eigenheiten der Mitspieler",
    kurz: "Ich gehe auf die Charakterzüge meiner Mitspieler ein und berücksichtige sie in meinem Handeln.",
    lang:
      "Schafkopf spielt man mit Menschen, und Menschen zeigen Verhaltensmuster, die sie auch beim Kartenspielen nicht ablegen können. Wer lange mit denselben Freunden spielt, kennt seine Pappenheimer: den Hasardeur, der auch mit drei Spatzen einen Wenz wagt; die Vorsichtige, gegen deren Solo das Ziel nur Schneiderfrei lauten kann; den Pokerspieler, der nie sortiert, aber eine Lieblingssau hat, mit der er immer spielt, sobald er eine Karte dieser Farbe hält; den Unberechenbaren, dessen Sauspiel nichts über seine Trumpfzahl sagt; die Spielfreudige, mit der selten zusammengeworfen wird. Diese Eigenschaften machen ihre Besitzer liebenswert, aber auch ein Stück kalkulierbar, und es ist nicht verboten, das in die eigenen Überlegungen einzubeziehen. Dazu gehört auch die Erfahrung: spielt ein Anfänger ungewöhnlich, macht er vermutlich gerade einen Fehler; im Turnier unterstelle ich in derselben Lage, dass mein Gegenüber weiß, was es tut, und gehe auf seine Taktik ein.",
  },
  {
    id: "turnier-besonderheiten",
    kapitel: "6.10",
    seite: 227,
    titel: "Die Besonderheiten beim Schafkopfturnier",
    kurz: "Ich muss mir auch als Turnier-Neuling oder weniger geübter Spieler unanständiges Verhalten von alten Hasen nicht gefallen lassen.",
    lang:
      "Beim Preis-Schafkopf wird im Prinzip gespielt wie am Stammtisch, doch das Regelwerk kennt Besonderheiten, die dem Unterschleif entgegenwirken: ausgeteilt wird nicht zweimal vier, sondern viermal zwei Karten, gelegentlich muss nachgemischt statt abgehoben werden, und einen Tout — mitunter schon ab dem vierten Solo — muss man sich vorab von einer Aufsichtsperson genehmigen lassen. Wer trotzdem das Gefühl hat, an seinem Tisch laufe etwas nicht korrekt, etwa weil ein Geber auffallend oft drei Laufende hat oder zwei Spezis augenfällig zusammenarbeiten, sollte seine Bedenken offen äußern und nötigenfalls die Aufsicht rufen. Und es gibt juristisch korrektes, aber flegelhaftes Verhalten, das man sich nicht bieten lassen muss: den routinierten Schnellspieler, der Anfängern sein Missfallen zeigt, wenn sie in seinen Augen zu lange überlegen, oder den Grantler, der nach jeder Runde die Fehler der Partner breittritt. Es ist weder unhöflich noch unangebracht, sich das vehement zu verbitten.",
  },
  {
    id: "glaube-an-den-erfolg",
    kapitel: "6.11",
    seite: 228,
    titel: "Der Glaube an den Erfolg",
    kurz: "Ich glaube an meinen Erfolg!",
    lang:
      "Wer aufgibt, hat schon verloren — und zwar nicht nur als Spielmacher, sondern besonders als Gegenspieler. Habe ich selbst schlechte Karten, hoffe ich auf den Partner: je weniger Trümpfe bei mir stehen, desto mehr müssen zwangsläufig bei ihm liegen; kann ich nicht stechen, kann ich womöglich schmieren. Zeigt sich, dass auch er schwach ist, senke ich das Ziel — erst Schneiderfrei, dann wenigstens ein Stich, um nicht Schwarz zu werden. Mit aussichtslosen Karten aus dem Schneider zu kommen ist ein moralischer Sieg. Grundsätzlich stelle ich mir das Blatt des Partners so stark vor, wie es für eine reelle Gewinnchance nötig wäre; so bleibt in jeder Lage ein theoretischer Gewinnweg und damit ein Hoffnungsschimmer. Jede Strategie ist besser als keine. Der eigentliche Gewinn ist dabei nicht der gelegentliche Sieg, sondern die dauerhafte Aufmerksamkeit: das flexible Entwerfen und Anpassen von Gewinnstrategien und das Hochhalten der Konzentration. Auch Gegenspieler sind nur Menschen und machen Fehler — bieten sie eine unerwartete Chance, will ich bereit sein.",
  },
];

export const STELLUNGEN = [];

export const regelById = (id) => REGELN.find((r) => r.id === id) || null;
