"use client";

import { useState } from "react";

export default function VideoGrid({ videos, isLive = false }: any) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((v: any, index: number) => {
          // Normalización para evitar errores
          const videoId =
            v.id?.videoId ||
            v.id ||
            (typeof v.id === "string" ? v.id : "") ||
            "";

          const snippet = v.snippet || {};
          const title = snippet.title || "Sin título";
          const thumb =
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            "https://via.placeholder.com/480x360?text=Sin+Miniatura";

          return (
            <article
              key={videoId || index}
              className="bg-gray-900 rounded overflow-hidden cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedVideo(videoId)}
            >
              <img src={thumb} alt={title} className="w-full h-44 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
                {isLive && (
                  <span className="text-red-500 text-xs font-bold">🔴 En vivo</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="bg-black rounded-lg w-full max-w-3xl">
            <iframe
              className="w-full aspect-video rounded-lg"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}
    </section>
  );
}
