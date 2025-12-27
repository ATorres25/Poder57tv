"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Editor solo en cliente
const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor"),
  { ssr: false }
);

export default function NuevaNoticiaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(""); // 👈 CAMPO CORRECTO
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !image || !contentHtml) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "noticias"), {
        title,
        image,              // ✅ AQUÍ SE GUARDA LA IMAGEN
        contentHtml,
        date: Timestamp.now(),
        published: true,
      });

      router.push("/admin/noticias");
    } catch (err: any) {
      console.error(err);
      alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Crear noticia</h1>

      <form onSubmit={onSubmit} className="space-y-5">

        {/* TÍTULO */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
        />

        {/* IMAGEN DE PORTADA */}
        <div>
          <p className="mb-2">Imagen de portada</p>

          <UploadButton<OurFileRouter, "newsImage">
            endpoint="newsImage"
            onClientUploadComplete={(res) => {
              if (res && res[0]?.url) {
                setImage(res[0].url); // ✅ GUARDAMOS EN image
              }
            }}
            onUploadError={(e) =>
              alert("Error al subir imagen: " + e.message)
            }
          />

          {image && (
            <img
              src={image}
              alt="Portada"
              className="w-full rounded mt-3"
            />
          )}
        </div>

        {/* CONTENIDO */}
        <div>
          <p className="mb-2">Contenido</p>
          <RichEditor onChange={setContentHtml} />
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar noticia"}
        </button>
      </form>
    </div>
  );
}
