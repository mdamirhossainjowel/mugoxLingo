import type { Course } from "@/types/course";

/** `{text|romaji|ja}` token: shown with romaji above, spoken as the Japanese text. */
const j = (text: string, romaji: string) => `{${text}|${romaji}|ja}`;
const HELLO = j("こんにちは", "konnichiwa"), THANKS = j("ありがとう", "arigatō"), BYE = j("さようなら", "sayōnara"), SORRY = j("すみません", "sumimasen");
const GOODMORNING = j("おはよう", "ohayō"), YES = j("はい", "hai"), NO = j("いいえ", "iie");
const [N1, N2, N3, N4, N5] = [j("一", "ichi"), j("二", "ni"), j("三", "san"), j("四", "yon"), j("五", "go")];
const [WATER, TEA, RICE, APPLE, TASTY] = [j("みず", "mizu"), j("おちゃ", "ocha"), j("ごはん", "gohan"), j("りんご", "ringo"), j("おいしい", "oishii")];

export const jaCourse: Course = {
  id: "en-ja", from: "en", to: "ja", ttsLang: "ja-JP", title: "Japanese for English speakers", status: "full",
  units: [
    {
      id: "ja-u1", title: "Hiragana basics",
      lessons: [
        {
          id: "ja-hiragana-1", title: "Hiragana vowels", objective: "Read and say the five vowel sounds: あ い う え お.",
          vocab: [{ term: "あ", meaning: "a (as in “father”)" }, { term: "い", meaning: "i (as in “machine”)" }, { term: "う", meaning: "u (as in “flute”)" }, { term: "え", meaning: "e (as in “bed”)" }, { term: "お", meaning: "o (as in “more”)" }],
          exercises: [
            { id: "jh1-1", type: "mcq", prompt: "What sound does “あ” make?", say: "あ", choices: ["a as in “father”", "i as in “machine”", "u as in “flute”", "e as in “bed”"], answer: 0, explain: "Japanese has five vowels, and each one is always pronounced the same way." },
            { id: "jh1-2", type: "mcq", prompt: "Which kana sounds like “i”?", choices: ["あ", "い", "う", "え"], answer: 1 },
            { id: "jh1-3", type: "listen", prompt: "Listen. Which kana did you hear?", say: "う", lang: "ja-JP", choices: ["あ", "い", "う", "え"], answer: 2 },
            { id: "jh1-4", type: "match", prompt: "Match each kana to its sound", pairs: [{ left: "あ", right: "a" }, { left: "い", right: "i" }, { left: "う", right: "u" }, { left: "え", right: "e" }] },
            { id: "jh1-5", type: "mcq", prompt: `What does “${j("あい", "ai")}” mean?`, choices: ["Love", "House", "Up", "Blue"], answer: 0 },
            { id: "jh1-6", type: "translate", prompt: "Type the romaji for い.", accepted: ["i"] },
            { id: "jh1-7", type: "mcq", prompt: `What does “${j("いえ", "ie")}” mean?`, choices: ["House", "Love", "Up", "Blue"], answer: 0, explain: "い is “i” and え is “e”, so いえ is read “ee-eh”." },
          ],
        },
        {
          id: "ja-hiragana-2", title: "The K row", objective: "Read か き く け こ and a few words that use them.",
          vocab: [{ term: "か", meaning: "ka" }, { term: "き", meaning: "ki" }, { term: "く", meaning: "ku" }, { term: "け", meaning: "ke" }, { term: "こ", meaning: "ko" }],
          exercises: [
            { id: "jh2-1", type: "mcq", prompt: "What sound does “か” make?", say: "か", choices: ["ka", "ki", "ku", "ko"], answer: 0 },
            { id: "jh2-2", type: "mcq", prompt: "Which kana sounds like “ko”?", choices: ["か", "き", "こ", "け"], answer: 2 },
            { id: "jh2-3", type: "listen", prompt: "Listen. Which kana did you hear?", say: "き", lang: "ja-JP", choices: ["ka", "ki", "ku", "ke"], answer: 1 },
            { id: "jh2-4", type: "match", prompt: "Match each kana to its sound", pairs: [{ left: "か", right: "ka" }, { left: "き", right: "ki" }, { left: "く", right: "ku" }, { left: "け", right: "ke" }] },
            { id: "jh2-5", type: "mcq", prompt: `What does “${j("かお", "kao")}” mean?`, choices: ["Face", "Mouth", "Pond", "Autumn"], answer: 0 },
            { id: "jh2-6", type: "build", prompt: "Build the word for “pond” (ike)", tiles: ["い", "け", "か", "く"], answer: ["い", "け"] },
            { id: "jh2-7", type: "translate", prompt: "Type the romaji for こ.", accepted: ["ko"] },
          ],
        },
      ],
    },
    {
      id: "ja-u2", title: "Everyday words",
      lessons: [
        {
          id: "ja-greetings-1", title: "Greetings", objective: "Say hello, thank you, goodbye and sorry.",
          vocab: [{ term: HELLO, meaning: "Hello" }, { term: THANKS, meaning: "Thank you" }, { term: BYE, meaning: "Goodbye" }, { term: SORRY, meaning: "Excuse me, sorry" }, { term: GOODMORNING, meaning: "Good morning" }, { term: YES, meaning: "Yes" }],
          exercises: [
            { id: "jg-1", type: "mcq", prompt: `What does “${HELLO}” mean?`, choices: ["Hello", "Goodbye", "Thank you", "Sorry"], answer: 0, explain: "The last は in こんにちは is read “wa”, not “ha”." },
            { id: "jg-2", type: "mcq", prompt: "How do you say “Thank you”?", choices: [THANKS, BYE, SORRY, HELLO], answer: 0 },
            { id: "jg-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "さようなら", lang: "ja-JP", choices: [HELLO, THANKS, BYE, SORRY], answer: 2 },
            { id: "jg-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: HELLO, right: "Hello" }, { left: THANKS, right: "Thank you" }, { left: BYE, right: "Goodbye" }, { left: SORRY, right: "Excuse me, sorry" }] },
            { id: "jg-5", type: "fill", prompt: "Thank you very much", before: "ありがとう", after: "ます。", choices: ["ござい", "すみ", "おはよ"], answer: 0, explain: "ございます makes it polite." },
            { id: "jg-6", type: "build", prompt: "Translate: Hello, thank you", tiles: [HELLO, THANKS, BYE], answer: [HELLO, THANKS] },
            { id: "jg-7", type: "translate", prompt: "Translate: Goodbye", accepted: ["さようなら", "sayōnara", "sayounara"] },
            { id: "jg-8", type: "mcq", prompt: "How do you say “Yes”?", choices: [YES, NO, HELLO, THANKS], answer: 0 },
          ],
        },
        {
          id: "ja-numbers-1", title: "Numbers 1 to 5", objective: "Count from one to five.",
          vocab: [{ term: N1, meaning: "One" }, { term: N2, meaning: "Two" }, { term: N3, meaning: "Three" }, { term: N4, meaning: "Four" }, { term: N5, meaning: "Five" }],
          exercises: [
            { id: "jn-1", type: "mcq", prompt: `What does “${N3}” mean?`, choices: ["Three", "Four", "Five", "Two"], answer: 0 },
            { id: "jn-2", type: "mcq", prompt: "How do you say “Five”?", choices: [N4, N5, N2, N1], answer: 1 },
            { id: "jn-3", type: "listen", prompt: "Listen. Which number did you hear?", say: "三", lang: "ja-JP", choices: [N2, N3, N4, N5], answer: 1 },
            { id: "jn-4", type: "match", prompt: "Match each number", pairs: [{ left: N1, right: "One" }, { left: N2, right: "Two" }, { left: N3, right: "Three" }, { left: N5, right: "Five" }] },
            { id: "jn-5", type: "fill", prompt: "One, two, three", before: `${N1}、${N2}、`, after: "", choices: [N3, N4, N5], answer: 0 },
            { id: "jn-6", type: "build", prompt: "Translate: one, two, three", tiles: [N1, N2, N3, N4], answer: [N1, N2, N3] },
            { id: "jn-7", type: "translate", prompt: "Translate: Four", accepted: ["四", "よん", "yon", "shi"], explain: "Four can be よん (yon) or し (shi). よん is more common because し sounds like the word for death." },
          ],
        },
        {
          id: "ja-food-1", title: "Food and drink", objective: "Name common foods and ask for water.",
          vocab: [{ term: WATER, meaning: "Water" }, { term: TEA, meaning: "Tea" }, { term: RICE, meaning: "Rice, meal" }, { term: APPLE, meaning: "Apple" }, { term: TASTY, meaning: "Delicious" }],
          exercises: [
            { id: "jf-1", type: "mcq", prompt: `What does “${TEA}” mean?`, choices: ["Tea", "Water", "Rice", "Apple"], answer: 0 },
            { id: "jf-2", type: "mcq", prompt: "How do you say “Water”?", choices: [TEA, WATER, RICE, APPLE], answer: 1 },
            { id: "jf-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "りんご", lang: "ja-JP", choices: ["Tea", "Water", "Rice", "Apple"], answer: 3 },
            { id: "jf-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: WATER, right: "Water" }, { left: TEA, right: "Tea" }, { left: RICE, right: "Rice, meal" }, { left: APPLE, right: "Apple" }] },
            { id: "jf-5", type: "mcq", prompt: `What does “${TASTY}” mean?`, choices: ["Delicious", "Cold", "Big", "Hot"], answer: 0 },
            { id: "jf-6", type: "build", prompt: "Translate: Water, please", tiles: [WATER, "を", "ください", RICE, TEA], answer: [WATER, "を", "ください"], explain: "を marks the thing you are asking for." },
            { id: "jf-7", type: "translate", prompt: "Translate: Apple", accepted: ["りんご", "ringo", "リンゴ"] },
          ],
        },
      ],
    },
  ],
};
