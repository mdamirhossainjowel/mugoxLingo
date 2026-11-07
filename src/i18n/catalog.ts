import type { Locale } from "./config";

/** Lesson topics. Course, unit and lesson titles are built from these, so every language shows them in its own words. */
export const TOPIC_KEYS = [
  "greetings", "meeting", "numbers_1_5", "numbers_6_10", "colors", "family", "food", "animals", "days", "places", "phrases", "verbs", "time", "shopping",
  "tones", "intro", "first_words", "people", "kana_vowels", "kana_k", "kana_s", "kana_t", "hangul_vowels", "hangul_consonants",
] as const;
export type TopicKey = (typeof TOPIC_KEYS)[number];

export interface Catalog {
  courseLabel: string;
  /** Uses {target} and {source}, for example "{target} for {source} speakers". */
  courseTitle: string;
  /** Instruction templates for exercises. {x} is the word or phrase. */
  prompts: { sound: string; soundLike: string; meaning: string; say: string; translate: string; match: string; matchSound: string; listen: string; pronounce: string };
  topics: Record<TopicKey, string>;
}
const T = (a: string[]): Record<TopicKey, string> => Object.fromEntries(TOPIC_KEYS.map((k, i) => [k, a[i]])) as Record<TopicKey, string>;

export const catalogs: Record<Locale, Catalog> = {
  en: { courseLabel: "Course", courseTitle: "{target} for {source} speakers",
    prompts: { sound: "What sound does “{x}” make?", soundLike: "Which one sounds like “{x}”?", meaning: "What does “{x}” mean?", say: "How do you say “{x}”?", translate: "Translate: {x}", match: "Match each word to its meaning", matchSound: "Match each one to its sound", listen: "Listen. What did you hear?", pronounce: "Type the pronunciation of {x}." },
    topics: T(["Greetings", "Meeting people", "Numbers 1 to 5", "Numbers 6 to 10", "Colors", "Family and friends", "Food and drink", "Animals", "Days of the week", "Places", "Useful phrases", "Everyday verbs", "Time and days", "Shopping", "The four tones", "Introducing yourself", "First words", "People", "Hiragana vowels", "The K row", "The S row", "The T row", "Hangul vowels", "Hangul consonants"]) },
  bn: { courseLabel: "কোর্স", courseTitle: "{source}ভাষীদের জন্য {target}",
    prompts: { sound: "“{x}” কী ধ্বনি করে?", soundLike: "কোনটি “{x}”-এর মতো শোনায়?", meaning: "“{x}” মানে কী?", say: "“{x}” কীভাবে বলে?", translate: "অনুবাদ করো: {x}", match: "শব্দের সঙ্গে তার অর্থ মেলাও", matchSound: "প্রতিটিকে তার উচ্চারণের সঙ্গে মেলাও", listen: "শোনো। কী শুনলে?", pronounce: "{x}-এর উচ্চারণ লেখো।" },
    topics: T(["অভিবাদন", "মানুষের সঙ্গে পরিচয়", "সংখ্যা ১ থেকে ৫", "সংখ্যা ৬ থেকে ১০", "রং", "পরিবার ও বন্ধু", "খাবার ও পানীয়", "প্রাণী", "সপ্তাহের দিন", "জায়গা", "দরকারি বাক্য", "রোজকার ক্রিয়া", "সময় ও দিন", "কেনাকাটা", "চার টোন", "নিজের পরিচয়", "প্রথম শব্দ", "মানুষ", "হিরাগানা স্বরবর্ণ", "K-সারি", "S-সারি", "T-সারি", "হাঙ্গুল স্বরবর্ণ", "হাঙ্গুল ব্যঞ্জনবর্ণ"]) },
  es: { courseLabel: "Curso", courseTitle: "{target} para hablantes de {source}",
    prompts: { sound: "¿Qué sonido hace «{x}»?", soundLike: "¿Cuál suena como «{x}»?", meaning: "¿Qué significa «{x}»?", say: "¿Cómo se dice «{x}»?", translate: "Traduce: {x}", match: "Empareja cada palabra con su significado", matchSound: "Empareja cada uno con su sonido", listen: "Escucha. ¿Qué oíste?", pronounce: "Escribe la pronunciación de {x}." },
    topics: T(["Saludos", "Conocer gente", "Números del 1 al 5", "Números del 6 al 10", "Colores", "Familia y amigos", "Comida y bebida", "Animales", "Días de la semana", "Lugares", "Frases útiles", "Verbos cotidianos", "Tiempo y días", "Compras", "Los cuatro tonos", "Presentarte", "Primeras palabras", "Personas", "Vocales hiragana", "La fila K", "La fila S", "La fila T", "Vocales hangul", "Consonantes hangul"]) },
  zh: { courseLabel: "课程", courseTitle: "面向{source}使用者的{target}",
    prompts: { sound: "“{x}”读什么音？", soundLike: "哪个听起来像“{x}”？", meaning: "“{x}”是什么意思？", say: "“{x}”怎么说？", translate: "翻译：{x}", match: "把每个词和它的意思配对", matchSound: "把每个符号和它的读音配对", listen: "听一听。你听到了什么？", pronounce: "输入 {x} 的读音。" },
    topics: T(["问候", "认识新朋友", "数字 1 到 5", "数字 6 到 10", "颜色", "家人和朋友", "饮食", "动物", "星期", "地点", "常用语", "日常动词", "时间和日期", "购物", "四个声调", "自我介绍", "第一批单词", "人物", "平假名元音", "K 行", "S 行", "T 行", "韩文元音", "韩文辅音"]) },
  ja: { courseLabel: "コース", courseTitle: "{source}話者向けの{target}",
    prompts: { sound: "「{x}」はどんな音ですか？", soundLike: "「{x}」のように聞こえるのはどれですか？", meaning: "「{x}」はどういう意味ですか？", say: "「{x}」はどう言いますか？", translate: "翻訳しましょう：{x}", match: "それぞれの言葉と意味を結びましょう", matchSound: "それぞれの文字と音を結びましょう", listen: "聞いてください。何が聞こえましたか？", pronounce: "{x} の発音を入力しましょう。" },
    topics: T(["あいさつ", "人と出会う", "数字 1〜5", "数字 6〜10", "色", "家族と友だち", "食べ物と飲み物", "動物", "曜日", "場所", "便利なフレーズ", "毎日の動詞", "時間と日付", "買い物", "4つの声調", "自己紹介", "はじめの単語", "人", "ひらがなの母音", "か行", "さ行", "た行", "ハングルの母音", "ハングルの子音"]) },
  ko: { courseLabel: "코스", courseTitle: "{source} 사용자를 위한 {target}",
    prompts: { sound: "“{x}”는 어떤 소리일까요?", soundLike: "“{x}” 소리가 나는 것은 무엇일까요?", meaning: "“{x}”는 무슨 뜻일까요?", say: "“{x}”는 어떻게 말할까요?", translate: "번역하세요: {x}", match: "각 단어를 뜻과 짝지어 보세요", matchSound: "각 글자를 소리와 짝지어 보세요", listen: "들어 보세요. 무엇이 들렸나요?", pronounce: "{x}의 발음을 입력하세요." },
    topics: T(["인사말", "사람 만나기", "숫자 1~5", "숫자 6~10", "색깔", "가족과 친구", "음식과 음료", "동물", "요일", "장소", "유용한 표현", "일상 동사", "시간과 요일", "쇼핑", "4가지 성조", "자기소개", "첫 단어", "사람", "히라가나 모음", "K 행", "S 행", "T 행", "한글 모음", "한글 자음"]) },
  hi: { courseLabel: "कोर्स", courseTitle: "{source} बोलने वालों के लिए {target}",
    prompts: { sound: "“{x}” की ध्वनि क्या है?", soundLike: "कौन-सा “{x}” जैसा सुनाई देता है?", meaning: "“{x}” का क्या अर्थ है?", say: "“{x}” कैसे कहते हैं?", translate: "अनुवाद करें: {x}", match: "हर शब्द को उसके अर्थ से मिलाएँ", matchSound: "हर अक्षर को उसकी ध्वनि से मिलाएँ", listen: "सुनिए। आपने क्या सुना?", pronounce: "{x} का उच्चारण लिखें।" },
    topics: T(["अभिवादन", "लोगों से मिलना", "संख्याएँ 1 से 5", "संख्याएँ 6 से 10", "रंग", "परिवार और दोस्त", "खाना-पीना", "जानवर", "हफ़्ते के दिन", "जगहें", "काम के वाक्य", "रोज़ के क्रिया-शब्द", "समय और दिन", "खरीदारी", "चार टोन", "अपना परिचय", "पहले शब्द", "लोग", "हिरागाना स्वर", "K पंक्ति", "S पंक्ति", "T पंक्ति", "हंगुल स्वर", "हंगुल व्यंजन"]) },
  ar: { courseLabel: "الدورة", courseTitle: "{target} لمتحدثي {source}",
    prompts: { sound: "ما صوت «{x}»؟", soundLike: "أيّها يُنطق مثل «{x}»؟", meaning: "ما معنى «{x}»؟", say: "كيف تقول «{x}»؟", translate: "ترجم: {x}", match: "طابق كل كلمة مع معناها", matchSound: "طابق كل حرف مع صوته", listen: "استمع. ماذا سمعت؟", pronounce: "اكتب نطق {x}." },
    topics: T(["التحيات", "التعرّف على الناس", "الأعداد من 1 إلى 5", "الأعداد من 6 إلى 10", "الألوان", "العائلة والأصدقاء", "الطعام والشراب", "الحيوانات", "أيام الأسبوع", "الأماكن", "عبارات مفيدة", "أفعال يومية", "الوقت والأيام", "التسوّق", "النغمات الأربع", "تقديم نفسك", "الكلمات الأولى", "الأشخاص", "حروف العلة الهيراغانا", "صف K", "صف S", "صف T", "حروف العلة الهانغول", "الحروف الساكنة الهانغول"]) },
  fr: { courseLabel: "Cours", courseTitle: "{target} pour les locuteurs de {source}",
    prompts: { sound: "Quel son fait « {x} » ?", soundLike: "Lequel sonne comme « {x} » ?", meaning: "Que signifie « {x} » ?", say: "Comment dit-on « {x} » ?", translate: "Traduis : {x}", match: "Associe chaque mot à son sens", matchSound: "Associe chacun à son son", listen: "Écoute. Qu'as-tu entendu ?", pronounce: "Écris la prononciation de {x}." },
    topics: T(["Salutations", "Faire connaissance", "Nombres de 1 à 5", "Nombres de 6 à 10", "Couleurs", "Famille et amis", "Nourriture et boisson", "Animaux", "Jours de la semaine", "Lieux", "Phrases utiles", "Verbes du quotidien", "Heure et jours", "Achats", "Les quatre tons", "Se présenter", "Premiers mots", "Personnes", "Voyelles hiragana", "La rangée K", "La rangée S", "La rangée T", "Voyelles hangeul", "Consonnes hangeul"]) },
  pt: { courseLabel: "Curso", courseTitle: "{target} para falantes de {source}",
    prompts: { sound: "Que som faz “{x}”?", soundLike: "Qual soa como “{x}”?", meaning: "O que significa “{x}”?", say: "Como se diz “{x}”?", translate: "Traduza: {x}", match: "Associe cada palavra ao seu significado", matchSound: "Associe cada um ao seu som", listen: "Ouça. O que você ouviu?", pronounce: "Digite a pronúncia de {x}." },
    topics: T(["Cumprimentos", "Conhecer pessoas", "Números de 1 a 5", "Números de 6 a 10", "Cores", "Família e amigos", "Comida e bebida", "Animais", "Dias da semana", "Lugares", "Frases úteis", "Verbos do dia a dia", "Tempo e dias", "Compras", "Os quatro tons", "Apresentar-se", "Primeiras palavras", "Pessoas", "Vogais hiragana", "A linha K", "A linha S", "A linha T", "Vogais hangul", "Consoantes hangul"]) },
};
