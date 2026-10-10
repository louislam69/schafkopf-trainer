/* ============================================================
   ALLE EINGEARBEITETEN BUCHTEILE AN EINER STELLE

   Wer Merksätze oder Stellungen braucht, holt sie hier — nicht
   direkt aus buch1.js bis buch5.js. Ein weiteres Kapitel
   wird angelegt, importiert und angehängt; UI und Tests ändern sich
   dafür nicht.
   ============================================================ */

import { REGELN as R1, STELLUNGEN as S1 } from "./buch1.js";
import { REGELN as R2, STELLUNGEN as S2 } from "./buch2.js";
import { REGELN as R3, STELLUNGEN as S3 } from "./buch3.js";
import { REGELN as R4, STELLUNGEN as S4 } from "./buch4.js";
import { REGELN as R5, STELLUNGEN as S5 } from "./buch5.js";

export const REGELN = [...R1, ...R2, ...R3, ...R4, ...R5];
export const STELLUNGEN = [...S1, ...S2, ...S3, ...S4, ...S5];

export const regelById = (id) => REGELN.find((r) => r.id === id) || null;
