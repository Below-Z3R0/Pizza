import type { TitleProps } from "../types";

export function Title1({ txt, className }: TitleProps) {
  return (
    <h1 className={`text-main font-sans font-bold tracking-tight leading-[1.1] text-balance ${className ?? ""}`}>
      {txt}
    </h1>
  );
}
