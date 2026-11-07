import { buildStrings } from "./merge";

const en = {
  howTitle: "How it works",
  how: [
    { icon: "🌍", title: "Pick a language", body: "Choose a course that is ready to play." },
    { icon: "🎮", title: "Play short lessons", body: "Tap, match and build sentences in a few minutes." },
    { icon: "🚀", title: "Grow every day", body: "Earn XP, keep your streak and unlock badges." },
  ],
  aboutTitle: "About us",
  aboutBody: [
    "MugoX Lingo is a free, game-style language-learning app. Short lessons, flashcards, speed rounds and unit exams help you build vocabulary and listening skills a few minutes at a time.",
    "You can start right away as a guest. An account only adds saved progress across your devices. Courses today: Spanish, Chinese (Mandarin), Japanese, Korean and Bengali for English speakers, and English for speakers of Bengali, Hindi, Arabic, Spanish, French, Portuguese, Chinese, Japanese and Korean.",
    "We write the lessons ourselves and fix mistakes as readers report them. For questions or corrections, see the Contact page. The site is supported by advertising on a few content pages; there are no ads inside lessons.",
  ],
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
  draft: "Draft text. Have this reviewed before launch.",
  privacyTitle: "Privacy",
  privacyBody: [
    "Guests: your progress is stored in this browser (local storage) on your device. We do not receive it unless you create an account and choose to import it.",
    "Accounts: we store your email, display name, language settings and learning progress using Neon. A session cookie keeps you logged in.",
    "You can reset a course from your account page. To delete your account or data, use the contact page.",
    "Analytics: only if you accept, we use Google Analytics to count visits and lesson activity. It gets no name or email. It uses cookies with the prefix mgxl, and you can change your choice at any time with Cookie settings in the footer.",
    "Advertising: if you accept, we show ads from Google AdSense on a few content pages, never inside lessons. Google and its partners use cookies to serve ads based on your visits to this and other websites. By default we request non-personalized ads. You can learn about or opt out of personalized advertising at adssettings.google.com or aboutads.info, and you can change your choice any time under Cookie settings in the footer.",
  ],
  termsTitle: "Terms",
  termsBody: [
    "MugoX is a learning app provided as is. Lesson content may contain mistakes; please tell us if you find one.",
    "Do not try to tamper with progress, XP or other users' data. We may limit or remove accounts that do.",
    "Accounts are for people aged 13 and over. Younger learners should use guest mode together with a parent or guardian.",
  ],
  contactTitle: "Contact", contactBody: "Write to us at", contactMissing: "A contact address has not been configured yet.",
};
export type SiteUi = typeof en;
const bn: SiteUi = {
  howTitle: "কীভাবে কাজ করে",
  how: [
    { icon: "🌍", title: "ভাষা বাছো", body: "খেলার জন্য প্রস্তুত একটি কোর্স বেছে নাও।" },
    { icon: "🎮", title: "ছোট পাঠ খেলো", body: "কয়েক মিনিটে ট্যাপ করো, মেলাও আর বাক্য সাজাও।" },
    { icon: "🚀", title: "প্রতিদিন এগোও", body: "XP জেতো, স্ট্রিক ধরে রাখো আর ব্যাজ আনলক করো।" },
  ],
  aboutTitle: "আমাদের সম্পর্কে",
  aboutBody: [
    "MugoX Lingo খেলার ছলে ভাষা শেখার একটি বিনামূল্যের অ্যাপ। ছোট পাঠ, ফ্ল্যাশকার্ড, স্পিড রাউন্ড ও ইউনিট পরীক্ষা দিনে কয়েক মিনিটেই তোমার শব্দভান্ডার ও শোনার দক্ষতা বাড়ায়।",
    "তুমি অতিথি হিসেবে এখনই শুরু করতে পারো। অ্যাকাউন্ট শুধু সব ডিভাইসে তোমার অগ্রগতি সংরক্ষণ করে। এখনকার কোর্স: ইংরেজিভাষীদের জন্য স্প্যানিশ, চীনা (ম্যান্ডারিন), জাপানি, কোরিয়ান ও বাংলা, আর বাংলা, হিন্দি, আরবি, স্প্যানিশ, ফরাসি, পর্তুগিজ, চীনা, জাপানি ও কোরিয়ানভাষীদের জন্য ইংরেজি।",
    "পাঠ আমরা নিজেরাই লিখি এবং পাঠকদের জানানো ভুল শুধরে নিই। প্রশ্ন বা সংশোধনের জন্য যোগাযোগ পেজ দেখো। সাইটটি কয়েকটি বিষয়বস্তুর পেজে বিজ্ঞাপনের মাধ্যমে চলে; পাঠের ভেতরে কোনো বিজ্ঞাপন নেই।",
  ],
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
  draft: "খসড়া লেখা। চালুর আগে যাচাই করিয়ে নাও।",
  privacyTitle: "গোপনীয়তা",
  privacyBody: [
    "অতিথি: তোমার অগ্রগতি তোমার ডিভাইসের এই ব্রাউজারে (লোকাল স্টোরেজে) থাকে। অ্যাকাউন্ট খুলে নিজে আমদানি না করলে আমরা তা পাই না।",
    "অ্যাকাউন্ট: Neon ব্যবহার করে তোমার ইমেইল, প্রদর্শন নাম, ভাষার সেটিংস ও শেখার অগ্রগতি রাখা হয়। লগ ইন ধরে রাখতে একটি সেশন কুকি ব্যবহার হয়।",
    "অ্যাকাউন্ট পেজ থেকে কোর্স রিসেট করা যায়। অ্যাকাউন্ট বা ডেটা মুছতে যোগাযোগ পেজ ব্যবহার করো।",
    "অ্যানালিটিক্স: তুমি রাজি হলেই কেবল আমরা কতজন আসছে ও পাঠে কী করছে তা গুনতে Google Analytics ব্যবহার করি। এতে নাম বা ইমেইল যায় না। এটি mgxl উপসর্গের কুকি ব্যবহার করে, আর ফুটারের কুকি সেটিংসে গিয়ে যেকোনো সময় সিদ্ধান্ত বদলানো যায়।",
    "বিজ্ঞাপন: তুমি রাজি হলে আমরা কয়েকটি বিষয়বস্তুর পেজে Google AdSense-এর বিজ্ঞাপন দেখাই, পাঠের ভেতরে কখনো নয়। Google ও তার অংশীদাররা এই ও অন্যান্য ওয়েবসাইটে তোমার ভিজিটের ভিত্তিতে বিজ্ঞাপন দেখাতে কুকি ব্যবহার করে। আমরা ডিফল্টভাবে ব্যক্তিগতকৃত নয় এমন বিজ্ঞাপন চাই। ব্যক্তিগতকৃত বিজ্ঞাপন সম্পর্কে adssettings.google.com বা aboutads.info-তে জানতে ও তা বন্ধ করতে পারো, আর পেজের নিচের “কুকি সেটিংস” থেকে যেকোনো সময় সিদ্ধান্ত বদলাতে পারো।",
  ],
  termsTitle: "শর্তাবলি",
  termsBody: [
    "মুগোএক্স একটি শেখার অ্যাপ, যেমন আছে তেমন দেওয়া হয়। পাঠে ভুল থাকতে পারে, পেলে জানিও।",
    "অগ্রগতি, XP বা অন্যের ডেটায় কারসাজির চেষ্টা কোরো না। যারা করবে তাদের অ্যাকাউন্ট সীমিত বা বন্ধ হতে পারে।",
    "অ্যাকাউন্ট ১৩ বছর বা তার বেশি বয়সীদের জন্য। ছোট শিক্ষার্থীরা অভিভাবকের সঙ্গে অতিথি মোড ব্যবহার করবে।",
  ],
  contactTitle: "যোগাযোগ", contactBody: "আমাদের লিখো:", contactMissing: "যোগাযোগের ঠিকানা এখনো ঠিক করা হয়নি।",
};
export const siteStrings = buildStrings<SiteUi>(en, { bn }, (p) => p.site);
