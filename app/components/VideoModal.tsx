"use client";

import Link from "next/link";

type Props = {
  videoId: string;
};

export default function VideoModal({ videoId }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black p-4 rounded-xl w-full max-w-3xl shadow-2xl">
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />

        {/* CIERRE SIN onClick */}
        <Link
          href={`/video/${videoId}`}
          className="block mt-4 text-center bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded font-bold"
        >
          Ver en página completa
        </Link>
      </div>
    </div>
  );
}
