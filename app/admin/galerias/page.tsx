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

    const data = snapshot.docs.map(
      (d) => d.data() as Gallery
    );

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

  async function saveGallery(gallery: Gallery) {
    const ref = doc(
      db,
      "facebookGalleries",
      String(gallery.position)
    );

    await setDoc(ref, gallery);
    alert("Galería guardada");
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
        Cada posición corresponde a una galería en Home (máx. 6)
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

              <input
                type="text"
                placeholder="https://www.facebook.com/share/p/XXXX/"
                value={gallery.facebookUrl}
                onChange={(e) => {
                  const updated = galleries.filter(
                    (g) => g.position !== pos
                  );
                  setGalleries([
                    ...updated,
                    {
                      ...gallery,
                      facebookUrl: e.target.value,
                    },
                  ]);
                }}
                className="w-full p-2 bg-black border border-gray-700 rounded text-sm"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={gallery.active}
                  onChange={(e) => {
                    const updated = galleries.filter(
                      (g) => g.position !== pos
                    );
                    setGalleries([
                      ...updated,
                      {
                        ...gallery,
                        active: e.target.checked,
                      },
                    ]);
                  }}
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
