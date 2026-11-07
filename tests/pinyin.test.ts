import { describe, expect, it } from "vitest";
import { parseRich, plainText, speakable, splitSyllables, toneOf } from "@/lib/pinyin";

describe("pinyin syllables and tones", () => {
  it.each([
    ["nǐ hǎo", ["nǐ", "hǎo"]], ["xièxie", ["xiè", "xie"]], ["míngzi", ["míng", "zi"]], ["péngyou", ["péng", "you"]],
    ["hǎochī", ["hǎo", "chī"]], ["duìbuqǐ", ["duì", "bu", "qǐ"]], ["méi guānxi", ["méi", "guān", "xi"]], ["zàijiàn", ["zài", "jiàn"]],
    ["māma", ["mā", "ma"]], ["Zhōngguó", ["Zhōng", "guó"]], ["yí ge", ["yí", "ge"]], ["èr", ["èr"]], ["shénme", ["shén", "me"]], ["xiǎng", ["xiǎng"]],
    ["píngguǒ", ["píng", "guǒ"]], ["mǐfàn", ["mǐ", "fàn"]], ["gāoxìng", ["gāo", "xìng"]], ["rènshi", ["rèn", "shi"]], ["lǎoshī", ["lǎo", "shī"]],
  ])("splits %s", (p, expected) => expect(splitSyllables(p)).toEqual(expected));
  it("reads tones from the mark; no mark is neutral", () => {
    expect([toneOf("mā"), toneOf("má"), toneOf("mǎ"), toneOf("mà"), toneOf("ma")]).toEqual([1, 2, 3, 4, 0]);
    expect([toneOf("lǜ"), toneOf("nǚ"), toneOf("liù"), toneOf("jiǔ"), toneOf("qī")]).toEqual([4, 3, 4, 3, 1]);
  });
});

describe("rich text tokens", () => {
  const t = "What does “{你好|nǐ hǎo}” mean? {谢谢|xièxie}!";
  it("parses tokens and builds speech and plain forms", () => {
    expect(parseRich(t).filter((p) => typeof p !== "string")).toEqual([{ hanzi: "你好", pinyin: "nǐ hǎo" }, { hanzi: "谢谢", pinyin: "xièxie" }]);
    expect(speakable(t)).toBe("What does “你好” mean? 谢谢!");
    expect(plainText("{你好|nǐ hǎo}")).toBe("你好 (nǐ hǎo)");
    expect(speakable("Hola")).toBe("Hola");
  });
});
