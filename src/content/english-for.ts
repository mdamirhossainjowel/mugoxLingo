import type { Course } from "@/types/course";
import { vocabLesson, type Prompts } from "./generate";

/** English courses for speakers of each interface language. The English words are shared; each language adds its own meanings and instructions. */
const TERMS = {
  greetings: ["Hello", "Goodbye", "Thank you", "Please", "Good morning"],
  numbers: ["One", "Two", "Three", "Four", "Five"],
  colors: ["Red", "Blue", "Green", "Yellow", "Black"],
  family: ["Mother", "Father", "Brother", "Sister", "Friend"],
  food: ["Water", "Bread", "Milk", "Egg", "Apple"],
  animals: ["Dog", "Cat", "Bird", "Cow", "Horse"],
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
} as const;
type Topic = keyof typeof TERMS;
const UNITS: Topic[][] = [["greetings", "numbers"], ["colors", "family"], ["food", "animals", "days"]];

interface Pack {
  code: string; title: string; units: [string, string, string]; prompts: Prompts;
  lessons: Record<Topic, { title: string; objective: string; meanings: readonly string[] }>;
}

function build(p: Pack): Course {
  return {
    id: `${p.code}-en`, from: p.code, to: "en", ttsLang: "en-US", title: p.title, status: "full",
    units: UNITS.map((topics, ui) => ({
      id: `${p.code}en-u${ui + 1}`, title: p.units[ui],
      lessons: topics.map((t) => vocabLesson({
        id: `${p.code}en-${t}-1`, title: p.lessons[t].title, objective: p.lessons[t].objective, prompts: p.prompts, lang: "en-US", more: true,
        vocab: TERMS[t].map((term, i) => ({ term, meaning: p.lessons[t].meanings[i] })),
      })),
    })),
  };
}

