"use client";

import { useEffect, useState } from "react";
import { getFacebookGalleries } from "@/lib/firebase";
import FacebookPost from "@/app/components/FacebookPost";

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

    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ======================
     📥 Cargar galerías
  ====================== */
  useEffect(() => {
    async function load() {
      try {
        const data = await getFacebookGalleries();

        const activeGalleries = data
          .filter((g: Gallery) => g.active === true)
          .sort(
            (a: Gallery, b: Gallery) =>
              a.position - b.position
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
        {galleries.map((g) => (
          <div
            key={g.position}
            className="bg-gray-900 rounded-lg p-3"
          >
            {/* DESKTOP: iframe */}
            {!isMobile && (
              <FacebookPost url={g.facebookUrl} />
            )}

            {/* MOBILE: fallback */}
            {isMobile && (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <p className="text-sm text-gray-300">
                  Ver galería completa en Facebook
                </p>

                <a
                  href={g.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700
                             px-4 py-2 rounded text-white
                             font-semibold transition"
                >
                  Abrir en Facebook
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
