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

  useEffect(() => {
    async function load() {
      try {
        const data = await getFacebookGalleries();

        const activeGalleries = data
          .filter((g: Gallery) => g.active === true)
          .sort((a: Gallery, b: Gallery) => a.position - b.position);

        setGalleries(activeGalleries);
      } catch (e) {
        console.error("Error cargando galerías", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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

  return (
    <section>
      <h2 className="text-xl font-extrabold mb-4">Galerías</h2>

      {/* tarjetas más compactas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {galleries.map((g) => (
          <FacebookPost
            key={g.position}
            url={g.facebookUrl}
          />
        ))}
      </div>
    </section>
  );
}
