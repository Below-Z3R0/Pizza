import type { ParagraphProps } from "../types";

export function Paragraph({ txt, className }: ParagraphProps) {
  return (
    <p className={`text-dim font-sans font-light text-[16px] md:text-lg text-left leading-relaxed ${className ?? ""}`}>
      {txt}
    </p>
  );
}
