// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  newsImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Imagen subida:", file.url);

      return {
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
