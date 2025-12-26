"use client";

import { Share2, Copy } from "lucide-react";

type Props = {
  url: string;
};

export default function VideoActions({ url }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigator.share?.({ url })}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
      >
        <Share2 className="h-4 w-4" />
        Compartir
      </button>

      <button
        onClick={() => navigator.clipboard.writeText(url)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
      >
        <Copy className="h-4 w-4" />
        Copiar enlace
      </button>
    </div>
  );
}
