import { UploadButton, UploadDropzone } from "@uploadthing/react";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/uploadthing", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error al subir imagen");
  }

  const data = await res.json();
  return data.url;
}
