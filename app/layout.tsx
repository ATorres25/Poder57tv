import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { getLatestVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.poder57tv.com"),
  title: {
    default: "Poder57tv | La casa de los protagonistas",
    template: "%s | Poder57tv",
  },
  description:
    "Poder57tv: eventos deportivos, entrevistas, noticias y transmisiones en vivo.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const videos = await getLatestVideos(10);

  const hasLive = videos.some(
    (v: any) =>
      v?.snippet?.liveBroadcastContent === "live" ||
      (v?.liveStreamingDetails?.actualStartTime &&
        !v?.liveStreamingDetails?.actualEndTime)
  );

  return (
    <html lang="es">
      <body className="bg-black text-white">

        {/* HEADER GLOBAL */}
        <Header hasLive={hasLive} />

        {/* CONTENIDO */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>

      </body>
    </html>
  );
}
