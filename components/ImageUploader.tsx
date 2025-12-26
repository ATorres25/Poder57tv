"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function ImageUploader({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <UploadButton<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res[0]?.url) {
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Error subiendo la imagen: ${error.message}`);
        }}
      />

      <p className="text-sm text-gray-400">Formatos: JPG, PNG — Máx. 4MB</p>
    </div>
  );
}
