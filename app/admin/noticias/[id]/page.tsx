"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Editor TipTap (solo cliente)
const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor"),
  { ssr: false }
);

export default function EditarNoticiaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Cargar noticia
  useEffect(() => {
    async function loadNoticia() {
      try {
        const ref = doc(db, "noticias", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Noticia no encontrada");
          router.push("/admin/noticias");
          return;
        }

        const data = snap.data();
        setTitle(data.title || "");
        setContentHtml(data.contentHtml || "");
        setImage(data.image || "");
      } catch (err) {
        console.error(err);
        alert("Error al cargar la noticia");
      } finally {
        setLoading(false);
      }
    }

    loadNoticia();
  }, [id, router]);

  // 🔹 Guardar cambios
  async function guardarCambios() {
    try {
      setSaving(true);

      const ref = doc(db, "noticias", id);
      await updateDoc(ref, {
        title,
        contentHtml,
        image,
      });

      alert("Noticia actualizada correctamente");
      router.push("/admin/noticias");
    } catch (err: any) {
      console.error(err);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-400">Cargando noticia...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Editar noticia</h1>

      {/* Título */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      />

      {/* Imagen */}
      <div>
        <p className="mb-2">Imagen principal</p>

        <UploadButton<OurFileRouter>
          endpoint="newsImage"
          onClientUploadComplete={(res) => {
            if (res && res[0]?.url) {
              setImage(res[0].url);
            }
          }}
          onUploadError={(e) => alert("Error: " + e.message)}
        />

        {image && (
          <img src={image} alt="preview" className="w-full rounded mt-3" />
        )}
      </div>

      {/* Contenido */}
      <div>
        <p className="mb-2">Contenido</p>
        <RichEditor
          initialHtml={contentHtml}
          onChange={setContentHtml}
        />
      </div>

      <button
        onClick={guardarCambios}
        disabled={saving}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
