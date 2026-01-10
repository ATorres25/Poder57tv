// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing({
  token: process.env.UPLOADTHING_TOKEN,
});

export const ourFileRouter = {
  newsImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // aquí puedes validar auth si quieres
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
