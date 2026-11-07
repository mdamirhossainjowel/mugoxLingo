import type { Course } from "@/types/course";

/** English for Bengali speakers: instructions are in Bengali, the target language is English. */
export const bnEnCourse: Course = {
  id: "bn-en", from: "bn", to: "en", ttsLang: "en-US", title: "English for Bengali speakers · বাংলাভাষীদের জন্য ইংরেজি", status: "full",
  units: [
    {
      id: "en-u1", title: "প্রথম শব্দ",
      lessons: [
        {
          id: "en-greetings-1", title: "শুভেচ্ছা", objective: "হ্যালো, ধন্যবাদ ও বিদায় ইংরেজিতে বলতে শেখো।",
          vocab: [{ term: "Hello", meaning: "হ্যালো" }, { term: "Goodbye", meaning: "বিদায়" }, { term: "Thank you", meaning: "ধন্যবাদ" }, { term: "Please", meaning: "দয়া করে" }, { term: "Good morning", meaning: "শুভ সকাল" }],
          exercises: [
            { id: "eg-1", type: "mcq", prompt: "“Hello” শব্দের বাংলা অর্থ কী?", say: "Hello", choices: ["হ্যালো", "বিদায়", "ধন্যবাদ", "দয়া করে"], answer: 0 },
            { id: "eg-2", type: "mcq", prompt: "“ধন্যবাদ” ইংরেজিতে কী বলে?", choices: ["Goodbye", "Thank you", "Please", "Hello"], answer: 1 },
            { id: "eg-3", type: "listen", prompt: "শোনো। কোন শব্দটি শুনলে?", say: "Thank you", lang: "en-US", choices: ["Hello", "Goodbye", "Thank you", "Please"], answer: 2 },
            { id: "eg-4", type: "match", prompt: "ইংরেজি শব্দের সঙ্গে বাংলা অর্থ মেলাও", pairs: [{ left: "Hello", right: "হ্যালো" }, { left: "Goodbye", right: "বিদায়" }, { left: "Thank you", right: "ধন্যবাদ" }, { left: "Please", right: "দয়া করে" }] },
            { id: "eg-5", type: "fill", prompt: "শুভ সকাল", before: "Good", after: "!", choices: ["morning", "night", "thanks"], answer: 0, explain: "সকালে “Good morning” বলা হয়।" },
            { id: "eg-6", type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আমার নাম আনা", tiles: ["My", "name", "is", "Ana", "am", "you"], answer: ["My", "name", "is", "Ana"] },
            { id: "eg-7", type: "translate", prompt: "ইংরেজিতে অনুবাদ করো: ধন্যবাদ", accepted: ["Thank you", "Thanks"] },
          ],
        },
        {
          id: "en-numbers-1", title: "সংখ্যা ১ থেকে ৫", objective: "এক থেকে পাঁচ ইংরেজিতে গুনতে শেখো।",
          vocab: [{ term: "One", meaning: "এক" }, { term: "Two", meaning: "দুই" }, { term: "Three", meaning: "তিন" }, { term: "Four", meaning: "চার" }, { term: "Five", meaning: "পাঁচ" }],
          exercises: [
            { id: "en-1", type: "mcq", prompt: "“Three” মানে কত?", say: "Three", choices: ["তিন", "চার", "দুই", "পাঁচ"], answer: 0 },
            { id: "en-2", type: "mcq", prompt: "“পাঁচ” ইংরেজিতে কী?", choices: ["Four", "Five", "Two", "One"], answer: 1 },
            { id: "en-3", type: "listen", prompt: "শোনো। কোন সংখ্যাটি শুনলে?", say: "Four", lang: "en-US", choices: ["Two", "Three", "Four", "Five"], answer: 2 },
            { id: "en-4", type: "match", prompt: "সংখ্যা মেলাও", pairs: [{ left: "One", right: "এক" }, { left: "Two", right: "দুই" }, { left: "Three", right: "তিন" }, { left: "Five", right: "পাঁচ" }] },
            { id: "en-5", type: "fill", prompt: "এক, দুই, তিন", before: "One, two,", after: ".", choices: ["three", "four", "five"], answer: 0 },
            { id: "en-6", type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আমার দুইটি বিড়াল আছে", tiles: ["I", "have", "two", "cats", "three", "dogs"], answer: ["I", "have", "two", "cats"] },
            { id: "en-7", type: "translate", prompt: "ইংরেজিতে অনুবাদ করো: চার", accepted: ["Four"] },
          ],
        },
      ],
    },
    {
      id: "en-u2", title: "রং",
      lessons: [{
        id: "en-colors-1", title: "রং চেনা", objective: "মূল রংগুলোর ইংরেজি নাম শেখো।",
        vocab: [{ term: "Red", meaning: "লাল" }, { term: "Blue", meaning: "নীল" }, { term: "Green", meaning: "সবুজ" }, { term: "Yellow", meaning: "হলুদ" }, { term: "Black", meaning: "কালো" }],
        exercises: [
          { id: "ec-1", type: "mcq", prompt: "“Red” মানে কোন রং?", say: "Red", choices: ["লাল", "নীল", "সবুজ", "কালো"], answer: 0 },
          { id: "ec-2", type: "mcq", prompt: "“সবুজ” ইংরেজিতে কী?", choices: ["Blue", "Green", "Red", "Black"], answer: 1 },
          { id: "ec-3", type: "listen", prompt: "শোনো। কোন রংটি শুনলে?", say: "Yellow", lang: "en-US", choices: ["Red", "Blue", "Yellow", "Black"], answer: 2 },
          { id: "ec-4", type: "match", prompt: "রং মেলাও", pairs: [{ left: "Red", right: "লাল" }, { left: "Blue", right: "নীল" }, { left: "Green", right: "সবুজ" }, { left: "Black", right: "কালো" }] },
          { id: "ec-5", type: "fill", prompt: "আকাশ নীল", before: "The sky is", after: ".", choices: ["blue", "red", "black"], answer: 0 },
          { id: "ec-6", type: "build", prompt: "ইংরেজিতে অনুবাদ করো: আপেলটি লাল", tiles: ["The", "apple", "is", "red", "green", "a"], answer: ["The", "apple", "is", "red"] },
          { id: "ec-7", type: "translate", prompt: "ইংরেজিতে অনুবাদ করো: হলুদ", accepted: ["Yellow"] },
        ],
      }],
    },
  ],
};
