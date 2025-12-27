"use client";

import { UploadButton } from "@uploadthing/react";

export default function ImageUploader({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  const UTButton = UploadButton as any;

  return (
    <div className="flex flex-col gap-3">
      <UTButton
        endpoint="imageUploader"
        onClientUploadComplete={(res: any[]) => {
          if (res && res[0]?.url) {
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Error subiendo la imagen: ${error.message}`);
        }}
      />

      <p className="text-sm text-gray-400">
        Formatos: JPG, PNG — Máx. 4MB
      </p>
    </div>
  );
}
