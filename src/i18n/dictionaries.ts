import { buildStrings } from "./merge";
export { locales, isLocale } from "./config";
export type { Locale } from "./config";

export interface Dictionary {
  brand: string; tagline: string; heroTitle: string; heroBody: string;
  cta: string; ctaSecondary: string; pickTitle: string; pickHint: string;
  available: string; soon: string; startCourse: string; courseSoon: string;
  featuresTitle: string; features: { icon: string; title: string; body: string }[];
  footer: string; switchTo: string; mascotLabel: string;
}

const en: Dictionary = {
  brand: "MugoX", tagline: "Learn languages by playing",
  heroTitle: "Say hello in any language",
  heroBody: "Short, playful lessons. Earn XP, keep your streak alive, and start right now. No account needed.",
  cta: "Start learning for free", ctaSecondary: "See how it works",
  pickTitle: "What do you want to learn?", pickHint: "Tap a language to preview it.",
  available: "Ready to learn", soon: "Coming soon",
  startCourse: "Start Spanish", courseSoon: "We are still writing this course. Check back soon.",
  featuresTitle: "Small wins, every day",
  features: [
    { icon: "⚡", title: "Earn XP", body: "Every correct answer fills your XP bar." },
    { icon: "🔥", title: "Keep your streak", body: "Learn a little each day and watch it grow." },
    { icon: "🏅", title: "Collect badges", body: "Unlock badges as you reach new milestones." },
  ],
  footer: "© MugoX. Built for curious learners.", switchTo: "বাংলা", mascotLabel: "Mugo, the MugoX mascot",
};

const bn: Dictionary = {
  brand: "মুগোএক্স", tagline: "খেলতে খেলতে ভাষা শেখো",
  heroTitle: "যেকোনো ভাষায় বলো হ্যালো",
  heroBody: "ছোট ছোট মজার পাঠ। XP জেতো, স্ট্রিক ধরে রাখো, আর এখনই শুরু করো। অ্যাকাউন্ট লাগবে না।",
  cta: "বিনামূল্যে শেখা শুরু করো", ctaSecondary: "কীভাবে কাজ করে দেখো",
  pickTitle: "কোন ভাষা শিখতে চাও?", pickHint: "প্রিভিউ দেখতে একটি ভাষায় ট্যাপ করো।",
  available: "শেখার জন্য প্রস্তুত", soon: "শীঘ্রই আসছে",
  startCourse: "স্প্যানিশ শুরু করো", courseSoon: "এই কোর্সটি এখনো লেখা হচ্ছে। শীঘ্রই আবার দেখো।",
  featuresTitle: "প্রতিদিন ছোট ছোট জয়",
  features: [
    { icon: "⚡", title: "XP জেতো", body: "প্রতিটি সঠিক উত্তরে তোমার XP বার ভরে ওঠে।" },
    { icon: "🔥", title: "স্ট্রিক ধরে রাখো", body: "প্রতিদিন একটু একটু শেখো, স্ট্রিক বাড়তে দেখো।" },
    { icon: "🏅", title: "ব্যাজ সংগ্রহ করো", body: "নতুন মাইলফলকে পৌঁছালেই ব্যাজ আনলক হয়।" },
  ],
  footer: "© MugoX। কৌতূহলী শিক্ষার্থীদের জন্য তৈরি।", switchTo: "English", mascotLabel: "মুগো, মুগোএক্সের মাসকট",
};

export const dictionaries = buildStrings<Dictionary>(en, { bn }, (p) => p.dict);
