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
          .filter((g) => g.active)
          .sort((a, b) => a.position - b.position);

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
        <h2 className="text-xl font-extrabold mb-4">Galerías</h2>
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
        <h2 className="text-xl font-extrabold mb-4">Galerías</h2>
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
      <h2 className="text-xl font-extrabold mb-4">Galerías</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {galleries.map((g) => {
          const previewImg = `https://graph.facebook.com/?id=${encodeURIComponent(
            g.facebookUrl
          )}&fields=og_object{image}`;

          const showFallback = imgError[g.position];

          return (
            <div
              key={g.position}
              className="bg-gray-900 rounded-xl overflow-hidden hover-lift"
            >
              {/* ================= DESKTOP ================= */}
              {!isMobile && (
                <FacebookPost url={g.facebookUrl} />
              )}

              {/* ================= MOBILE ================= */}
              {isMobile && (
                <a
                  href={g.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative aspect-video bg-black">
                    {!showFallback && (
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
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center gap-3">
                      <Image
                        src="/facebook.png"
                        alt="Facebook"
                        width={36}
                        height={36}
                      />

                      <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-extrabold">
                        Ver galería en Facebook
                      </span>
                    </div>
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
