"use client";

import Link from "next/link";

type Props = {
  videos: any[];
  isLive?: boolean;
};

export default function VideoGrid({ videos, isLive = false }: Props) {
  return (
    <div
      className={`grid gap-5 ${
        isLive
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {videos.map((v, index) => {
        const videoId =
          typeof v.id === "string" ? v.id : v.id?.videoId;

        if (!videoId || !v.snippet) return null;

        const title = v.snippet.title ?? "Sin título";
        const thumb =
          v.snippet.thumbnails?.high?.url ??
          v.snippet.thumbnails?.medium?.url ??
          v.snippet.thumbnails?.default?.url ??
          "";

        return (
          <Link
            key={videoId || index}
            href={`/video/${videoId}`}
            className="group bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-red-600/40 hover:scale-[1.03] transition-all duration-300"
          >
            {/* THUMB */}
            <div className="relative">
              {isLive && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  🔴 EN VIVO
                </span>
              )}

              <img
                src={thumb}
                alt={title}
                className="w-full h-44 object-cover"
              />
            </div>

            {/* TEXTO */}
            <div className="p-3">
              <h3 className="text-sm font-semibold line-clamp-2">
                {title}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
