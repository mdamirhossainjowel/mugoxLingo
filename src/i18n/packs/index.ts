import type { Locale } from "../config";
import type { LocalePack } from "./types";
import { ar } from "./ar";
import { es } from "./es";
import { fr } from "./fr";
import { hi } from "./hi";
import { ja } from "./ja";
import { ko } from "./ko";
import { pt } from "./pt";
import { zh } from "./zh";

export type { LocalePack } from "./types";
/** Languages with a translation pack. English and Bengali are written in full in the string files. */
export const packs: Partial<Record<Locale, LocalePack>> = { es, zh, ja, ko, hi, ar, fr, pt };