const hi: Pack = {
  code: "hi", title: "अंग्रेज़ी सीखें · हिन्दी बोलने वालों के लिए", units: ["पहले शब्द", "रंग और लोग", "खाना, जानवर और दिन"],
  prompts: {
    meaningOf: (t) => `“${t}” का हिन्दी में क्या अर्थ है?`, sayIt: (m) => `“${m}” को अंग्रेज़ी में क्या कहते हैं?`, listen: "सुनिए। आपने कौन-सा शब्द सुना?", match: "अंग्रेज़ी शब्दों को उनके अर्थ से मिलाएँ",
    translate: (_t, m) => ({ prompt: `अंग्रेज़ी में अनुवाद करें: ${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "अभिवादन", objective: "नमस्ते, धन्यवाद और अलविदा अंग्रेज़ी में कहना सीखें।", meanings: ["नमस्ते", "अलविदा", "धन्यवाद", "कृपया", "सुप्रभात"] },
    numbers: { title: "संख्याएँ 1 से 5", objective: "एक से पाँच तक अंग्रेज़ी में गिनना सीखें।", meanings: ["एक", "दो", "तीन", "चार", "पाँच"] },
    colors: { title: "रंग", objective: "मुख्य रंगों के अंग्रेज़ी नाम सीखें।", meanings: ["लाल", "नीला", "हरा", "पीला", "काला"] },
    family: { title: "परिवार और दोस्त", objective: "परिवार के सदस्यों के अंग्रेज़ी नाम सीखें।", meanings: ["माँ", "पिता", "भाई", "बहन", "दोस्त"] },
    food: { title: "खाना-पीना", objective: "रोज़मर्रा की चीज़ों के अंग्रेज़ी नाम सीखें।", meanings: ["पानी", "रोटी", "दूध", "अंडा", "सेब"] },
    animals: { title: "जानवर", objective: "जाने-पहचाने जानवरों के अंग्रेज़ी नाम सीखें।", meanings: ["कुत्ता", "बिल्ली", "चिड़िया", "गाय", "घोड़ा"] },
    days: { title: "हफ़्ते के दिन", objective: "सोमवार से शुक्रवार तक अंग्रेज़ी में कहना सीखें।", meanings: ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार"] },
  },
};

const ar: Pack = {
  code: "ar", title: "تعلّم الإنجليزية · لمتحدثي العربية", units: ["الكلمات الأولى", "الألوان والأشخاص", "الطعام والحيوانات والأيام"],
  prompts: {
    meaningOf: (t) => `ما معنى «${t}» بالعربية؟`, sayIt: (m) => `كيف تقول «${m}» بالإنجليزية؟`, listen: "استمع. ما الكلمة التي سمعتها؟", match: "طابق الكلمات الإنجليزية مع معانيها",
    translate: (_t, m) => ({ prompt: `ترجم إلى الإنجليزية: ${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "التحيات", objective: "تعلّم قول مرحبًا وشكرًا ووداعًا بالإنجليزية.", meanings: ["مرحبًا", "وداعًا", "شكرًا", "من فضلك", "صباح الخير"] },
    numbers: { title: "الأعداد من 1 إلى 5", objective: "تعلّم العدّ من واحد إلى خمسة بالإنجليزية.", meanings: ["واحد", "اثنان", "ثلاثة", "أربعة", "خمسة"] },
    colors: { title: "الألوان", objective: "تعلّم أسماء الألوان الأساسية بالإنجليزية.", meanings: ["أحمر", "أزرق", "أخضر", "أصفر", "أسود"] },
    family: { title: "العائلة والأصدقاء", objective: "تعلّم أسماء أفراد العائلة بالإنجليزية.", meanings: ["أم", "أب", "أخ", "أخت", "صديق"] },
    food: { title: "الطعام والشراب", objective: "تعلّم أسماء الأشياء اليومية بالإنجليزية.", meanings: ["ماء", "خبز", "حليب", "بيضة", "تفاحة"] },
    animals: { title: "الحيوانات", objective: "تعلّم أسماء الحيوانات المألوفة بالإنجليزية.", meanings: ["كلب", "قطة", "طائر", "بقرة", "حصان"] },
    days: { title: "أيام الأسبوع", objective: "تعلّم قول الإثنين إلى الجمعة بالإنجليزية.", meanings: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"] },
  },
};

const es: Pack = {
  code: "es", title: "Aprende inglés · para hispanohablantes", units: ["Primeras palabras", "Colores y personas", "Comida, animales y días"],
  prompts: {
    meaningOf: (t) => `¿Qué significa «${t}» en español?`, sayIt: (m) => `¿Cómo se dice «${m}» en inglés?`, listen: "Escucha. ¿Qué palabra oíste?", match: "Empareja cada palabra en inglés con su significado",
    translate: (_t, m) => ({ prompt: `Traduce al inglés: ${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "Saludos", objective: "Aprende a decir hola, gracias y adiós en inglés.", meanings: ["Hola", "Adiós", "Gracias", "Por favor", "Buenos días"] },
    numbers: { title: "Números del 1 al 5", objective: "Aprende a contar del uno al cinco en inglés.", meanings: ["Uno", "Dos", "Tres", "Cuatro", "Cinco"] },
    colors: { title: "Colores", objective: "Aprende los nombres de los colores básicos en inglés.", meanings: ["Rojo", "Azul", "Verde", "Amarillo", "Negro"] },
    family: { title: "Familia y amigos", objective: "Aprende los nombres de los familiares en inglés.", meanings: ["Madre", "Padre", "Hermano", "Hermana", "Amigo"] },
    food: { title: "Comida y bebida", objective: "Aprende los nombres de cosas de todos los días en inglés.", meanings: ["Agua", "Pan", "Leche", "Huevo", "Manzana"] },
    animals: { title: "Animales", objective: "Aprende los nombres de animales conocidos en inglés.", meanings: ["Perro", "Gato", "Pájaro", "Vaca", "Caballo"] },
    days: { title: "Días de la semana", objective: "Aprende a decir de lunes a viernes en inglés.", meanings: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
  },
};

const fr: Pack = {
  code: "fr", title: "Apprends l'anglais · pour francophones", units: ["Premiers mots", "Couleurs et personnes", "Nourriture, animaux et jours"],
  prompts: {
    meaningOf: (t) => `Que signifie « ${t} » en français ?`, sayIt: (m) => `Comment dit-on « ${m} » en anglais ?`, listen: "Écoute. Quel mot as-tu entendu ?", match: "Associe chaque mot anglais à son sens",
    translate: (_t, m) => ({ prompt: `Traduis en anglais : ${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "Salutations", objective: "Apprends à dire bonjour, merci et au revoir en anglais.", meanings: ["Salut", "Au revoir", "Merci", "S'il te plaît", "Bonjour"] },
    numbers: { title: "Nombres de 1 à 5", objective: "Apprends à compter de un à cinq en anglais.", meanings: ["Un", "Deux", "Trois", "Quatre", "Cinq"] },
    colors: { title: "Couleurs", objective: "Apprends les noms des couleurs de base en anglais.", meanings: ["Rouge", "Bleu", "Vert", "Jaune", "Noir"] },
    family: { title: "Famille et amis", objective: "Apprends les noms des membres de la famille en anglais.", meanings: ["Mère", "Père", "Frère", "Sœur", "Ami"] },
    food: { title: "Nourriture et boisson", objective: "Apprends les noms d'objets du quotidien en anglais.", meanings: ["Eau", "Pain", "Lait", "Œuf", "Pomme"] },
    animals: { title: "Animaux", objective: "Apprends les noms d'animaux courants en anglais.", meanings: ["Chien", "Chat", "Oiseau", "Vache", "Cheval"] },
    days: { title: "Jours de la semaine", objective: "Apprends à dire de lundi à vendredi en anglais.", meanings: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"] },
  },
};

const pt: Pack = {
  code: "pt", title: "Aprenda inglês · para falantes de português", units: ["Primeiras palavras", "Cores e pessoas", "Comida, animais e dias"],
  prompts: {
    meaningOf: (t) => `O que significa “${t}” em português?`, sayIt: (m) => `Como se diz “${m}” em inglês?`, listen: "Ouça. Qual palavra você ouviu?", match: "Associe cada palavra em inglês ao seu significado",
    translate: (_t, m) => ({ prompt: `Traduza para o inglês: ${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "Cumprimentos", objective: "Aprenda a dizer olá, obrigado e tchau em inglês.", meanings: ["Olá", "Tchau", "Obrigado", "Por favor", "Bom dia"] },
    numbers: { title: "Números de 1 a 5", objective: "Aprenda a contar de um a cinco em inglês.", meanings: ["Um", "Dois", "Três", "Quatro", "Cinco"] },
    colors: { title: "Cores", objective: "Aprenda os nomes das cores básicas em inglês.", meanings: ["Vermelho", "Azul", "Verde", "Amarelo", "Preto"] },
    family: { title: "Família e amigos", objective: "Aprenda os nomes dos familiares em inglês.", meanings: ["Mãe", "Pai", "Irmão", "Irmã", "Amigo"] },
    food: { title: "Comida e bebida", objective: "Aprenda os nomes de coisas do dia a dia em inglês.", meanings: ["Água", "Pão", "Leite", "Ovo", "Maçã"] },
    animals: { title: "Animais", objective: "Aprenda os nomes de animais conhecidos em inglês.", meanings: ["Cachorro", "Gato", "Pássaro", "Vaca", "Cavalo"] },
    days: { title: "Dias da semana", objective: "Aprenda a dizer de segunda a sexta em inglês.", meanings: ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"] },
  },
};

const zh: Pack = {
  code: "zh", title: "学英语 · 面向中文使用者", units: ["第一批单词", "颜色与人物", "食物、动物和星期"],
  prompts: {
    meaningOf: (t) => `“${t}”用中文怎么说？`, sayIt: (m) => `“${m}”用英语怎么说？`, listen: "听一听。你听到的是哪个词？", match: "把英语单词和它的意思配对",
    translate: (_t, m) => ({ prompt: `翻译成英语：${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "问候语", objective: "学会用英语说你好、谢谢和再见。", meanings: ["你好", "再见", "谢谢", "请", "早上好"] },
    numbers: { title: "数字 1 到 5", objective: "学会用英语从一数到五。", meanings: ["一", "二", "三", "四", "五"] },
    colors: { title: "颜色", objective: "学习基本颜色的英语说法。", meanings: ["红色", "蓝色", "绿色", "黄色", "黑色"] },
    family: { title: "家人和朋友", objective: "学习家庭成员的英语说法。", meanings: ["妈妈", "爸爸", "兄弟", "姐妹", "朋友"] },
    food: { title: "饮食", objective: "学习日常物品的英语说法。", meanings: ["水", "面包", "牛奶", "鸡蛋", "苹果"] },
    animals: { title: "动物", objective: "学习常见动物的英语说法。", meanings: ["狗", "猫", "鸟", "牛", "马"] },
    days: { title: "星期", objective: "学会用英语说星期一到星期五。", meanings: ["星期一", "星期二", "星期三", "星期四", "星期五"] },
  },
};

const ja: Pack = {
  code: "ja", title: "英語を学ぶ · 日本語話者向け", units: ["はじめの単語", "色と人", "食べ物・動物・曜日"],
  prompts: {
    meaningOf: (t) => `「${t}」は日本語で何といいますか？`, sayIt: (m) => `「${m}」は英語で何といいますか？`, listen: "聞いてください。どの単語が聞こえましたか？", match: "英単語と意味を結びましょう",
    translate: (_t, m) => ({ prompt: `英語に訳しましょう：${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "あいさつ", objective: "こんにちは・ありがとう・さようならを英語で言えるようになりましょう。", meanings: ["こんにちは", "さようなら", "ありがとう", "お願いします", "おはよう"] },
    numbers: { title: "数字 1〜5", objective: "1から5まで英語で数えましょう。", meanings: ["一", "二", "三", "四", "五"] },
    colors: { title: "色", objective: "基本の色の英語名を学びましょう。", meanings: ["赤", "青", "緑", "黄色", "黒"] },
    family: { title: "家族と友だち", objective: "家族の英語名を学びましょう。", meanings: ["母", "父", "兄弟", "姉妹", "友だち"] },
    food: { title: "食べ物と飲み物", objective: "身近なものの英語名を学びましょう。", meanings: ["水", "パン", "牛乳", "卵", "りんご"] },
    animals: { title: "動物", objective: "身近な動物の英語名を学びましょう。", meanings: ["犬", "猫", "鳥", "牛", "馬"] },
    days: { title: "曜日", objective: "月曜日から金曜日までを英語で言えるようになりましょう。", meanings: ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"] },
  },
};

const ko: Pack = {
  code: "ko", title: "영어 배우기 · 한국어 사용자용", units: ["첫 단어", "색깔과 사람들", "음식, 동물, 요일"],
  prompts: {
    meaningOf: (t) => `“${t}”는 한국어로 무슨 뜻일까요?`, sayIt: (m) => `“${m}”는 영어로 어떻게 말할까요?`, listen: "들어 보세요. 어떤 단어가 들렸나요?", match: "영어 단어와 뜻을 짝지어 보세요",
    translate: (_t, m) => ({ prompt: `영어로 번역하세요: ${m}`, accepted: "term" }),
  },
  lessons: {
    greetings: { title: "인사말", objective: "안녕, 고마워, 잘 가를 영어로 말해 보세요.", meanings: ["안녕하세요", "안녕히 가세요", "감사합니다", "부탁합니다", "좋은 아침"] },
    numbers: { title: "숫자 1~5", objective: "1부터 5까지 영어로 세어 보세요.", meanings: ["하나", "둘", "셋", "넷", "다섯"] },
    colors: { title: "색깔", objective: "기본 색깔의 영어 이름을 배워요.", meanings: ["빨강", "파랑", "초록", "노랑", "검정"] },
    family: { title: "가족과 친구", objective: "가족 구성원의 영어 이름을 배워요.", meanings: ["어머니", "아버지", "형제", "자매", "친구"] },
    food: { title: "음식과 음료", objective: "일상 속 물건의 영어 이름을 배워요.", meanings: ["물", "빵", "우유", "달걀", "사과"] },
    animals: { title: "동물", objective: "익숙한 동물의 영어 이름을 배워요.", meanings: ["개", "고양이", "새", "소", "말"] },
    days: { title: "요일", objective: "월요일부터 금요일까지 영어로 말해 보세요.", meanings: ["월요일", "화요일", "수요일", "목요일", "금요일"] },
  },
};

export const englishForCourses: Course[] = [hi, ar, es, fr, pt, zh, ja, ko].map(build);
