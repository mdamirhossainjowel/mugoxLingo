import type { Lesson, Unit } from "@/types/course";
import { bnPrompts, soundPrompts, vocabLesson } from "./generate";

const tk = (a: string, b: string, kind?: string) => `{${a}|${b}${kind ? `|${kind}` : ""}}`;
const t = (h: string, p: string) => tk(h, p);
const j = (h: string, r: string) => tk(h, r, "ja");
const k = (h: string, r: string) => tk(h, r, "ko");

/* ---------- Spanish ---------- */
export const esMoreUnits: Unit[] = [{
  id: "es-u7", title: "Verbs and time",
  lessons: [
    vocabLesson({ id: "es-verbs-1", title: "Everyday verbs", objective: "Say what you eat, drink, speak and want.",
      vocab: [{ term: "Como", meaning: "I eat" }, { term: "Bebo", meaning: "I drink" }, { term: "Hablo", meaning: "I speak" }, { term: "Vivo", meaning: "I live" }, { term: "Quiero", meaning: "I want" }],
      extra: [
        { type: "fill", prompt: "I speak Spanish", before: "", after: "español.", choices: ["hablo", "como", "bebo"], answer: 0, explain: "Spanish verbs change their ending for each person. -o is the ending for “I”." },
        { type: "build", prompt: "Translate: I live in the city", tiles: ["Vivo", "en", "la", "ciudad", "como", "casa"], answer: ["Vivo", "en", "la", "ciudad"] },
      ] }),
    vocabLesson({ id: "es-time-1", title: "Today, tomorrow, yesterday", objective: "Talk about days and the weekend.",
      vocab: [{ term: "Hoy", meaning: "Today" }, { term: "Mañana", meaning: "Tomorrow" }, { term: "Ayer", meaning: "Yesterday" }, { term: "Sábado", meaning: "Saturday" }, { term: "Domingo", meaning: "Sunday" }],
      extra: [
        { type: "mcq", prompt: "“Mañana” can also mean…", choices: ["Morning", "Night", "Week", "Year"], answer: 0, explain: "“La mañana” is the morning, and “mañana” alone usually means tomorrow." },
        { type: "fill", prompt: "Tomorrow is Saturday", before: "", after: "es sábado.", choices: ["mañana", "ayer", "domingo"], answer: 0 },
      ] }),
  ],
}];

/* ---------- Chinese ---------- */
export const zhMoreUnits: Unit[] = [{
  id: "zh-u6", title: "Verbs and colors",
  lessons: [
    vocabLesson({ id: "zh-verbs-1", title: "Basic verbs", objective: "Say eat, drink, go, come and look.", lang: "zh-CN",
      vocab: [{ term: t("吃", "chī"), meaning: "To eat" }, { term: t("喝", "hē"), meaning: "To drink" }, { term: t("去", "qù"), meaning: "To go" }, { term: t("来", "lái"), meaning: "To come" }, { term: t("看", "kàn"), meaning: "To look, to watch" }],
      extra: [
        { type: "fill", prompt: "I go to China", before: t("我", "wǒ"), after: t("中国", "Zhōngguó"), choices: [t("去", "qù"), t("吃", "chī"), t("喝", "hē")], answer: 0, explain: "Chinese verbs never change their form: 去 is “go” for everyone and every time." },
        { type: "build", prompt: "Translate: I want to eat rice", tiles: [t("我", "wǒ"), t("想", "xiǎng"), t("吃", "chī"), t("米饭", "mǐfàn"), t("喝", "hē")], answer: [t("我", "wǒ"), t("想", "xiǎng"), t("吃", "chī"), t("米饭", "mǐfàn")] },
      ] }),
    vocabLesson({ id: "zh-colors-1", title: "Colors", objective: "Name the basic colors.", lang: "zh-CN",
      vocab: [{ term: t("红色", "hóngsè"), meaning: "Red" }, { term: t("蓝色", "lánsè"), meaning: "Blue" }, { term: t("绿色", "lǜsè"), meaning: "Green" }, { term: t("黄色", "huángsè"), meaning: "Yellow" }, { term: t("黑色", "hēisè"), meaning: "Black" }],
      extra: [
        { type: "mcq", prompt: "Which color is lucky in Chinese culture and used at weddings and New Year?", choices: [t("红色", "hóngsè"), t("黑色", "hēisè"), t("蓝色", "lánsè"), t("绿色", "lǜsè")], answer: 0, explain: "Red stands for luck and joy. People give red envelopes (红包, hóngbāo) at New Year." },
        { type: "fill", prompt: "Black", before: t("黑", "hēi"), after: "", choices: [t("色", "sè"), t("好", "hǎo"), t("水", "shuǐ")], answer: 0, explain: "色 (sè) means color. Color words are often a color plus 色." },
      ] }),
  ],
}];

