import type { TitleProps } from "../types";

export function Span({ txt, className, children }: TitleProps & { children?: React.ReactNode }) {
  return (
    <span className={`text-main font-sans ${className ?? ""}`}>
      {txt}
      {children}
    </span>
  );
}
