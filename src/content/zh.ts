import type { Course } from "@/types/course";

/** `{汉字|pinyin}` token: rendered as ruby text with tone-coloured pinyin, spoken as the characters. */
const t = (hanzi: string, pinyin: string) => `{${hanzi}|${pinyin}}`;
const [ma1, ma2, ma3, ma4] = [t("妈", "mā"), t("麻", "má"), t("马", "mǎ"), t("骂", "mà")];

export const zhCourse: Course = {
  id: "en-zh", from: "en", to: "zh", ttsLang: "zh-CN", title: "Mandarin Chinese for English speakers", status: "full",
  units: [
    {
      id: "zh-u1", title: "Sounds and greetings",
      lessons: [
        {
          id: "zh-tones-1", title: "The four tones", objective: "Hear and say the four Mandarin tones.",
          vocab: [{ term: ma1, meaning: "Mother" }, { term: ma2, meaning: "Hemp" }, { term: ma3, meaning: "Horse" }, { term: ma4, meaning: "To scold" }],
          exercises: [
            { id: "zt-1", type: "mcq", prompt: `Which tone is ${ma1}?`, say: "妈", choices: ["1st tone: high and flat", "2nd tone: rising", "3rd tone: dip down, then up", "4th tone: sharp falling"], answer: 0,
              explain: "Mandarin has four tones plus a neutral tone. The same sound “ma” means different things in each tone." },
            { id: "zt-2", type: "mcq", prompt: `Which tone is ${ma4}?`, say: "骂", choices: ["1st tone: high and flat", "2nd tone: rising", "3rd tone: dip down, then up", "4th tone: sharp falling"], answer: 3 },
            { id: "zt-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "马", lang: "zh-CN", choices: [ma1, ma2, ma3, ma4], answer: 2 },
            { id: "zt-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: ma1, right: "Mother" }, { left: ma2, right: "Hemp" }, { left: ma3, right: "Horse" }, { left: ma4, right: "To scold" }] },
            { id: "zt-5", type: "mcq", prompt: `What does “${ma3}” mean?`, choices: ["Horse", "Mother", "Hemp", "To scold"], answer: 0, explain: "The 3rd tone is the lowest of the four. Picture your voice dipping, then rising a little." },
            { id: "zt-6", type: "translate", prompt: "Type the pinyin for 妈 (mother).", accepted: ["mā"] },
            { id: "zt-7", type: "mcq", prompt: "How does the 3rd tone move?", choices: ["High and flat", "It rises", "It dips low, then rises", "It falls sharply"], answer: 2 },
          ],
        },
        {
          id: "zh-greetings-1", title: "Hello and thanks", objective: "Greet people, say thanks and say sorry.",
          vocab: [
            { term: t("你好", "nǐ hǎo"), meaning: "Hello" }, { term: t("谢谢", "xièxie"), meaning: "Thank you" }, { term: t("不客气", "bú kèqi"), meaning: "You're welcome" },
            { term: t("再见", "zàijiàn"), meaning: "Goodbye" }, { term: t("对不起", "duìbuqǐ"), meaning: "Sorry" }, { term: t("没关系", "méi guānxi"), meaning: "It's okay" },
          ],
          exercises: [
            { id: "zg-1", type: "mcq", prompt: `What does “${t("你好", "nǐ hǎo")}” mean?`, choices: ["Hello", "Goodbye", "Thank you", "Sorry"], answer: 0,
              explain: "Said quickly, 你好 sounds like “ní hǎo”: when two 3rd tones meet, the first one rises. Books still write nǐ hǎo." },
            { id: "zg-2", type: "mcq", prompt: "How do you say “Thank you”?", choices: [t("谢谢", "xièxie"), t("再见", "zàijiàn"), t("对不起", "duìbuqǐ"), t("你好", "nǐ hǎo")], answer: 0 },
            { id: "zg-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "再见", lang: "zh-CN", choices: [t("你好", "nǐ hǎo"), t("谢谢", "xièxie"), t("再见", "zàijiàn"), t("对不起", "duìbuqǐ")], answer: 2 },
            { id: "zg-4", type: "match", prompt: "Match each word to its meaning", pairs: [
              { left: t("你好", "nǐ hǎo"), right: "Hello" }, { left: t("谢谢", "xièxie"), right: "Thank you" }, { left: t("再见", "zàijiàn"), right: "Goodbye" }, { left: t("对不起", "duìbuqǐ"), right: "Sorry" }] },
            { id: "zg-5", type: "fill", prompt: "Hello", before: t("你", "nǐ"), after: "!", choices: [t("好", "hǎo"), t("谢", "xiè"), t("见", "jiàn")], answer: 0 },
            { id: "zg-6", type: "build", prompt: "Translate: Hello, thank you", tiles: [t("你好", "nǐ hǎo"), t("谢谢", "xièxie"), t("再见", "zàijiàn")], answer: [t("你好", "nǐ hǎo"), t("谢谢", "xièxie")] },
            { id: "zg-7", type: "translate", prompt: "Translate: Goodbye", accepted: ["再见", "zàijiàn", "zài jiàn"] },
            { id: "zg-8", type: "mcq", prompt: "What do you say after someone thanks you?", choices: [t("不客气", "bú kèqi"), t("对不起", "duìbuqǐ"), t("再见", "zàijiàn"), t("你好", "nǐ hǎo")], answer: 0,
              explain: "不 is normally bù, but before a 4th tone it becomes bú. That is why it is written bú kèqi." },
          ],
        },
      ],
    },
    {
      id: "zh-u2", title: "About me",
      lessons: [
        {
          id: "zh-intro-1", title: "Introducing yourself", objective: "Say who you are and ask someone's name.",
          vocab: [
            { term: t("我", "wǒ"), meaning: "I, me" }, { term: t("你", "nǐ"), meaning: "You" }, { term: t("叫", "jiào"), meaning: "To be called" },
            { term: t("名字", "míngzi"), meaning: "Name" }, { term: t("什么", "shénme"), meaning: "What" }, { term: t("老师", "lǎoshī"), meaning: "Teacher" },
          ],
          exercises: [
            { id: "zi-1", type: "mcq", prompt: `What does “${t("名字", "míngzi")}” mean?`, choices: ["Name", "Teacher", "Friend", "Home"], answer: 0 },
            { id: "zi-2", type: "mcq", prompt: "How do you say “I”?", choices: [t("我", "wǒ"), t("你", "nǐ"), t("他", "tā"), t("叫", "jiào")], answer: 0, explain: "Chinese has no capital letters or spaces between words. 我 (wǒ) means I or me." },
            { id: "zi-3", type: "match", prompt: "Match each word to its meaning", pairs: [
              { left: t("我", "wǒ"), right: "I, me" }, { left: t("你", "nǐ"), right: "You" }, { left: t("名字", "míngzi"), right: "Name" }, { left: t("老师", "lǎoshī"), right: "Teacher" }] },
            { id: "zi-4", type: "fill", prompt: "What is your name?", before: t("你", "nǐ"), after: `${t("什么", "shénme")}${t("名字", "míngzi")}?`, choices: [t("叫", "jiào"), t("是", "shì"), t("好", "hǎo")], answer: 0 },
            { id: "zi-5", type: "build", prompt: "Translate: My name is Xiaoming", tiles: [t("我", "wǒ"), t("叫", "jiào"), t("小明", "xiǎo míng"), t("你", "nǐ"), t("是", "shì")], answer: [t("我", "wǒ"), t("叫", "jiào"), t("小明", "xiǎo míng")] },
            { id: "zi-6", type: "translate", prompt: "Translate: Teacher", accepted: ["老师", "lǎoshī", "lǎo shī"] },
            { id: "zi-7", type: "mcq", prompt: `What does “${t("你叫什么名字", "nǐ jiào shénme míngzi")}” mean?`, choices: ["What is your name?", "How are you?", "Where are you from?", "Nice to meet you."], answer: 0 },
          ],
        },
        {
          id: "zh-family-1", title: "Family and friends", objective: "Name your family members and friends.",
          vocab: [
            { term: t("妈妈", "māma"), meaning: "Mom" }, { term: t("爸爸", "bàba"), meaning: "Dad" }, { term: t("哥哥", "gēge"), meaning: "Older brother" },
            { term: t("姐姐", "jiějie"), meaning: "Older sister" }, { term: t("朋友", "péngyou"), meaning: "Friend" }, { term: t("家", "jiā"), meaning: "Home, family" },
          ],
          exercises: [
            { id: "zf-1", type: "mcq", prompt: `What does “${t("妈妈", "māma")}” mean?`, choices: ["Mom", "Dad", "Sister", "Friend"], answer: 0, explain: "Doubled sounds like māma and bàba are common for family words. The second syllable is light (neutral tone)." },
            { id: "zf-2", type: "mcq", prompt: "How do you say “Dad”?", choices: [t("妈妈", "māma"), t("爸爸", "bàba"), t("哥哥", "gēge"), t("朋友", "péngyou")], answer: 1 },
            { id: "zf-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "姐姐", lang: "zh-CN", choices: ["Older brother", "Older sister", "Friend", "Mom"], answer: 1 },
            { id: "zf-4", type: "match", prompt: "Match each word to its meaning", pairs: [
              { left: t("妈妈", "māma"), right: "Mom" }, { left: t("爸爸", "bàba"), right: "Dad" }, { left: t("哥哥", "gēge"), right: "Older brother" }, { left: t("朋友", "péngyou"), right: "Friend" }] },
            { id: "zf-5", type: "fill", prompt: "I love my family", before: `${t("我", "wǒ")}${t("爱", "ài")}${t("我的", "wǒ de")}`, after: "", choices: [t("家", "jiā"), t("水", "shuǐ"), t("茶", "chá")], answer: 0,
              explain: "爱 (ài) means love, and 的 (de) shows ownership, like “my”." },
            { id: "zf-6", type: "build", prompt: "Translate: I have a friend", tiles: [t("我", "wǒ"), t("有", "yǒu"), t("一个", "yí ge"), t("朋友", "péngyou"), t("爸爸", "bàba")], answer: [t("我", "wǒ"), t("有", "yǒu"), t("一个", "yí ge"), t("朋友", "péngyou")] },
            { id: "zf-7", type: "translate", prompt: "Translate: Mom", accepted: ["妈妈", "māma", "mā ma"] },
          ],
        },
      ],
    },
    {
      id: "zh-u3", title: "Numbers",
      lessons: [
        {
          id: "zh-numbers-1", title: "Numbers 1 to 5", objective: "Count from one to five.",
          vocab: [{ term: t("一", "yī"), meaning: "One" }, { term: t("二", "èr"), meaning: "Two" }, { term: t("三", "sān"), meaning: "Three" }, { term: t("四", "sì"), meaning: "Four" }, { term: t("五", "wǔ"), meaning: "Five" }],
          exercises: [
            { id: "zn1-1", type: "mcq", prompt: `What does “${t("三", "sān")}” mean?`, choices: ["Three", "Four", "Five", "Two"], answer: 0, explain: "二 and 三 are easy to remember: they are two and three horizontal lines." },
            { id: "zn1-2", type: "mcq", prompt: "How do you say “Five”?", choices: [t("四", "sì"), t("五", "wǔ"), t("二", "èr"), t("一", "yī")], answer: 1 },
            { id: "zn1-3", type: "listen", prompt: "Listen. Which number did you hear?", say: "四", lang: "zh-CN", choices: [t("三", "sān"), t("四", "sì"), t("五", "wǔ"), t("二", "èr")], answer: 1 },
            { id: "zn1-4", type: "match", prompt: "Match each number", pairs: [{ left: t("一", "yī"), right: "One" }, { left: t("二", "èr"), right: "Two" }, { left: t("三", "sān"), right: "Three" }, { left: t("五", "wǔ"), right: "Five" }] },
            { id: "zn1-5", type: "fill", prompt: "One, two, three", before: `${t("一", "yī")}、${t("二", "èr")}、`, after: "", choices: [t("三", "sān"), t("四", "sì"), t("五", "wǔ")], answer: 0 },
            { id: "zn1-6", type: "build", prompt: "Translate: one, two, three", tiles: [t("一", "yī"), t("二", "èr"), t("三", "sān"), t("四", "sì")], answer: [t("一", "yī"), t("二", "èr"), t("三", "sān")] },
            { id: "zn1-7", type: "translate", prompt: "Translate: Four", accepted: ["四", "sì"] },
          ],
        },
        {
          id: "zh-numbers-2", title: "Numbers 6 to 10", objective: "Count from six to ten.",
          vocab: [{ term: t("六", "liù"), meaning: "Six" }, { term: t("七", "qī"), meaning: "Seven" }, { term: t("八", "bā"), meaning: "Eight" }, { term: t("九", "jiǔ"), meaning: "Nine" }, { term: t("十", "shí"), meaning: "Ten" }],
          exercises: [
            { id: "zn2-1", type: "mcq", prompt: `What does “${t("八", "bā")}” mean?`, choices: ["Eight", "Six", "Seven", "Nine"], answer: 0, explain: "In Chinese culture 八 (eight) is lucky, because it sounds like the word for getting rich." },
            { id: "zn2-2", type: "mcq", prompt: "How do you say “Ten”?", choices: [t("九", "jiǔ"), t("十", "shí"), t("六", "liù"), t("七", "qī")], answer: 1 },
            { id: "zn2-3", type: "listen", prompt: "Listen. Which number did you hear?", say: "七", lang: "zh-CN", choices: [t("六", "liù"), t("七", "qī"), t("八", "bā"), t("九", "jiǔ")], answer: 1 },
            { id: "zn2-4", type: "match", prompt: "Match each number", pairs: [{ left: t("六", "liù"), right: "Six" }, { left: t("七", "qī"), right: "Seven" }, { left: t("八", "bā"), right: "Eight" }, { left: t("九", "jiǔ"), right: "Nine" }] },
            { id: "zn2-5", type: "fill", prompt: "Nine, ten", before: `${t("九", "jiǔ")}、`, after: "", choices: [t("十", "shí"), t("六", "liù"), t("七", "qī")], answer: 0 },
            { id: "zn2-6", type: "build", prompt: "Translate: seven, eight, nine", tiles: [t("七", "qī"), t("八", "bā"), t("九", "jiǔ"), t("十", "shí"), t("六", "liù")], answer: [t("七", "qī"), t("八", "bā"), t("九", "jiǔ")] },
            { id: "zn2-7", type: "translate", prompt: "Translate: Ten", accepted: ["十", "shí"] },
          ],
        },
      ],
    },
    {
      id: "zh-u4", title: "Food and drink",
      lessons: [{
        id: "zh-food-1", title: "Tea, rice and fruit", objective: "Name common foods and say what you want to drink.",
        vocab: [
          { term: t("水", "shuǐ"), meaning: "Water" }, { term: t("茶", "chá"), meaning: "Tea" }, { term: t("米饭", "mǐfàn"), meaning: "Rice" },
          { term: t("苹果", "píngguǒ"), meaning: "Apple" }, { term: t("好吃", "hǎochī"), meaning: "Delicious" }, { term: t("喝", "hē"), meaning: "To drink" },
        ],
        exercises: [
          { id: "zd-1", type: "mcq", prompt: `What does “${t("茶", "chá")}” mean?`, choices: ["Tea", "Water", "Rice", "Apple"], answer: 0, explain: "Tea comes from China, and many languages borrowed the word from Chinese." },
          { id: "zd-2", type: "mcq", prompt: "How do you say “Water”?", choices: [t("茶", "chá"), t("水", "shuǐ"), t("米饭", "mǐfàn"), t("苹果", "píngguǒ")], answer: 1 },
          { id: "zd-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "水", lang: "zh-CN", choices: ["Tea", "Water", "Rice", "Apple"], answer: 1 },
          { id: "zd-4", type: "match", prompt: "Match each word to its meaning", pairs: [
            { left: t("水", "shuǐ"), right: "Water" }, { left: t("茶", "chá"), right: "Tea" }, { left: t("米饭", "mǐfàn"), right: "Rice" }, { left: t("苹果", "píngguǒ"), right: "Apple" }] },
          { id: "zd-5", type: "fill", prompt: "I want to drink water", before: `${t("我", "wǒ")}${t("想", "xiǎng")}${t("喝", "hē")}`, after: "", choices: [t("水", "shuǐ"), t("米饭", "mǐfàn"), t("苹果", "píngguǒ")], answer: 0,
            explain: "想 (xiǎng) means “want to”, followed by a verb." },
          { id: "zd-6", type: "build", prompt: "Translate: I want to drink tea", tiles: [t("我", "wǒ"), t("想", "xiǎng"), t("喝", "hē"), t("茶", "chá"), t("水", "shuǐ")], answer: [t("我", "wǒ"), t("想", "xiǎng"), t("喝", "hē"), t("茶", "chá")] },
          { id: "zd-7", type: "translate", prompt: "Translate: Delicious", accepted: ["好吃", "hǎochī", "hǎo chī"] },
        ],
      }],
    },
    {
      id: "zh-u5", title: "Daily life",
      lessons: [
        {
          id: "zh-time-1", title: "Today and tomorrow", objective: "Talk about today, tomorrow and the time of day.",
          vocab: [{ term: t("今天", "jīntiān"), meaning: "Today" }, { term: t("明天", "míngtiān"), meaning: "Tomorrow" }, { term: t("现在", "xiànzài"), meaning: "Now" }, { term: t("早上", "zǎoshang"), meaning: "Morning" }, { term: t("星期一", "xīngqīyī"), meaning: "Monday" }],
          exercises: [
            { id: "zs-1", type: "mcq", prompt: `What does “${t("今天", "jīntiān")}” mean?`, choices: ["Today", "Tomorrow", "Now", "Morning"], answer: 0, explain: "天 (tiān) means day or sky, so 今天 is literally “this day”." },
            { id: "zs-2", type: "mcq", prompt: "How do you say “Tomorrow”?", choices: [t("今天", "jīntiān"), t("明天", "míngtiān"), t("现在", "xiànzài"), t("早上", "zǎoshang")], answer: 1 },
            { id: "zs-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "现在", lang: "zh-CN", choices: ["Today", "Tomorrow", "Now", "Morning"], answer: 2 },
            { id: "zs-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: t("今天", "jīntiān"), right: "Today" }, { left: t("明天", "míngtiān"), right: "Tomorrow" }, { left: t("现在", "xiànzài"), right: "Now" }, { left: t("早上", "zǎoshang"), right: "Morning" }] },
            { id: "zs-5", type: "fill", prompt: "Good morning", before: t("早上", "zǎoshang"), after: "!", choices: [t("好", "hǎo"), t("谢", "xiè"), t("见", "jiàn")], answer: 0 },
            { id: "zs-6", type: "build", prompt: "Translate: Today is Monday", tiles: [t("今天", "jīntiān"), t("星期一", "xīngqīyī"), t("明天", "míngtiān"), t("现在", "xiànzài")], answer: [t("今天", "jīntiān"), t("星期一", "xīngqīyī")], explain: "Days of the week are 星期 plus a number. 星期一 is Monday." },
            { id: "zs-7", type: "translate", prompt: "Translate: Tomorrow", accepted: ["明天", "míngtiān", "míng tiān"] },
          ],
        },
        {
          id: "zh-shopping-1", title: "Shopping", objective: "Ask the price and say if something is cheap or expensive.",
          vocab: [{ term: t("钱", "qián"), meaning: "Money" }, { term: t("买", "mǎi"), meaning: "To buy" }, { term: t("多少钱", "duōshao qián"), meaning: "How much is it?" }, { term: t("太贵了", "tài guì le"), meaning: "Too expensive" }, { term: t("便宜", "piányi"), meaning: "Cheap" }],
          exercises: [
            { id: "sh-1", type: "mcq", prompt: `What does “${t("多少钱", "duōshao qián")}” mean?`, choices: ["How much is it?", "What is your name?", "Where is it?", "Is it delicious?"], answer: 0 },
            { id: "sh-2", type: "mcq", prompt: "How do you say “Money”?", choices: [t("买", "mǎi"), t("钱", "qián"), t("便宜", "piányi"), t("太贵了", "tài guì le")], answer: 1 },
            { id: "sh-3", type: "listen", prompt: "Listen. Which word did you hear?", say: "便宜", lang: "zh-CN", choices: ["Money", "To buy", "Too expensive", "Cheap"], answer: 3 },
            { id: "sh-4", type: "match", prompt: "Match each word to its meaning", pairs: [{ left: t("钱", "qián"), right: "Money" }, { left: t("买", "mǎi"), right: "To buy" }, { left: t("太贵了", "tài guì le"), right: "Too expensive" }, { left: t("便宜", "piányi"), right: "Cheap" }] },
            { id: "sh-5", type: "fill", prompt: "Too expensive", before: t("太", "tài"), after: t("了", "le"), choices: [t("贵", "guì"), t("好", "hǎo"), t("买", "mǎi")], answer: 0, explain: "贵 (guì) means expensive. The pattern 太…了 means “too …”." },
            { id: "sh-6", type: "build", prompt: "Translate: I want to buy an apple", tiles: [t("我", "wǒ"), t("想", "xiǎng"), t("买", "mǎi"), t("苹果", "píngguǒ"), t("水", "shuǐ")], answer: [t("我", "wǒ"), t("想", "xiǎng"), t("买", "mǎi"), t("苹果", "píngguǒ")] },
            { id: "sh-7", type: "translate", prompt: "Translate: Cheap", accepted: ["便宜", "piányi", "pián yi"] },
          ],
        },
      ],
    },
  ],
};
