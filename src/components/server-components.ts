// ============================================
// SERVER COMPONENTS BARREL
// ============================================
// Solo re-exporta Server Components (sin "use client").

// --- atoms ---
export * from "./atoms/Title1";
export * from "./atoms/Title2";
export * from "./atoms/Paragraph";
export * from "./atoms/Span";
export * from "./atoms/MiniTitle";

// --- ui (shadcn curado) ---
export * from "./ui-components";

// --- animations ---
export { FadeUp, MiniTitleAnimation, staggerContainer } from "./animations/Animations";
