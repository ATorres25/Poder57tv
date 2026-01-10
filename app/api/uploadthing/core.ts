// app/api/uploadthing/core.ts
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  newsImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Aquí puedes validar auth si quieres más adelante
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.url,
      };
    }),
};

export type OurFileRouter = typeof ourFileRouter;