/* ---------- Japanese ---------- */
export const jaMoreLessons: Record<string, Lesson[]> = {
  "ja-u1": [
    vocabLesson({ id: "ja-hiragana-3", title: "The S row", objective: "Read さ し す せ そ and words that use them.", prompts: soundPrompts, lang: "ja-JP",
      vocab: [{ term: "さ", meaning: "sa" }, { term: "し", meaning: "shi" }, { term: "す", meaning: "su" }, { term: "せ", meaning: "se" }, { term: "そ", meaning: "so" }],
      extra: [
        { type: "mcq", prompt: `What does “${j("しお", "shio")}” mean?`, choices: ["Salt", "Cow", "Leg", "Moon"], answer: 0, explain: "し is read “shi”, not “si”." },
        { type: "mcq", prompt: `What does “${j("うし", "ushi")}” mean?`, choices: ["Cow", "Salt", "Leg", "Moon"], answer: 0 },
      ] }),
    vocabLesson({ id: "ja-hiragana-4", title: "The T row", objective: "Read た ち つ て と and words that use them.", prompts: soundPrompts, lang: "ja-JP",
      vocab: [{ term: "た", meaning: "ta" }, { term: "ち", meaning: "chi" }, { term: "つ", meaning: "tsu" }, { term: "て", meaning: "te" }, { term: "と", meaning: "to" }],
      extra: [
        { type: "mcq", prompt: `What does “${j("つき", "tsuki")}” mean?`, choices: ["Moon", "Hand", "Octopus", "Salt"], answer: 0, explain: "つ is read “tsu”, and ち is read “chi”. These two are the T row’s surprises." },
        { type: "mcq", prompt: `What does “${j("て", "te")}” mean?`, choices: ["Hand", "Moon", "Octopus", "Salt"], answer: 0 },
      ] }),
  ],
  "ja-u2": [
    vocabLesson({ id: "ja-family-1", title: "Family and friends", objective: "Say I, family, friend, mother and father.", lang: "ja-JP",
      vocab: [{ term: j("わたし", "watashi"), meaning: "I, me" }, { term: j("ともだち", "tomodachi"), meaning: "Friend" }, { term: j("かぞく", "kazoku"), meaning: "Family" }, { term: j("おかあさん", "okaasan"), meaning: "Mother", accepted: ["おかあさん", "okaasan", "okāsan"] }, { term: j("おとうさん", "otōsan"), meaning: "Father", accepted: ["おとうさん", "otōsan", "otousan", "otosan"] }],
      extra: [{ type: "fill", prompt: "My mother", before: "わたしの", after: "", choices: ["おかあさん", "ごはん", "りんご"], answer: 0, explain: "の links two nouns, like “’s” or “of”: わたしの = my." }] }),
  ],
};

/* ---------- Korean ---------- */
export const koMoreUnits: Unit[] = [{
  id: "ko-u3", title: "People and colors",
  lessons: [
    vocabLesson({ id: "ko-intro-1", title: "Introducing yourself", objective: "Say who you are and nice to meet you.", lang: "ko-KR",
      vocab: [{ term: k("저", "jeo"), meaning: "I (polite)" }, { term: k("이름", "ireum"), meaning: "Name" }, { term: k("학생", "haksaeng"), meaning: "Student" }, { term: k("선생님", "seonsaengnim"), meaning: "Teacher" }, { term: k("만나서 반갑습니다", "mannaseo bangapseumnida"), meaning: "Nice to meet you" }],
      extra: [
        { type: "mcq", prompt: `What does “${k("제 이름은", "je ireumeun")}” start in Korean?`, choices: ["My name is…", "I am a student", "Thank you", "Goodbye"], answer: 0 },
        { type: "build", prompt: "Translate: I am a student", tiles: [k("저는", "jeoneun"), k("학생입니다", "haksaengimnida"), k("선생님입니다", "seonsaengnimimnida"), k("이름", "ireum")], answer: [k("저는", "jeoneun"), k("학생입니다", "haksaengimnida")], explain: "는 marks the topic of the sentence, and 입니다 means “am / is”." },
      ] }),
    vocabLesson({ id: "ko-family-1", title: "Family and friends", objective: "Say mom, dad, friend, family and I love you.", lang: "ko-KR",
      vocab: [{ term: k("엄마", "eomma"), meaning: "Mom" }, { term: k("아빠", "appa"), meaning: "Dad" }, { term: k("친구", "chingu"), meaning: "Friend" }, { term: k("가족", "gajok"), meaning: "Family" }, { term: k("사랑해요", "saranghaeyo"), meaning: "I love you" }],
      extra: [{ type: "build", prompt: "Translate: Mom, I love you", tiles: [k("엄마", "eomma"), k("사랑해요", "saranghaeyo"), k("아빠", "appa"), k("친구", "chingu")], answer: [k("엄마", "eomma"), k("사랑해요", "saranghaeyo")] }] }),
    vocabLesson({ id: "ko-colors-1", title: "Colors", objective: "Name the basic colors.", lang: "ko-KR",
      vocab: [{ term: k("빨간색", "ppalgansaek"), meaning: "Red" }, { term: k("파란색", "paransaek"), meaning: "Blue" }, { term: k("노란색", "noransaek"), meaning: "Yellow" }, { term: k("검은색", "geomeunsaek"), meaning: "Black" }, { term: k("초록색", "choroksaek"), meaning: "Green" }],
      extra: [
        { type: "mcq", prompt: "What color is the sky on a clear day?", choices: [k("빨간색", "ppalgansaek"), k("파란색", "paransaek"), k("검은색", "geomeunsaek"), k("노란색", "noransaek")], answer: 1, explain: "색 (saek) means color. Each color word ends in 색." },
        { type: "mcq", prompt: `What does “${k("색", "saek")}” mean?`, choices: ["Color", "Water", "Friend", "Name"], answer: 0 },
      ] }),
  ],
}];

