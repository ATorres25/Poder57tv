"use client";
import React, { useState } from "react";
import VideoModal from "@/components/VideoModal";

type Video = {
  id: { videoId?: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default: { url: string };
    };
  };
};

export default function HomeVideosClient({ videos }: { videos: Video[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((v) => {
          const id = v.id.videoId;
          if (!id) return null;

          return (
            <article key={id} className="bg-gray-900 rounded overflow-hidden">
              <button onClick={() => setCurrent(id)}>
                <img
                  src={
                    v.snippet.thumbnails.high?.url ??
                    v.snippet.thumbnails.medium?.url ??
                    v.snippet.thumbnails.default.url
                  }
                  alt={v.snippet.title}
                  className="w-full h-44 object-cover"
                />
              </button>

              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {v.snippet.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(v.snippet.publishedAt).toLocaleDateString("es-ES")}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* ✅ Render seguro: current NUNCA es null aquí */}
      {current && (
        <VideoModal
          videoId={current}
          onClose={() => setCurrent(null)}
        />
      )}
    </>
  );
}
