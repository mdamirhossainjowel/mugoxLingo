import { parseRich, scriptLang, splitSyllables, toneOf, TONE_COLORS } from "@/lib/pinyin";

function Syl({ s }: { s: string }) { return <span style={{ color: TONE_COLORS[toneOf(s)] }}>{s}</span>; }

/** Renders `{汉字|pinyin}` tokens as ruby text with tone-coloured pinyin; plain strings pass through. */
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const parts = parseRich(text);
  if (parts.length === 1 && typeof parts[0] === "string") return <span lang={scriptLang(text)} className={className}>{text}</span>;
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (typeof p === "string") return <span key={i} lang={scriptLang(p)}>{p}</span>;
        if (p.kind && p.kind !== "zh") return <ruby key={i} lang={p.kind} className="mx-0.5">{p.hanzi}<rt className="pinyin" style={{ color: TONE_COLORS[0] }}>{p.pinyin}</rt></ruby>;
        const chars = [...p.hanzi]; const syl = splitSyllables(p.pinyin);
        return (
          <ruby key={i} lang="zh-Hans" className="mx-0.5">
            {syl.length === chars.length
              ? chars.map((c, k) => <span key={k}>{c}<rt className="pinyin"><Syl s={syl[k]} /></rt></span>)
              : <>{p.hanzi}<rt className="pinyin">{syl.map((s, k) => <Syl key={k} s={s} />)}</rt></>}
          </ruby>);
      })}
    </span>);
}