/* ---------- English for Bengali speakers ---------- */
export const bnEnMoreUnits: Unit[] = [
  {
    id: "en-u3", title: "পরিবার ও খাবার",
    lessons: [
      vocabLesson({ id: "en-family-1", title: "পরিবার", objective: "পরিবারের সদস্যদের ইংরেজি নাম শেখো।", prompts: bnPrompts, lang: "en-US",
        vocab: [{ term: "Mother", meaning: "মা" }, { term: "Father", meaning: "বাবা" }, { term: "Brother", meaning: "ভাই" }, { term: "Sister", meaning: "বোন" }, { term: "Friend", meaning: "বন্ধু" }],
        extra: [
          { type: "fill", prompt: "আমার বাবা", before: "My", after: ".", choices: ["father", "mother", "sister"], answer: 0 },
          { type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আমার একজন বন্ধু আছে", tiles: ["I", "have", "a", "friend", "mother", "am"], answer: ["I", "have", "a", "friend"] },
        ] }),
      vocabLesson({ id: "en-food-1", title: "খাবার", objective: "রোজকার খাবারের ইংরেজি নাম শেখো।", prompts: bnPrompts, lang: "en-US",
        vocab: [{ term: "Rice", meaning: "ভাত" }, { term: "Fish", meaning: "মাছ" }, { term: "Tea", meaning: "চা" }, { term: "Egg", meaning: "ডিম" }, { term: "Water", meaning: "পানি (জল)" }],
        extra: [
          { type: "fill", prompt: "আমি চা চাই", before: "I want", after: ".", choices: ["tea", "fish", "egg"], answer: 0 },
          { type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আমি ভাত খাই", tiles: ["I", "eat", "rice", "fish", "drink", "tea"], answer: ["I", "eat", "rice"] },
        ] }),
    ],
  },
  {
    id: "en-u4", title: "প্রাণী ও দিন",
    lessons: [
      vocabLesson({ id: "en-animals-1", title: "প্রাণী", objective: "পরিচিত প্রাণীর ইংরেজি নাম শেখো।", prompts: bnPrompts, lang: "en-US",
        vocab: [{ term: "Dog", meaning: "কুকুর" }, { term: "Cat", meaning: "বিড়াল" }, { term: "Bird", meaning: "পাখি" }, { term: "Cow", meaning: "গরু" }, { term: "Horse", meaning: "ঘোড়া" }],
        extra: [
          { type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আমার একটি কুকুর আছে", tiles: ["I", "have", "a", "dog", "cat", "am"], answer: ["I", "have", "a", "dog"] },
          { type: "fill", prompt: "বিড়ালটি ছোট", before: "The", after: "is small.", choices: ["cat", "dog", "cow"], answer: 0 },
        ] }),
      vocabLesson({ id: "en-days-1", title: "সপ্তাহের দিন", objective: "সোমবার থেকে শুক্রবার ইংরেজিতে বলতে শেখো।", prompts: bnPrompts, lang: "en-US",
        vocab: [{ term: "Monday", meaning: "সোমবার" }, { term: "Tuesday", meaning: "মঙ্গলবার" }, { term: "Wednesday", meaning: "বুধবার" }, { term: "Thursday", meaning: "বৃহস্পতিবার" }, { term: "Friday", meaning: "শুক্রবার" }],
        extra: [
          { type: "fill", prompt: "আজ সোমবার", before: "Today is", after: ".", choices: ["Monday", "Friday", "Tuesday"], answer: 0 },
          { type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আজ শুক্রবার", tiles: ["Today", "is", "Friday", "Monday", "am"], answer: ["Today", "is", "Friday"] },
        ] }),
    ],
  },
];
