/**
 * Public learning guides: original explanations with vocabulary and pronunciation, readable without signing in.
 * A guide is published only in languages that have a real, reviewed version. Today that is English.
 * To add a language, translate the guides carefully, list the language in GUIDE_LOCALES, and the pages, hreflang and sitemap follow.
 */
export const GUIDE_LOCALES = ["en"] as const;
export const GUIDES_UPDATED = "2026-11-12";

export interface GuideSection { heading: string; paragraphs?: string[]; list?: string[]; table?: { caption: string; head: string[]; rows: string[][] } }
export interface Guide {
  slug: string; title: string; description: string;
  /** Where the matching interactive lesson lives, as courseId/lessonId. */
  practice: { course: string; lesson: string; label: string };
  sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: "mandarin-tones-and-pinyin",
    title: "Mandarin tones and pinyin for beginners",
    description: "Learn how pinyin works and how the four Mandarin tones sound, with examples, common tone changes and simple practice tips.",
    practice: { course: "en-zh", lesson: "zh-tones-1", label: "Practise the four tones in an interactive lesson" },
    sections: [
      { heading: "What pinyin is", paragraphs: [
        "Pinyin is the standard way to write Mandarin sounds with the Latin alphabet. Learners use it to read and say words long before they know the characters.",
        "A pinyin syllable has an initial (the starting consonant, such as b, zh or x), a final (the vowel part, such as a, ing or uo) and a tone mark written above the main vowel." ] },
      { heading: "The four tones and the neutral tone", paragraphs: ["Mandarin uses pitch to tell words apart. The syllable “ma” changes meaning with each tone."],
        table: { caption: "The tones of the syllable ma", head: ["Tone", "Mark", "How it sounds", "Example"], rows: [
          ["1st", "ā", "High and level", "mā 妈 (mother)"], ["2nd", "á", "Rising, like asking “what?”", "má 麻 (hemp)"],
          ["3rd", "ǎ", "Falls, then rises a little", "mǎ 马 (horse)"], ["4th", "à", "A short, sharp fall", "mà 骂 (to scold)"],
          ["Neutral", "none", "Light and short", "ma 吗 (question particle)"] ] } },
      { heading: "Why tones matter", paragraphs: [
        "A wrong tone can turn one word into another: mā means mother and mǎ means horse. Native speakers use context to forgive small mistakes, but clear tones make you much easier to understand.",
        "Learn words as whole units with their tones, not isolated syllables. Say 谢谢 xièxie as one word with a falling tone and a light second syllable." ] },
      { heading: "Tone changes you will hear", list: [
        "Two third tones in a row: the first becomes rising. 你好 is written nǐ hǎo but said like ní hǎo.",
        "不 (bù, “not”) becomes bú before a fourth tone: 不客气 bú kèqi (you are welcome). This change is written in pinyin.",
        "A syllable after another often loses its tone and becomes light, as in 妈妈 māma." ] },
      { heading: "Common first words", table: { caption: "Everyday words with pinyin", head: ["Chinese", "Pinyin", "Meaning"], rows: [
        ["你好", "nǐ hǎo", "hello"], ["谢谢", "xièxie", "thank you"], ["再见", "zàijiàn", "goodbye"], ["对不起", "duìbuqǐ", "sorry"], ["没关系", "méi guānxi", "it is okay"] ] } },
      { heading: "Practice tips", list: [
        "Listen first, then repeat slowly. Trace the tone shape in the air with your hand.",
        "Record yourself and compare it with a recording or a voice you trust.",
        "Practise pairs such as mā and má until you can hear the difference.",
        "Review a few words every day instead of many words once a week." ] },
    ],
  },
  {
    slug: "japanese-hiragana-basics",
    title: "Hiragana basics: reading your first Japanese sounds",
    description: "A beginner's guide to hiragana: how Japanese writing fits together, the five vowels, the K row, reading rules and your first words.",
    practice: { course: "en-ja", lesson: "ja-hiragana-1", label: "Practise the hiragana vowels in an interactive lesson" },
    sections: [
      { heading: "Three writing systems", paragraphs: [
        "Japanese is written with three scripts used together. Hiragana writes native words and grammar. Katakana mostly writes foreign words and names. Kanji are characters of Chinese origin that carry meaning.",
        "Beginners start with hiragana: 46 basic characters, each standing for one sound. Once you can read hiragana you can read the pronunciation of any Japanese word." ] },
      { heading: "The five vowels", paragraphs: ["Japanese has five vowels and each one always sounds the same."],
        table: { caption: "Hiragana vowels", head: ["Kana", "Romaji", "Sounds like"], rows: [
          ["あ", "a", "a in “father”"], ["い", "i", "ee in “see”, but shorter"], ["う", "u", "oo in “moon”, with relaxed lips"], ["え", "e", "e in “bed”"], ["お", "o", "o in “more”, but shorter"] ] } },
      { heading: "The K row", paragraphs: ["Add the consonant k to each vowel and you get the next five sounds."],
        table: { caption: "The K row", head: ["Kana", "Romaji"], rows: [["か", "ka"], ["き", "ki"], ["く", "ku"], ["け", "ke"], ["こ", "ko"]] } },
      { heading: "Reading rules to remember", list: [
        "Each kana is one beat of equal length. Say こ-こ-ろ as three beats.",
        "Some rows have spellings you cannot guess from the pattern: し is shi, ち is chi and つ is tsu.",
        "Long vowels last two beats, as in おとうさん (otōsan, father), which has a long ō.",
        "は is read wa and を is read o when they act as grammar particles." ] },
      { heading: "Your first words", table: { caption: "Words made from the kana above", head: ["Japanese", "Romaji", "Meaning"], rows: [
        ["あい", "ai", "love"], ["いえ", "ie", "house"], ["うえ", "ue", "up, above"], ["かお", "kao", "face"], ["いけ", "ike", "pond"] ] } },
      { heading: "How to practise", list: [
        "Learn one row at a time and write each character by hand a few times.",
        "Say the sounds out loud while you read them.",
        "Read short words before moving on to the next row." ] },
    ],
  },
  {
    slug: "korean-hangul-basics",
    title: "Korean Hangul basics: how the alphabet works",
    description: "Understand how Hangul syllable blocks are built, the basic vowels and consonants, the silent ㅇ and your first Korean words.",
    practice: { course: "en-ko", lesson: "ko-hangul-1", label: "Practise the basic vowels in an interactive lesson" },
    sections: [
      { heading: "An alphabet built for learning", paragraphs: [
        "Hangul is the Korean alphabet, created in the 15th century. Its letters are consonants and vowels, so most learners can read it after a short study.",
        "Letters are not written in a line. They are grouped into square syllable blocks: a consonant, a vowel and sometimes a final consonant. For example 한 is ㅎ + ㅏ + ㄴ, read han." ] },
      { heading: "The silent ㅇ", paragraphs: ["Every block starts with a consonant. When a syllable begins with a vowel sound, the circle ㅇ holds the place and is silent: 아 is simply a. At the end of a block ㅇ sounds like ng, as in 방 bang."] },
      { heading: "Basic vowels", table: { caption: "Basic vowels written with the silent ㅇ", head: ["Block", "Romanization", "Sounds like"], rows: [
        ["아", "a", "a in “father”"], ["어", "eo", "o in “son”"], ["오", "o", "o in “go”"], ["우", "u", "oo in “moon”"], ["으", "eu", "the vowel in “book”, with flat lips"], ["이", "i", "ee in “see”"] ] } },
      { heading: "First consonants", table: { caption: "Consonants with the vowel ㅏ", head: ["Block", "Romanization"], rows: [["가", "ga"], ["나", "na"], ["다", "da"], ["마", "ma"], ["바", "ba"], ["사", "sa"]] },
        paragraphs: ["Some consonants change a little by position: ㄱ sounds like g at the start of a word and closer to k at the end, ㄷ like d or t, and ㅂ like b or p."] },
      { heading: "Words you can already read", table: { caption: "Beginner words", head: ["Korean", "Romanization", "Meaning"], rows: [
        ["아이", "ai", "child"], ["우유", "uyu", "milk"], ["나무", "namu", "tree"], ["바다", "bada", "sea"], ["사과", "sagwa", "apple"], ["안녕하세요", "annyeonghaseyo", "hello"], ["감사합니다", "gamsahamnida", "thank you"] ] } },
      { heading: "A note on romanization", paragraphs: ["The romanization on this page follows the Revised Romanization of Korean used on signs and in textbooks. It is only a guide: the Hangul spelling is the real writing, so try to read it as soon as you can."] },
    ],
  },
  {
    slug: "spanish-greetings-and-introductions",
    title: "Spanish greetings and introductions for beginners",
    description: "How to greet people, ask how they are, introduce yourself and choose between tú and usted in Spanish, with pronunciation tips.",
    practice: { course: "en-es", lesson: "es-greetings-1", label: "Practise Spanish greetings in an interactive lesson" },
    sections: [
      { heading: "Greeting at different times of day", table: { caption: "Common greetings", head: ["Spanish", "Meaning", "When to use it"], rows: [
        ["Hola", "Hello", "Any time"], ["Buenos días", "Good morning", "Until around midday"], ["Buenas tardes", "Good afternoon", "From midday until evening"], ["Buenas noches", "Good evening, good night", "In the evening and at night"], ["Adiós", "Goodbye", "When leaving"] ] } },
      { heading: "Asking how someone is", paragraphs: ["With friends and people your age use ¿Cómo estás? With elders, strangers or in formal situations use ¿Cómo está usted?"],
        list: ["Estoy bien, gracias. I am fine, thank you.", "Muy bien. Very well.", "Más o menos. So-so."] },
      { heading: "Introducing yourself", list: [
        "Me llamo Ana. My name is Ana.", "Mi nombre es Ana. My name is Ana.", "Soy Ana. I am Ana.", "Mucho gusto. Nice to meet you. Men can also say encantado and women encantada." ] },
      { heading: "Tú or usted?", paragraphs: [
        "Spanish has an informal “you” (tú) and a formal “you” (usted). Use tú with friends, family and children, and usted to show respect to people you do not know well or who are older. When unsure, listen to how others address you.",
        "Notice how the verb changes: tú eres (you are), usted es." ] },
      { heading: "Simple questions to ask next", list: [
        "¿De dónde eres? Where are you from?", "Soy de México. I am from Mexico.", "¿Hablas inglés? Do you speak English?", "Hablo un poco de español. I speak a little Spanish." ] },
      { heading: "Pronunciation tips", list: [
        "The five vowels a, e, i, o, u keep the same sound every time.",
        "The letter h is silent: hola sounds like “ola”.",
        "The letter ñ sounds like “ny” in “canyon”.",
        "An accent mark shows stress: días is DEE-as, not dee-AS.",
        "Spanish stress usually falls on the next-to-last syllable when a word ends in a vowel, n or s." ] },
    ],
  },
  {
    slug: "numbers-1-to-10-chinese-japanese-korean",
    title: "Numbers 1 to 10 in Chinese, Japanese and Korean",
    description: "Compare the numbers one to ten in Mandarin, Japanese and Korean, with pronunciation, number systems and lucky and unlucky numbers.",
    practice: { course: "en-zh", lesson: "zh-numbers-1", label: "Practise Chinese numbers in an interactive lesson" },
    sections: [
      { heading: "The numbers side by side", paragraphs: ["Chinese and Japanese write the numbers with the same characters but say them differently. Korean has its own writing, and the table shows the Sino-Korean numbers."],
        table: { caption: "Numbers 1 to 10", head: ["Number", "Chinese (pinyin)", "Japanese (romaji)", "Korean (romanization)"], rows: [
          ["1", "一 yī", "一 ichi", "일 il"], ["2", "二 èr", "二 ni", "이 i"], ["3", "三 sān", "三 san", "삼 sam"], ["4", "四 sì", "四 yon or shi", "사 sa"], ["5", "五 wǔ", "五 go", "오 o"],
          ["6", "六 liù", "六 roku", "육 yuk"], ["7", "七 qī", "七 nana or shichi", "칠 chil"], ["8", "八 bā", "八 hachi", "팔 pal"], ["9", "九 jiǔ", "九 kyū or ku", "구 gu"], ["10", "十 shí", "十 jū", "십 sip"] ] } },
      { heading: "Two number systems in Korean", paragraphs: [
        "Korean uses two sets of numbers. The Sino-Korean numbers in the table are used for dates, money, phone numbers and floors. Native Korean numbers (하나 hana, 둘 dul, 셋 set and so on) are used for counting things and for age.",
        "Learn the Sino-Korean set first: it is the one you will meet most often in daily life." ] },
      { heading: "Choices in Japanese", paragraphs: ["Japanese has more than one reading for some numbers. Four is often yon rather than shi, because shi also sounds like the word for death. Seven is often nana, which cannot be mistaken for ichi (one), and nine is often kyū because ku can also mean suffering."] },
      { heading: "Lucky and unlucky numbers", list: [
        "In Chinese, eight (bā) sounds like the word for getting rich, so it is considered lucky.",
        "Four (sì) sounds like the word for death (sǐ), so some buildings skip the fourth floor.",
        "The same idea about four appears in Japanese and Korean." ] },
      { heading: "Learning tips", list: [
        "Start with one to five, say each number aloud, then count objects around you.",
        "Notice the shared characters: 一, 二 and 三 are one, two and three lines.",
        "Practise the tones in Chinese numbers, especially sì and shí, which are easy to confuse." ] },
    ],
  },
];
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
