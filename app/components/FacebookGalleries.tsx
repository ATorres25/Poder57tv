"use client";

import { useEffect, useState } from "react";
import { getFacebookGalleries } from "@/lib/firebase";
import FacebookPost from "@/app/components/FacebookPost";
import Image from "next/image";

type Gallery = {
  position: number;
  facebookUrl: string;
  active: boolean;
};

export default function FacebookGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  /* ======================
     📱 Detectar mobile
  ====================== */
  useEffect(() => {
    const checkMobile = () =>
      typeof window !== "undefined" &&
      window.innerWidth < 768;

    setIsMobile(checkMobile());

    const onResize = () =>
      setIsMobile(checkMobile());

    window.addEventListener("resize", onResize);
    return () =>
      window.removeEventListener("resize", onResize);
  }, []);

  /* ======================
     📥 Cargar galerías
  ====================== */
  useEffect(() => {
    async function load() {
      try {
        const data = await getFacebookGalleries();

        const activeGalleries = data
          .filter((g) => g.active)
          .sort(
            (a, b) => a.position - b.position
          );

        setGalleries(activeGalleries);
      } catch (e) {
        console.error("Error cargando galerías", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ======================
     ⏳ LOADING
  ====================== */
  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-extrabold mb-4">
          Galerías
        </h2>
        <div className="text-center text-gray-400">
          Cargando galerías...
        </div>
      </section>
    );
  }

  /* ======================
     🚫 SIN GALERÍAS
  ====================== */
  if (galleries.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-extrabold mb-4">
          Galerías
        </h2>
        <div className="text-center text-gray-500">
          No hay galerías activas
        </div>
      </section>
    );
  }

  /* ======================
     🖼️ GALERÍAS
  ====================== */
  return (
    <section>
      <h2 className="text-xl font-extrabold mb-4">
        Galerías
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {galleries.map((g) => {
          const previewImg = `https://graph.facebook.com/?id=${encodeURIComponent(
            g.facebookUrl
          )}&fields=og_object{image}`;

          const showTextFallback =
            isMobile && imgError[g.position];

          return (
            <div
              key={g.position}
              className="bg-gray-900 rounded-xl overflow-hidden"
            >
              {/* DESKTOP */}
              {!isMobile && (
                <FacebookPost url={g.facebookUrl} />
              )}

              {/* MOBILE */}
              {isMobile && (
                <a
                  href={g.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {!showTextFallback && (
                    <div className="relative aspect-video bg-black">
                      <Image
                        src={previewImg}
                        alt="Galería Facebook"
                        fill
                        unoptimized
                        className="object-cover"
                        onError={() =>
                          setImgError((prev) => ({
                            ...prev,
                            [g.position]: true,
                          }))
                        }
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-blue-600 px-4 py-2 rounded text-sm font-bold">
                          Ver galería
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TEXTO FALLBACK */}
                  {showTextFallback && (
                    <div className="p-6 text-center space-y-3">
                      <p className="text-lg font-bold">
                        Galería en Facebook
                      </p>
                      <p className="text-sm text-gray-300">
                        Toca para ver las imágenes completas
                        directamente en Facebook.
                      </p>
                      <span className="inline-block bg-blue-600 px-4 py-2 rounded text-sm font-bold">
                        Abrir galería
                      </span>
                    </div>
                  )}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
