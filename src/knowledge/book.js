/* ============================================================
   BUCHWISSEN — hier wird dein Buch angehängt.

   Pro Prinzip-id kommt ein Eintrag hinein:
     kapitel   wo es im Buch steht
     seite     Seitenzahl (für dich zum Nachschlagen)
     kern      der Gedanke in eigenen Worten, 1–3 Sätze
     merksatz  eine kurze Zeile, die im Spiel eingeblendet wird
     uebung    optional: Situationen, die das Buch dazu zeigt

   Die Texte sind bewusst Zusammenfassungen in eigenen Worten und
   keine Abschriften. Wenn die App später öffentlich läuft, bleibt
   sie damit auf der sicheren Seite.

   Solange hier nichts steht, zeigt die App nur die eigenen
   Prinzipien aus principles.js.
   ============================================================ */

export const BOOK = {
  titel: "",
  autor: "",
  eintraege: {
    // "schmieren-an-gegner": {
    //   kapitel: "",
    //   seite: 0,
    //   kern: "",
    //   merksatz: "",
    //   uebung: [],
    // },
  },
};

/** zusätzliche Übungsstellungen aus dem Buch, später aus der Analyse gefüllt */
export const BOOK_DRILLS = [];

export const bookFor = (id) => BOOK.eintraege[id] || null;
export const hasBook = () => Object.keys(BOOK.eintraege).length > 0;
