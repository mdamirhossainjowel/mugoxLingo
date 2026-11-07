import type { Course } from "@/types/course";
import { vocabLesson } from "./generate";

/** `{বাংলা|romanization|bn}` token. The romanization is a simplified, learner-friendly spelling. */
const b = (text: string, rom: string) => `{${text}|${rom}|bn}`;
const [THANKS, YES, NO, GOOD, SORRY] = [b("ধন্যবাদ", "dhonnobad"), b("হ্যাঁ", "hyan"), b("না", "na"), b("ভালো", "bhalo"), b("দুঃখিত", "dukkhito")];
const [I, YOU, MOTHER, FATHER, BOOK] = [b("আমি", "ami"), b("তুমি", "tumi"), b("মা", "ma"), b("বাবা", "baba"), b("বই", "boi")];
const [N1, N2, N3, N4, N5] = [b("এক", "ek"), b("দুই", "dui"), b("তিন", "tin"), b("চার", "char"), b("পাঁচ", "panch")];
const [RED, BLUE, GREEN, YELLOW, BLACK] = [b("লাল", "lal"), b("নীল", "nil"), b("সবুজ", "sobuj"), b("হলুদ", "holud"), b("কালো", "kalo")];
const [RICE, FISH, TEA, EGG, MANGO] = [b("ভাত", "bhat"), b("মাছ", "mach"), b("চা", "cha"), b("ডিম", "dim"), b("আম", "am")];
const [HELLO, MORNING, HOWRU, FINE, SEEYOU] = [b("হ্যালো", "hyalo"), b("শুভ সকাল", "shubho shokal"), b("আপনি কেমন আছেন", "apni kemon achhen"), b("আমি ভালো আছি", "ami bhalo achhi"), b("আবার দেখা হবে", "abar dekha hobe")];

export const bnCourse: Course = {
  id: "en-bn", from: "en", to: "bn", ttsLang: "bn-BD", title: "Bengali for English speakers", status: "full",
  units: [
    {
      id: "bn-u1", title: "First words",
      lessons: [
        vocabLesson({ id: "bn-first-1", title: "Yes, no and thanks", objective: "Learn a few everyday Bengali words.",
          vocab: [{ term: THANKS, meaning: "Thank you", accepted: ["ধন্যবাদ", "dhonnobad", "dhanyabad"] }, { term: YES, meaning: "Yes", accepted: ["হ্যাঁ", "hyan", "ha"] }, { term: NO, meaning: "No" }, { term: GOOD, meaning: "Good" }, { term: SORRY, meaning: "Sorry" }],
          extra: [{ type: "fill", prompt: "I am good", before: I, after: "।", choices: [GOOD, NO, YES], answer: 0 }] }),
        vocabLesson({ id: "bn-people-1", title: "I, you and family", objective: "Say who is who in Bengali.",
          vocab: [{ term: I, meaning: "I" }, { term: YOU, meaning: "You (informal)" }, { term: MOTHER, meaning: "Mother" }, { term: FATHER, meaning: "Father" }, { term: BOOK, meaning: "Book" }],
          extra: [{ type: "fill", prompt: "You are good", before: YOU, after: "।", choices: [GOOD, NO, YES], answer: 0 }] }),
      ],
    },
    {
      id: "bn-u2", title: "Everyday talk",
      lessons: [
        vocabLesson({ id: "bn-greetings-1", title: "Greetings", objective: "Greet someone and say how you are.",
          vocab: [{ term: HELLO, meaning: "Hello" }, { term: MORNING, meaning: "Good morning" }, { term: HOWRU, meaning: "How are you? (polite)" }, { term: FINE, meaning: "I am fine" }, { term: SEEYOU, meaning: "See you again" }],
          extra: [{ type: "mcq", prompt: `In Bengali, “${b("আপনি", "apni")}” is the polite way to say…`, choices: ["You (polite)", "I", "Mother", "Good"], answer: 0, explain: "Bengali has three levels of “you”: আপনি (polite), তুমি (friendly) and তুই (very informal)." }] }),
        vocabLesson({ id: "bn-numbers-1", title: "Numbers 1 to 5", objective: "Count from one to five.",
          vocab: [{ term: N1, meaning: "One" }, { term: N2, meaning: "Two" }, { term: N3, meaning: "Three" }, { term: N4, meaning: "Four" }, { term: N5, meaning: "Five", accepted: ["পাঁচ", "panch", "pach"] }],
          extra: [{ type: "fill", prompt: "One, two, three", before: `${N1}, ${N2},`, after: "।", choices: [N3, N4, N5], answer: 0 }] }),
      ],
    },
    {
      id: "bn-u3", title: "Colors and food",
      lessons: [
        vocabLesson({ id: "bn-colors-1", title: "Colors", objective: "Name the basic colors.",
          vocab: [{ term: RED, meaning: "Red" }, { term: BLUE, meaning: "Blue" }, { term: GREEN, meaning: "Green" }, { term: YELLOW, meaning: "Yellow" }, { term: BLACK, meaning: "Black" }],
          extra: [{ type: "mcq", prompt: "What color is the sky on a clear day?", choices: [RED, BLUE, BLACK, YELLOW], answer: 1 }] }),
        vocabLesson({ id: "bn-food-1", title: "Rice, fish and tea", objective: "Name everyday foods and say what you eat.",
          vocab: [{ term: RICE, meaning: "Rice" }, { term: FISH, meaning: "Fish" }, { term: TEA, meaning: "Tea" }, { term: EGG, meaning: "Egg" }, { term: MANGO, meaning: "Mango" }],
          extra: [
            { type: "mcq", prompt: "Complete the famous saying “Machhe bhate Bangali”: Bengalis are made of fish and…", choices: ["Bread", RICE, "Apples", "Noodles"], answer: 1, explain: "মাছে ভাতে বাঙালি: fish and rice are the heart of a Bengali meal." },
            { type: "build", prompt: "Translate: I eat rice", tiles: [I, RICE, b("খাই", "khai"), FISH, TEA], answer: [I, RICE, b("খাই", "khai")] },
          ] }),
      ],
    },
  ],
};
