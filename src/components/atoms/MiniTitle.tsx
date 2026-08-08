import type { MiniTitleProps } from "../types";
import { Title2 } from "./Title2";

/**
 * MiniTitle: pequeño indicador sobre los títulos de sección.
 * Usa Title2 con estilos de acento.
 */
export function MiniTitle({ content }: MiniTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="h-px w-5 bg-accent" />
      <Title2 className="text-accent-light! uppercase text-sm! tracking-widest" txt={content} />
    </div>
  );
}
