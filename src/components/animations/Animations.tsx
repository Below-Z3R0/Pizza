"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * FadeUp: animación estándar de entrada.
 * Desplaza desde abajo con fade-in.
 */
export function FadeUp({ children, delay = 0, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * MiniTitleAnimation: línea decorativa que se expande + título.
 */
export function MiniTitleAnimation({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: 28 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-px bg-accent"
      />
      {children}
    </div>
  );
}

/**
 * staggerContainer: variante para listas con stagger.
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
