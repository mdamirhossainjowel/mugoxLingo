import { buildStrings } from "./merge";

const en = {
  check: "Check", cont: "Continue", correct: "Correct!", wrong: "Not quite", answerWas: "Correct answer:",
  lessonDone: "Lesson complete!", outOfHearts: "Out of hearts", outHint: "Take a breath and start the lesson again.", tryAgain: "Try again",
  backToPath: "Back to course", nextLesson: "Next lesson", xp: "XP", streakDays: "day streak", goal: "Daily goal",
  continueLearning: "Continue learning", exit: "Exit lesson", typeHere: "Type your answer", matchHint: "Tap a word, then its match",
  perfect: "Perfect run!", newBadges: "New badges", demo: "Demo course", start: "Start", replay: "Practice again", locked: "Locked",
  saveNote: "Progress is saved on this device only. Create an account later to sync it.", storageOff: "Your browser blocks saving, so progress will be lost when you close this tab.",
  loading: "Loading…", notFound: "We could not find that lesson.", hearts: "Hearts left", tray: "Your sentence",
  cheers: ["Great job!", "Nice one!", "You got it!", "Awesome!", "Brilliant!", "Keep going!"], inARow: "in a row", level: "Level", levels: ["Sprout", "Explorer", "Traveler", "Speaker", "Storyteller", "Legend"], toNext: "XP to next level",
  listenHint: "Tap the speaker, then pick what you heard.", playAudio: "Play audio", playSlow: "Play slowly", noAudio: "No voice for this language on your device, so read the word instead.",
  badges: { first_lesson: "First lesson", perfect: "Perfect run", streak_3: "3-day streak", exam_pass: "Exam passed", streak_7: "7-day streak", five_lessons: "5 lessons done" } as Record<string, string>,
};
export type Ui = typeof en;
const bn: Ui = {
  check: "যাচাই করো", cont: "এগিয়ে যাও", correct: "সঠিক!", wrong: "প্রায় হয়েছে", answerWas: "সঠিক উত্তর:",
  lessonDone: "পাঠ সম্পূর্ণ!", outOfHearts: "হার্ট শেষ", outHint: "একটু দম নিয়ে পাঠটা আবার শুরু করো।", tryAgain: "আবার চেষ্টা করো",
  backToPath: "কোর্সে ফিরে যাও", nextLesson: "পরের পাঠ", xp: "XP", streakDays: "দিনের স্ট্রিক", goal: "দৈনিক লক্ষ্য",
  continueLearning: "শেখা চালিয়ে যাও", exit: "পাঠ থেকে বের হও", typeHere: "তোমার উত্তর লেখো", matchHint: "একটি শব্দে ট্যাপ করো, তারপর তার জোড়ায়",
  perfect: "নিখুঁত!", newBadges: "নতুন ব্যাজ", demo: "ডেমো কোর্স", start: "শুরু করো", replay: "আবার অনুশীলন করো", locked: "বন্ধ",
  saveNote: "অগ্রগতি শুধু এই ডিভাইসে সংরক্ষিত। সিঙ্ক করতে পরে অ্যাকাউন্ট খুলো।", storageOff: "তোমার ব্রাউজার সংরক্ষণ আটকে দিচ্ছে, তাই ট্যাব বন্ধ করলে অগ্রগতি হারিয়ে যাবে।",
  loading: "লোড হচ্ছে…", notFound: "পাঠটি খুঁজে পাওয়া যায়নি।", hearts: "বাকি হার্ট", tray: "তোমার বাক্য",
  cheers: ["দারুণ!", "চমৎকার!", "পেরেছ!", "অসাধারণ!", "দুর্দান্ত!", "এগিয়ে চলো!"], inARow: "টানা", level: "লেভেল", levels: ["অঙ্কুর", "অভিযাত্রী", "পর্যটক", "বক্তা", "গল্পকার", "কিংবদন্তি"], toNext: "XP পরের লেভেলে",
  listenHint: "স্পিকারে ট্যাপ করো, তারপর যা শুনলে তা বাছো।", playAudio: "অডিও চালাও", playSlow: "ধীরে চালাও", noAudio: "তোমার ডিভাইসে এই ভাষার ভয়েস নেই, তাই শব্দটি পড়ে নাও।",
  badges: { first_lesson: "প্রথম পাঠ", perfect: "নিখুঁত পাঠ", streak_3: "৩ দিনের স্ট্রিক", exam_pass: "পরীক্ষায় পাস", streak_7: "৭ দিনের স্ট্রিক", five_lessons: "৫টি পাঠ শেষ" },
};
export const uiStrings = buildStrings<Ui>(en, { bn }, (p) => p.ui);
