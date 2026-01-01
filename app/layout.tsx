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
      <body className="relative bg-black text-white overflow-x-hidden">

        {/* 🌌 FONDO GLOW AZUL GLOBAL */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-poderblue/20 blur-[200px] animate-glow-float" />
          <div className="absolute top-[40%] left-[8%] w-[700px] h-[700px] rounded-full bg-poderblue/10 blur-[180px]" />
        </div>

        {/* HEADER */}
        <Header hasLive={hasLive} />

        {/* CONTENIDO */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>

      </body>
    </html>
  );
}
