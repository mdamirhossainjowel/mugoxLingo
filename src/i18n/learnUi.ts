import { buildStrings } from "./merge";

const en = {
  practiceTitle: "Practice and events", flashcards: "Flashcards", flashcardsBody: "words unlocked", speed: "Speed Round", speedBody: "45 seconds. How many words can you match?",
  exams: "Unit exams", examLocked: "Finish every lesson in this unit to unlock", examBest: "Best", examTake: "Take exam", examRetake: "Retake", forFun: "Just for fun, no XP.",
  boostTitle: "Weekend boost is on!", boostBody: "Lessons earn 1.5x XP on Saturdays and Sundays.",
  questsTitle: "Daily quests", questsNote: "Quests are just for fun and do not change your XP.",
  quests: { lesson: "Finish a lesson", xp: "Earn 30 XP", cards: "Review 5 flashcards", speed: "Play a Speed Round" } as Record<string, string>,
  chestLocked: "Finish all 3 quests to open today's chest.", chestOpen: "Open the chest!", bonusWord: "Bonus word of the day", chestEmpty: "Finish a lesson to unlock words for the chest.",
  toneTitle: "Tone chart", toneHint: "Tap to hear each tone. The pinyin colour shows the tone.", toneLabels: ["1st: high and flat", "2nd: rising", "3rd: dip, then rise", "4th: sharp falling", "Neutral: light and short"], pinyinOn: "Pinyin: on", pinyinOff: "Pinyin: off", audioNote: "Audio uses your device's Chinese voice. Quality depends on your device.",
  fcTitle: "Flashcards", tapToFlip: "Tap the card to flip it", again: "Still learning", gotIt: "Got it!", fcDone: "Deck done!", fcEmpty: "Finish a lesson first. Its words appear here as flashcards.",
  boxes: { 1: "New", 2: "Learning", 3: "Mastered" } as Record<number, string>, reviewAgain: "Review again", cardsLeft: "cards left", back: "Back to course", flipHint: "Space flips, 1 = still learning, 2 = got it",
  spNeedWords: "Finish a lesson first to unlock words for the Speed Round.", spStart: "Start", spScore: "Score", spBest: "Best", spCombo: "Combo", spTimeUp: "Time is up!", spPlayAgain: "Play again", spNewBest: "New best!", spReady: "Ready? Pick the right meaning, fast.",
  exTitle: "Unit exam", exQuestions: "questions", exMinutes: "minutes", exPass: "to pass", exNoFeedback: "No hints while you answer. You see your results after you submit.", exStart: "Start exam",
  exQuestion: "Question", exOf: "of", exFlag: "Flag for review", exFlagged: "Flagged", exPrev: "Previous", exNext: "Next", exSubmit: "Submit exam", exUnanswered: "unanswered", exConfirm: "Submit now?", exKeep: "Keep working", exTimeLeft: "Time left", exTimeUp: "Time is up. Submitting your answers.",
  exResult: "Your result", exPassed: "You passed!", exFailed: "Not passed yet", exScore: "Score", exTime: "Time", exBreakdown: "By question type", exReview: "Review your answers", exYourBest: "Your best", exBackToCourse: "Back to course", exNewBadge: "New badge: Exam passed",
  tier: { ace: "Outstanding! You really know this unit.", pass: "Well done! You passed.", close: "So close! Review the lessons and try again.", again: "Every expert starts here. Revisit the lessons and retry." } as Record<string, string>,
  types: { mcq: "Multiple choice", fill: "Fill in the blank", match: "Matching", build: "Sentence building", translate: "Translation" } as Record<string, string>,
  exLocked: "This exam unlocks when you finish every lesson in the unit.", exGuestNote: "Guest results are saved on this device only.", exSaveError: "We could not save your result. Check your connection and try again.", exCorrectAnswer: "Answer", exSubmitting: "Grading…",
};
export type LearnUi = typeof en;
const bn: LearnUi = {
  practiceTitle: "অনুশীলন ও ইভেন্ট", flashcards: "ফ্ল্যাশকার্ড", flashcardsBody: "টি শব্দ আনলক", speed: "স্পিড রাউন্ড", speedBody: "৪৫ সেকেন্ড। কয়টা শব্দ মেলাতে পারো?",
  exams: "ইউনিট পরীক্ষা", examLocked: "আনলক করতে এই ইউনিটের সব পাঠ শেষ করো", examBest: "সেরা", examTake: "পরীক্ষা দাও", examRetake: "আবার দাও", forFun: "শুধু মজার জন্য, XP নেই।",
  boostTitle: "উইকেন্ড বুস্ট চালু!", boostBody: "শনি ও রবিবারে পাঠ থেকে ১.৫ গুণ XP মেলে।",
  questsTitle: "দৈনিক কোয়েস্ট", questsNote: "কোয়েস্ট শুধু মজার জন্য, এতে তোমার XP বদলায় না।",
  quests: { lesson: "একটি পাঠ শেষ করো", xp: "৩০ XP জেতো", cards: "৫টি ফ্ল্যাশকার্ড দেখো", speed: "একটি স্পিড রাউন্ড খেলো" },
  chestLocked: "আজকের বাক্স খুলতে ৩টি কোয়েস্টই শেষ করো।", chestOpen: "বাক্স খোলো!", bonusWord: "আজকের বোনাস শব্দ", chestEmpty: "বাক্সের জন্য শব্দ আনলক করতে একটি পাঠ শেষ করো।",
  toneTitle: "টোন চার্ট", toneHint: "প্রতিটি টোন শুনতে ট্যাপ করো। পিনইনের রঙ টোন বোঝায়।", toneLabels: ["১ম: উঁচু ও সমান", "২য়: ওঠা", "৩য়: নেমে তারপর ওঠা", "৪র্থ: তীক্ষ্ণ নামা", "নিরপেক্ষ: হালকা ও ছোট"], pinyinOn: "পিনইন: চালু", pinyinOff: "পিনইন: বন্ধ", audioNote: "অডিও তোমার ডিভাইসের চীনা ভয়েস ব্যবহার করে। মান ডিভাইসের উপর নির্ভর করে।",
  fcTitle: "ফ্ল্যাশকার্ড", tapToFlip: "উল্টাতে কার্ডে ট্যাপ করো", again: "এখনো শিখছি", gotIt: "পেরেছি!", fcDone: "ডেক শেষ!", fcEmpty: "আগে একটি পাঠ শেষ করো। তার শব্দগুলো এখানে ফ্ল্যাশকার্ড হয়ে আসবে।",
  boxes: { 1: "নতুন", 2: "শিখছি", 3: "আয়ত্তে" }, reviewAgain: "আবার দেখো", cardsLeft: "টি কার্ড বাকি", back: "কোর্সে ফিরে যাও", flipHint: "স্পেস দিয়ে উল্টাও, ১ = এখনো শিখছি, ২ = পেরেছি",
  spNeedWords: "স্পিড রাউন্ডের শব্দ আনলক করতে আগে একটি পাঠ শেষ করো।", spStart: "শুরু", spScore: "স্কোর", spBest: "সেরা", spCombo: "কম্বো", spTimeUp: "সময় শেষ!", spPlayAgain: "আবার খেলো", spNewBest: "নতুন সেরা!", spReady: "তৈরি? দ্রুত সঠিক অর্থটা বাছো।",
  exTitle: "ইউনিট পরীক্ষা", exQuestions: "টি প্রশ্ন", exMinutes: "মিনিট", exPass: "পাস করতে", exNoFeedback: "উত্তর দেওয়ার সময় কোনো ইঙ্গিত নেই। জমা দেওয়ার পর ফলাফল দেখবে।", exStart: "পরীক্ষা শুরু করো",
  exQuestion: "প্রশ্ন", exOf: "/", exFlag: "পরে দেখতে চিহ্নিত করো", exFlagged: "চিহ্নিত", exPrev: "আগের", exNext: "পরের", exSubmit: "পরীক্ষা জমা দাও", exUnanswered: "টি উত্তর বাকি", exConfirm: "এখনই জমা দেবে?", exKeep: "চালিয়ে যাও", exTimeLeft: "বাকি সময়", exTimeUp: "সময় শেষ। তোমার উত্তর জমা হচ্ছে।",
  exResult: "তোমার ফলাফল", exPassed: "তুমি পাস করেছ!", exFailed: "এখনো পাস হয়নি", exScore: "স্কোর", exTime: "সময়", exBreakdown: "প্রশ্নের ধরন অনুযায়ী", exReview: "তোমার উত্তর দেখো", exYourBest: "তোমার সেরা", exBackToCourse: "কোর্সে ফিরে যাও", exNewBadge: "নতুন ব্যাজ: পরীক্ষায় পাস",
  tier: { ace: "অসাধারণ! এই ইউনিট তুমি সত্যিই ভালো জানো।", pass: "চমৎকার! তুমি পাস করেছ।", close: "খুব কাছাকাছি! পাঠগুলো আবার দেখে নতুন করে চেষ্টা করো।", again: "সব বিশেষজ্ঞ এখান থেকেই শুরু করে। পাঠগুলো আবার দেখে আবার দাও।" },
  types: { mcq: "বহুনির্বাচনী", fill: "শূন্যস্থান পূরণ", match: "মেলানো", build: "বাক্য গঠন", translate: "অনুবাদ" },
  exLocked: "এই ইউনিটের সব পাঠ শেষ করলে পরীক্ষা আনলক হবে।", exGuestNote: "অতিথির ফলাফল শুধু এই ডিভাইসে সংরক্ষিত থাকে।", exSaveError: "ফলাফল সংরক্ষণ করা যায়নি। সংযোগ দেখে আবার চেষ্টা করো।", exCorrectAnswer: "উত্তর", exSubmitting: "মূল্যায়ন হচ্ছে…",
};
export const learnStrings = buildStrings<LearnUi>(en, { bn }, (p) => p.learn);
