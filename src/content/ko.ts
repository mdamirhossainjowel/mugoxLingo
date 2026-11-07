import type { Course } from "@/types/course";

/** `{한글|romanization|ko}` token: shown with Revised Romanization above, spoken as the Korean text. */
const k = (text: string, rom: string) => `{${text}|${rom}|ko}`;
const HELLO = k("안녕하세요", "annyeonghaseyo"), THANKS = k("감사합니다", "gamsahamnida"), SORRY = k("죄송합니다", "joesonghamnida");
const LEAVE = k("안녕히 가세요", "annyeonghi gaseyo"), STAY = k("안녕히 계세요", "annyeonghi gyeseyo"), YES = k("네", "ne"), NO = k("아니요", "aniyo");
const [N1, N2, N3, N4, N5] = [k("일", "il"), k("이", "i"), k("삼", "sam"), k("사", "sa"), k("오", "o")];
const [WATER, RICE, TEA, APPLE, TASTY, PLEASE] = [k("물", "mul"), k("밥", "bap"), k("차", "cha"), k("사과", "sagwa"), k("맛있어요", "masisseoyo"), k("주세요", "juseyo")];

export const koCourse: Course = {
  id: "en-ko", from: "en", to: "ko", ttsLang: "ko-KR", title: "Korean for English speakers", status: "full",
  units: [
    {
      id: "ko-u1", title: "Hangul basics",
      lessons: [
        {
          id: "ko-hangul-1", title: "Basic vowels", objective: "Read the six basic vowel sounds in Hangul.",
          vocab: [{ term: "아", meaning: "a (as in “father”)" }, { term: "어", meaning: "eo (as in “son”)" }, { term: "오", meaning: "o (as in “go”)" }, { term: "우", meaning: "u (as in “moon”)" }, { term: "으", meaning: "eu (as in “book”, lips flat)" }, { term: "이", meaning: "i (as in “see”)" }],
          exercises: [
            { id: "kh1-1", type: "mcq", prompt: "What sound does “아” make?", say: "아", choices: ["a as in “father”", "eo as in “son”", "o as in “go”", "u as in “moon”"], answer: 0 },
            { id: "kh1-2", type: "mcq", prompt: "Which vowel sounds like “oo” in “moon”?", choices: ["아", "어", "오", "우"], answer: 3, explain: "In Hangul every syllable block starts with a consonant. The circle ㅇ at the start is silent." },
            { id: "kh1-3", type: "listen", prompt: "Listen. Which vowel did you hear?", say: "우", lang: "ko-KR", choices: ["a", "eo", "o", "u"], answer: 3 },
            { id: "kh1-4", type: "match", prompt: "Match each vowel to its sound", pairs: [{ left: "아", right: "a" }, { left: "어", right: "eo" }, { left: "오", right: "o" }, { left: "우", right: "u" }] },
            { id: "kh1-5", type: "mcq", prompt: `What does “${k("우유", "uyu")}” mean?`, choices: ["Milk", "Child", "Cucumber", "Water"], answer: 0 },
            { id: "kh1-6", type: "translate", prompt: "Type the romanization of 이.", accepted: ["i"] },
            { id: "kh1-7", type: "mcq", prompt: `What does “${k("아이", "ai")}” mean?`, choices: ["Child", "Milk", "Cucumber", "Tree"], answer: 0 },
          ],
        },
        {
          id: "ko-hangul-2", title: "First consonants", objective: "Read 가 나 다 마 바 사 and simple words.",
          vocab: [{ term: "가", meaning: "ga" }, { term: "나", meaning: "na" }, { term: "다", meaning: "da" }, { term: "마", meaning: "ma" }, { term: "바", meaning: "ba" }, { term: "사", meaning: "sa" }],
          exercises: [
            { id: "kh2-1", type: "mcq", prompt: "What sound does “나” make?", say: "나", choices: ["na", "ma", "ba", "sa"], answer: 0 },
            { id: "kh2-2", type: "mcq", prompt: "Which syllable sounds like “ma”?", choices: ["가", "나", "마", "바"], answer: 2 },
            { id: "kh2-3", type: "listen", prompt: "Listen. Which syllable did you hear?", say: "사", lang: "ko-KR", choices: ["ga", "da", "ba", "sa"], answer: 3 },
            { id: "kh2-4", type: "match", prompt: "Match each syllable to its sound", pairs: [{ left: "가", right: "ga" }, { left: "나", right: "na" }, { left: "다", right: "da" }, { left: "마", right: "ma" }] },
            { id: "kh2-5", type: "mcq", prompt: `What does “${k("나무", "namu")}” mean?`, choices: ["Tree", "Sea", "Lion", "Milk"], answer: 0 },
            { id: "kh2-6", type: "mcq", prompt: `What does “${k("바다", "bada")}” mean?`, choices: ["Sea", "Tree", "Lion", "Child"], answer: 0 },
            { id: "kh2-7", type: "translate", prompt: "Type the romanization of 사.", accepted: ["sa"] },
          ],
        },
      ],
    },
    {
      id: "ko-u2", title: "Everyday words",
      lessons: [
        {
          id: "ko-greetings-1", title: "Greetings", objective: "Say hello, thank you, sorry and goodbye politely.",
          vocab: [{ term: HELLO, meaning: "Hello" }, { term: THANKS, meaning: "Thank you" }, { term: SORRY, meaning: "I am sorry" }, { term: YES, meaning: "Yes" }, { term: NO, meaning: "No" }, { term: LEAVE, meaning: "Goodbye (to someone leaving)" }],
          exercises: [
            { id: "kg-1", type: "mcq", prompt: `What does “${HELLO}” mean?`, choices: ["Hello", "Goodbye", "Thank you", "Sorry"], answer: 0 },
            { id: "kg-2", type: "mcq", prompt: "How do you say “Thank you”?", choices: [THANKS, HELLO, SORRY, YES], answer: 0 },
            { id: "kg-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "감사합니다", lang: "ko-KR", choices: [HELLO, THANKS, SORRY, YES], answer: 1 },
            { id: "kg-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: HELLO, right: "Hello" }, { left: THANKS, right: "Thank you" }, { left: SORRY, right: "I am sorry" }, { left: YES, right: "Yes" }] },
            { id: "kg-5", type: "fill", prompt: "Thank you", before: "감사", after: "니다.", choices: ["합", "해", "하"], answer: 0 },
            { id: "kg-6", type: "build", prompt: "Translate: Hello, thank you", tiles: [HELLO, THANKS, SORRY], answer: [HELLO, THANKS] },
            { id: "kg-7", type: "translate", prompt: "Translate: Yes", accepted: ["네", "ne", "ye"] },
            { id: "kg-8", type: "mcq", prompt: "Your friend is leaving and you are staying. What do you say?", choices: [LEAVE, STAY, SORRY, NO], answer: 0, explain: "가세요 means “please go”. If YOU are the one leaving, you say 안녕히 계세요 (“please stay well”)." },
          ],
        },
        {
          id: "ko-numbers-1", title: "Numbers 1 to 5", objective: "Count from one to five with Sino-Korean numbers.",
          vocab: [{ term: N1, meaning: "One" }, { term: N2, meaning: "Two" }, { term: N3, meaning: "Three" }, { term: N4, meaning: "Four" }, { term: N5, meaning: "Five" }],
          exercises: [
            { id: "kn-1", type: "mcq", prompt: `What does “${N3}” mean?`, choices: ["Three", "Four", "Five", "Two"], answer: 0, explain: "Korean has two number systems. These Sino-Korean numbers are used for dates, money and phone numbers." },
            { id: "kn-2", type: "mcq", prompt: "How do you say “Five”?", choices: [N4, N5, N2, N1], answer: 1 },
            { id: "kn-3", type: "listen", prompt: "Listen. Which number did you hear?", say: "삼", lang: "ko-KR", choices: [N2, N3, N4, N5], answer: 1 },
            { id: "kn-4", type: "match", prompt: "Match each number", pairs: [{ left: N1, right: "One" }, { left: N2, right: "Two" }, { left: N3, right: "Three" }, { left: N5, right: "Five" }] },
            { id: "kn-5", type: "fill", prompt: "One, two, three", before: `${N1}, ${N2},`, after: "", choices: [N3, N4, N5], answer: 0 },
            { id: "kn-6", type: "build", prompt: "Translate: one, two, three", tiles: [N1, N2, N3, N4], answer: [N1, N2, N3] },
            { id: "kn-7", type: "translate", prompt: "Translate: Four", accepted: ["사", "sa"] },
          ],
        },
        {
          id: "ko-food-1", title: "Food and drink", objective: "Name common foods and ask for water.",
          vocab: [{ term: WATER, meaning: "Water" }, { term: RICE, meaning: "Rice, meal" }, { term: TEA, meaning: "Tea" }, { term: APPLE, meaning: "Apple" }, { term: TASTY, meaning: "It is delicious" }, { term: PLEASE, meaning: "Please give me" }],
          exercises: [
            { id: "kf-1", type: "mcq", prompt: `What does “${WATER}” mean?`, choices: ["Water", "Tea", "Rice", "Apple"], answer: 0 },
            { id: "kf-2", type: "mcq", prompt: "How do you say “Rice”?", choices: [WATER, RICE, TEA, APPLE], answer: 1, explain: "밥 also means “a meal”. Koreans often greet each other by asking if they have eaten." },
            { id: "kf-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "사과", lang: "ko-KR", choices: ["Water", "Rice", "Tea", "Apple"], answer: 3 },
            { id: "kf-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: WATER, right: "Water" }, { left: RICE, right: "Rice, meal" }, { left: TEA, right: "Tea" }, { left: APPLE, right: "Apple" }] },
            { id: "kf-5", type: "mcq", prompt: `What does “${TASTY}” mean?`, choices: ["It is delicious", "It is cold", "It is big", "It is hot"], answer: 0 },
            { id: "kf-6", type: "build", prompt: "Translate: Water, please", tiles: [WATER, PLEASE, RICE, TEA], answer: [WATER, PLEASE] },
            { id: "kf-7", type: "translate", prompt: "Translate: Apple", accepted: ["사과", "sagwa"] },
          ],
        },
      ],
    },
  ],
};
