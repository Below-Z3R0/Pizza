"use client";

import { Settings2 } from "lucide-react";
import { Tabs } from "@/components/ui";
import { useRouter } from "next/navigation";
import type { MetodoProyeccion } from "@/lib/data";

const metodos: { id: MetodoProyeccion; label: string }[] = [
  { id: "mediana", label: "Mediana" },
  { id: "media_movil", label: "Media móvil (3sem)" },
  { id: "media_ponderada", label: "Ponderada" },
];

export function MethodSelector({ actual }: { actual: MetodoProyeccion }) {
  const router = useRouter();

  return (
    <>
      <Settings2 className="size-4 text-muted" />
      <Tabs
        items={metodos}
        active={actual}
        onChange={(id) => router.push(`/?metodo=${id}`)}
      />
    </>
  );
}
