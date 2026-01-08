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

  /* ======================
     📱 Detectar mobile
  ====================== */
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === "undefined") return false;
      return window.innerWidth < 768;
    };

    setIsMobile(checkMobile());

    const onResize = () => setIsMobile(checkMobile());
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
          // Preview image de Facebook (funciona sin token)
          const previewImg = `https://graph.facebook.com/v19.0/?id=${encodeURIComponent(
            g.facebookUrl
          )}&fields=og_object{image}&access_token=`;

          return (
            <div
              key={g.position}
              className="bg-gray-900 rounded-xl overflow-hidden"
            >
              {/* DESKTOP */}
              {!isMobile && (
                <FacebookPost url={g.facebookUrl} />
              )}

              {/* MOBILE PREVIEW */}
              {isMobile && (
                <a
                  href={g.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="relative aspect-video bg-black">
                    <Image
                      src={previewImg}
                      alt="Galería Facebook"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-blue-600 px-4 py-2 rounded text-sm font-bold">
                        Ver galería
                      </span>
                    </div>
                  </div>

                  <div className="p-3 text-center">
                    <p className="text-sm text-gray-300">
                      Abrir galería en Facebook
                    </p>
                  </div>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
