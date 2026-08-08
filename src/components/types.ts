import type { ReactNode } from "react";

// ============================================
// 1. THEME
// ============================================
export type Theme = "dark" | "light";

// ============================================
// 2. ATOMS (Typography)
// ============================================
export interface TitleProps {
  txt: string;
  className?: string;
}

export interface SpanProps extends TitleProps {
  children?: ReactNode;
}

export interface ParagraphProps {
  txt: string;
  className?: string;
}

export interface MiniTitleProps {
  content: string;
}

// ============================================
// 3. ANIMATIONS
// ============================================
export interface AnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// ============================================
// 4. NAVIGATION
// ============================================
export interface LinkItem {
  id: string;
  name: string;
}

export interface NavBarContent {
  button: string;
  links: LinkItem[];
}

export interface NavBarProps {
  initialData: NavBarContent | null;
}

// ============================================
// 5. FOOTER
// ============================================
export interface FooterData {
  description: string;
  eslogan: string;
  legal: string;
  email: string;
  links: LinkItem[];
}

export interface FooterProps {
  data: FooterData | null;
}
