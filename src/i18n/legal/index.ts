import type { Locale } from "../config";
import type { LegalDocs } from "./types";
import { en } from "./en"; import { bn } from "./bn"; import { es } from "./es"; import { zh } from "./zh"; import { ja } from "./ja";
import { ko } from "./ko"; import { hi } from "./hi"; import { ar } from "./ar"; import { fr } from "./fr"; import { pt } from "./pt";

export type { LegalDocs } from "./types";
export const legalDocs: Record<Locale, LegalDocs> = { en, bn, es, zh, ja, ko, hi, ar, fr, pt };
