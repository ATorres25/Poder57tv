"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Noticia = {
  id: string;
  title: string;
  image: string;
  contentHtml: string;
  date?: any;
};

type Props = {
  noticias: Noticia[];
};

export default function NoticiasCarousel({ noticias }: Props) {
  const visible = 3;
  const total = noticias.length;
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, total - visible));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative">

      {/* FLECHA IZQUIERDA */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10
                   bg-black/70 hover:bg-black text-white rounded-full
                   w-10 h-10 flex items-center justify-center
                   disabled:opacity-30"
      >
        ‹
      </button>

      {/* FLECHA DERECHA */}
      <button
        onClick={next}
        disabled={index >= total - visible}
        className="absolute -right-5 top-1/2 -translate-y-1/2 z-10
                   bg-black/70 hover:bg-black text-white rounded-full
                   w-10 h-10 flex items-center justify-center
                   disabled:opacity-30"
      >
        ›
      </button>

      {/* CONTENEDOR */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * (100 / visible)}%)`,
            width: `${(total / visible) * 100}%`,
          }}
        >
          {noticias.map((n) => (
            <Link
              key={n.id}
              href={`/noticias/${n.id}`}
              className="w-1/3 shrink-0 bg-gray-900 rounded-xl
                         overflow-hidden hover-lift hover-zoom"
            >
              <div className="relative h-48">
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold leading-snug line-clamp-2">
                  {n.title}
                </h3>

                <div
                  className="text-sm text-gray-400 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: n.contentHtml }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
