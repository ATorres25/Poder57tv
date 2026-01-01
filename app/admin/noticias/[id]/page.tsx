"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor"),
  { ssr: false }
);

export default function EditarNoticiaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [image, setImage] = useState("");
  const [priority, setPriority] = useState<"normal" | "main" | "side">("normal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "noticias", id));
      if (!snap.exists()) return router.push("/admin/noticias");

      const data = snap.data();
      setTitle(data.title);
      setContentHtml(data.contentHtml);
      setImage(data.image);
      setPriority(data.priority || "normal");
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function save() {
    setSaving(true);
    await updateDoc(doc(db, "noticias", id), {
      title,
      contentHtml,
      image,
      priority,
    });
    router.push("/admin/noticias");
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Editar noticia</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      />

      {/* PRIORIDAD */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      >
        <option value="normal">Normal</option>
        <option value="main">⭐ Principal</option>
        <option value="side">📌 Lateral</option>
      </select>

      {/* IMAGEN */}
      <UploadButton<OurFileRouter, "newsImage">
        endpoint="newsImage"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) setImage(res[0].url);
        }}
      />
      {image && <img src={image} className="w-full rounded" />}

      <RichEditor
        initialHtml={contentHtml}
        onChange={setContentHtml}
      />

      <button
        onClick={save}
        disabled={saving}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
