"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { procesarCSV } from "@/services/upload.service";

export function UploadButton() {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error(`"${file.name}" no es un archivo CSV`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const { rows } = await procesarCSV(file);
      toast.success(`${rows} órdenes cargadas`);
      router.refresh();
    } catch (err: any) {
      toast.error(`Error al subir: ${err?.message || String(err)}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <label className="relative inline-flex items-center gap-2 px-3 py-2 border border-border-mid rounded-md text-sm text-body hover:text-main hover:bg-hover cursor-pointer transition-colors">
      <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
      {uploading ? "Procesando..." : "Subir CSV"}
    </label>
  );
}
