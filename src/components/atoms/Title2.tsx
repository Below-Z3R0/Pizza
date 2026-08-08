import type { TitleProps } from "../types";

export function Title2({ txt, className }: TitleProps) {
  return (
    <h2 className={`text-main font-sans font-semibold leading-tight ${className ?? ""}`}>
      {txt}
    </h2>
  );
}
