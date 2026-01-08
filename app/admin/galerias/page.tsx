"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

type Gallery = {
  position: number;
  facebookUrl: string;
  active: boolean;
};

const POSITIONS = [1, 2, 3, 4, 5, 6];

/* =========================
   🔧 UTIL: extraer URL real
========================= */
function extractFacebookUrl(input: string): string {
  if (!input) return "";

  // Si es iframe, extraer href=
  if (input.includes("<iframe")) {
    const match = input.match(/href=([^&"]+)/);
    if (match?.[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }

  // Si no es iframe, devolver limpio
  return input.trim();
}

export default function AdminGaleriasPage() {
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    loadGalleries();
  }, []);

  async function loadGalleries() {
    const snapshot = await getDocs(
      collection(db, "facebookGalleries")
    );

    const data: Gallery[] = snapshot.docs.map((d) => {
      const raw = d.data();
      return {
        position: Number(raw.position),
        facebookUrl: raw.facebookUrl ?? "",
        active: Boolean(raw.active),
      };
    });

    setGalleries(data);
    setLoading(false);
  }

  function getGallery(position: number): Gallery {
    return (
      galleries.find((g) => g.position === position) || {
        position,
        facebookUrl: "",
        active: false,
      }
    );
  }

  function updateGallery(updated: Gallery) {
    setGalleries((prev) => {
      const filtered = prev.filter(
        (g) => g.position !== updated.position
      );
      return [...filtered, updated];
    });
  }

  async function saveGallery(gallery: Gallery) {
    const cleanUrl = extractFacebookUrl(
      gallery.facebookUrl
    );

    const ref = doc(
      db,
      "facebookGalleries",
      String(gallery.position)
    );

    await setDoc(ref, {
      position: gallery.position,
      facebookUrl: cleanUrl,
      active: gallery.active,
    });

    alert(
      `Galería ${gallery.position} guardada correctamente`
    );
  }

  if (loading)
    return (
      <div className="py-20 text-center">
        Cargando galerías...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Galerías Facebook
      </h1>

      <p className="text-center text-gray-400 text-sm">
        Puedes pegar el iframe completo o el link del post
      </p>

      <div className="space-y-4">
        {POSITIONS.map((pos) => {
          const gallery = getGallery(pos);

          return (
            <div
              key={pos}
              className="bg-gray-900 border border-gray-800 rounded p-4 space-y-3"
            >
              <h2 className="font-bold">
                Galería #{pos}
              </h2>

              <textarea
                placeholder="Pega aquí el iframe o link de Facebook"
                value={gallery.facebookUrl}
                onChange={(e) =>
                  updateGallery({
                    ...gallery,
                    facebookUrl: e.target.value,
                  })
                }
                rows={3}
                className="w-full p-2 bg-black border border-gray-700 rounded text-sm"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={gallery.active}
                  onChange={(e) =>
                    updateGallery({
                      ...gallery,
                      active: e.target.checked,
                    })
                  }
                />
                Activa
              </label>

              <button
                onClick={() => saveGallery(gallery)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm"
              >
                Guardar galería
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
