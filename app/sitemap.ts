// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getNoticias } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.poder57tv.com";

  const noticias = await getNoticias();

  const noticiasUrls = noticias.map((n) => ({
    url: `${baseUrl}/noticias/${n.id}`,
    lastModified: n.date?.toDate?.() ?? new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
    },
    ...noticiasUrls,
  ];
}
