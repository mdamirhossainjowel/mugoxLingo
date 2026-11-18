import { buildStrings } from "./merge";
import { locales, type Locale } from "./config";
import { legalDocs, type LegalDocs } from "./legal";

const en = {
  howTitle: "How it works",
  how: [
    { icon: "🌍", title: "Pick a language", body: "Choose a course that is ready to play." },
    { icon: "🎮", title: "Play short lessons", body: "Tap, match and build sentences in a few minutes." },
    { icon: "🚀", title: "Grow every day", body: "Earn XP, keep your streak and unlock badges." },
  ],
  aboutTitle: "About us",
  adLabel: "Advertisement",
  faqTitle: "Questions",
  faq: [
    { q: "Do I need an account?", a: "No. You can start learning right away as a guest. Create an account when you want your progress on every device." },
    { q: "Where is my progress saved?", a: "As a guest, in this browser only. With an account, on our servers so it follows you across devices." },
    { q: "Which courses are available?", a: "Spanish, Chinese (Mandarin), Japanese and Korean for English speakers, and English for Bengali speakers. Bengali for English speakers. More languages will follow." },
    { q: "Is it free?", a: "You can start for free. We will tell you clearly before anything changes." },
  ],
  footer: { about: "About", privacy: "Privacy", terms: "Terms", contact: "Contact", rights: "© MugoX. Built for curious learners." },
  skip: "Skip to content", language: "Language", cookieSettings: "Cookie settings",
  consent: { adsNote: "This also lets us show Google ads on a few pages, never inside lessons.", title: "Cookies and analytics", body: "May we use Google Analytics to count visits and see which lessons help? It stays off unless you accept, and it never receives your name or email.", accept: "Accept", decline: "No thanks" },
  notFoundTitle: "We could not find that page", home: "Back to home",
  errorTitle: "Something went wrong", errorBody: "Please try again.", retry: "Try again", loading: "Loading…",
  privacyTitle: "Privacy",
  termsTitle: "Terms",
  contactTitle: "Contact", 
};
export type SiteBase = typeof en;
export type SiteUi = SiteBase & LegalDocs;
const bn: SiteBase = {
  howTitle: "কীভাবে কাজ করে",
  how: [
    { icon: "🌍", title: "ভাষা বাছো", body: "খেলার জন্য প্রস্তুত একটি কোর্স বেছে নাও।" },
    { icon: "🎮", title: "ছোট পাঠ খেলো", body: "কয়েক মিনিটে ট্যাপ করো, মেলাও আর বাক্য সাজাও।" },
    { icon: "🚀", title: "প্রতিদিন এগোও", body: "XP জেতো, স্ট্রিক ধরে রাখো আর ব্যাজ আনলক করো।" },
  ],
  aboutTitle: "আমাদের সম্পর্কে",
  adLabel: "বিজ্ঞাপন",
  faqTitle: "প্রশ্ন ও উত্তর",
  faq: [
    { q: "অ্যাকাউন্ট লাগবে কি?", a: "না। অতিথি হিসেবে এখনই শেখা শুরু করতে পারো। সব ডিভাইসে অগ্রগতি চাইলে অ্যাকাউন্ট খুলো।" },
    { q: "আমার অগ্রগতি কোথায় সংরক্ষিত হয়?", a: "অতিথি হিসেবে শুধু এই ব্রাউজারে। অ্যাকাউন্ট থাকলে আমাদের সার্ভারে, তাই সব ডিভাইসে পাবে।" },
    { q: "কোন কোর্সগুলো আছে?", a: "ইংরেজিভাষীদের জন্য স্প্যানিশ, চীনা (ম্যান্ডারিন), জাপানি ও কোরিয়ান, আর বাংলাভাষীদের জন্য ইংরেজি। ইংরেজিভাষীদের জন্য বাংলা। আরও ভাষা আসবে।" },
    { q: "এটা কি বিনামূল্যে?", a: "বিনামূল্যে শুরু করতে পারো। কিছু বদলালে আগে পরিষ্কার জানানো হবে।" },
  ],
  footer: { about: "আমাদের সম্পর্কে", privacy: "গোপনীয়তা", terms: "শর্তাবলি", contact: "যোগাযোগ", rights: "© MugoX। কৌতূহলী শিক্ষার্থীদের জন্য তৈরি।" },
  skip: "মূল অংশে যাও", language: "ভাষা", cookieSettings: "কুকি সেটিংস",
  consent: { adsNote: "এতে আমরা কয়েকটি পেজে Google বিজ্ঞাপন দেখাতে পারি, পাঠের ভেতরে কখনো নয়।", title: "কুকি ও অ্যানালিটিক্স", body: "কতজন আসছে আর কোন পাঠ কাজে লাগছে তা জানতে আমরা কি Google Analytics ব্যবহার করতে পারি? তুমি রাজি না হলে এটি বন্ধ থাকে, আর তোমার নাম বা ইমেইল কখনো পাঠানো হয় না।", accept: "রাজি", decline: "না, ধন্যবাদ" },
  notFoundTitle: "পেজটি খুঁজে পাওয়া যায়নি", home: "হোমে ফিরে যাও",
  errorTitle: "কিছু একটা ভুল হয়েছে", errorBody: "আবার চেষ্টা করো।", retry: "আবার চেষ্টা করো", loading: "লোড হচ্ছে…",
  privacyTitle: "গোপনীয়তা",
  termsTitle: "শর্তাবলি",
  contactTitle: "যোগাযোগ", 
};
const base = buildStrings<SiteBase>(en, { bn }, (p) => p.site);
/** The long texts (About, Privacy, Terms, Contact, home intro and extra FAQ answers) live in ./legal, one file per language. */
export const siteStrings = Object.fromEntries(locales.map((code: Locale) => [code, { ...base[code], ...legalDocs[code], faq: [...base[code].faq, ...legalDocs[code].faqExtra] }])) as Record<Locale, SiteUi>;
