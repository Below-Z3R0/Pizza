"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { MetodosInfoDialog } from "./MetodosInfoDialog";

export function InfoButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="p-1.5 rounded-full text-muted hover:text-main hover:bg-hover transition-colors" aria-label="Info">
        <HelpCircle className="size-4" />
      </button>
      <MetodosInfoDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
