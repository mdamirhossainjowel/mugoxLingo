import { buildStrings } from "./merge";

const en = {
  login: "Log in", signup: "Create account", logout: "Log out", account: "My account", email: "Email", password: "Password", displayName: "Your name",
  forgot: "Forgot password?", sendReset: "Send reset link", resetSent: "If that email has an account, a reset link is on its way.",
  checkEmail: "Check your email to confirm your account, then log in.", haveAccount: "Already have an account?", noAccount: "New here?",
  google: "Continue with Google", or: "or", notConfigured: "Accounts are not set up on this copy of MugoX yet. You can keep learning as a guest.",
  badLogin: "Wrong email or password.", genericError: "Something went wrong. Please try again.", rateLimited: "Too many tries. Wait a minute and try again.",
  passwordMin: "Use at least 8 characters.", emailInvalid: "Enter a valid email address.", newPassword: "New password", updatePassword: "Save new password",
  passwordUpdated: "Password updated.", syncTitle: "Keep your progress safe", syncBody: "Create a free account to sync your progress across devices.",
  importTitle: "Import progress from this device", importBody: "We found lessons you finished as a guest. Import them to your account?", importBtn: "Import progress",
  importDone: "lessons imported.", importNone: "Nothing new to import.", dismiss: "Not now",
  profile: "Profile", save: "Save", saved: "Saved.", interfaceLang: "Interface language", completedLessons: "Completed lessons", achievements: "Badges",
  noneYet: "Nothing here yet.", resetTitle: "Reset course progress", resetWarn: "This clears your lesson path for this course. Your XP and badges stay.",
  resetConfirm: "Yes, reset", cancel: "Cancel", resetDone: "Course progress reset.", continueCourse: "Continue course",
  loginRequired: "Log in to see your account.", orGuest: "Keep learning as a guest",
  currentPassword: "Current password", emailTaken: "That email already has an account.", wrongPassword: "Your current password is not correct.", changePassword: "Change password",
};
export type AuthUi = typeof en;
const bn: AuthUi = {
  login: "লগ ইন", signup: "অ্যাকাউন্ট খোলো", logout: "লগ আউট", account: "আমার অ্যাকাউন্ট", email: "ইমেইল", password: "পাসওয়ার্ড", displayName: "তোমার নাম",
  forgot: "পাসওয়ার্ড ভুলে গেছ?", sendReset: "রিসেট লিংক পাঠাও", resetSent: "ওই ইমেইলে অ্যাকাউন্ট থাকলে একটি রিসেট লিংক পাঠানো হয়েছে।",
  checkEmail: "অ্যাকাউন্ট নিশ্চিত করতে ইমেইল দেখো, তারপর লগ ইন করো।", haveAccount: "আগে থেকেই অ্যাকাউন্ট আছে?", noAccount: "নতুন?",
  google: "Google দিয়ে চালিয়ে যাও", or: "অথবা", notConfigured: "মুগোএক্সের এই কপিতে এখনো অ্যাকাউন্ট চালু করা হয়নি। তুমি অতিথি হিসেবে শিখতে পারো।",
  badLogin: "ইমেইল বা পাসওয়ার্ড ভুল।", genericError: "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করো।", rateLimited: "অনেকবার চেষ্টা হয়েছে। এক মিনিট পর আবার চেষ্টা করো।",
  passwordMin: "কমপক্ষে ৮টি অক্ষর দাও।", emailInvalid: "সঠিক ইমেইল ঠিকানা দাও।", newPassword: "নতুন পাসওয়ার্ড", updatePassword: "নতুন পাসওয়ার্ড সংরক্ষণ করো",
  passwordUpdated: "পাসওয়ার্ড বদলানো হয়েছে।", syncTitle: "অগ্রগতি নিরাপদ রাখো", syncBody: "বিনামূল্যে অ্যাকাউন্ট খুলে সব ডিভাইসে অগ্রগতি সিঙ্ক করো।",
  importTitle: "এই ডিভাইসের অগ্রগতি আনো", importBody: "অতিথি হিসেবে শেষ করা কিছু পাঠ পাওয়া গেছে। এগুলো অ্যাকাউন্টে আনবে?", importBtn: "অগ্রগতি আনো",
  importDone: "টি পাঠ আনা হয়েছে।", importNone: "আনার মতো নতুন কিছু নেই।", dismiss: "এখন নয়",
  profile: "প্রোফাইল", save: "সংরক্ষণ", saved: "সংরক্ষিত।", interfaceLang: "ইন্টারফেসের ভাষা", completedLessons: "সম্পন্ন পাঠ", achievements: "ব্যাজ",
  noneYet: "এখনো কিছু নেই।", resetTitle: "কোর্সের অগ্রগতি রিসেট", resetWarn: "এতে এই কোর্সের পাঠের পথ মুছে যাবে। তোমার XP ও ব্যাজ থাকবে।",
  resetConfirm: "হ্যাঁ, রিসেট করো", cancel: "বাতিল", resetDone: "কোর্সের অগ্রগতি রিসেট হয়েছে।", continueCourse: "কোর্স চালিয়ে যাও",
  loginRequired: "অ্যাকাউন্ট দেখতে লগ ইন করো।", orGuest: "অতিথি হিসেবে শেখা চালিয়ে যাও",
  currentPassword: "বর্তমান পাসওয়ার্ড", emailTaken: "এই ইমেইলে আগে থেকেই একটি অ্যাকাউন্ট আছে।", wrongPassword: "তোমার বর্তমান পাসওয়ার্ড সঠিক নয়।", changePassword: "পাসওয়ার্ড বদলাও",
};
export const authStrings = buildStrings<AuthUi>(en, { bn }, (p) => p.auth);
