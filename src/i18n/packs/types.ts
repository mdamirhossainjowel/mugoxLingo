import type { DeepPartial } from "../merge";
import type { Dictionary } from "../dictionaries";
import type { Ui } from "../ui";
import type { AuthUi } from "../authUi";
import type { LearnUi } from "../learnUi";
import type { SiteUi } from "../siteUi";

/** A translation pack. Anything left out falls back to English. */
export interface LocalePack { dict?: DeepPartial<Dictionary>; ui?: DeepPartial<Ui>; auth?: DeepPartial<AuthUi>; learn?: DeepPartial<LearnUi>; site?: DeepPartial<SiteUi> }
