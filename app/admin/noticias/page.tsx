"use client";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Noticia = {
  id: string;
  title: string;
  date: any;
  priority?: "main" | "side" | null;
  image?: string;
};

export default function AdminNoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGOUT
  async function logout() {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      document.cookie = "admin_session=; path=/; max-age=0";
      router.replace("/admin/login");
    }
  }

  // 📥 Cargar noticias
  async function loadNoticias() {
    setLoading(true);

    const q = query(
      collection(db, "noticias"),
      orderBy("date", "desc")
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((docu) => ({
      id: docu.id,
      ...(docu.data() as any),
    }));

    setNoticias(data);
    setLoading(false);
  }

  useEffect(() => {
    loadNoticias();
  }, []);

  // ⭐ Cambiar prioridad
  async function setPriority(
    id: string,
    priority: "main" | "side" | null
  ) {
    const ref = doc(db, "noticias", id);

    if (priority === "main") {
      const main = noticias.find((n) => n.priority === "main");
      if (main && main.id !== id) {
        await updateDoc(doc(db, "noticias", main.id), {
          priority: null,
        });
      }
    }

    await updateDoc(ref, { priority });
    await loadNoticias();
  }

  // 🗑️ BORRAR NOTICIA + IMAGEN
  async function deleteNoticia(
    id: string,
    title: string,
    image?: string
  ) {
    const ok = confirm(
      `¿Seguro que deseas eliminar la noticia:\n\n"${title}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!ok) return;

    try {
      // 🧨 1. Borrar imagen de UploadThing
      if (image) {
        const fileKey = image.split("/f/")[1];

        if (fileKey) {
          await fetch("/api/uploadthing/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileKey }),
          });
        }
      }

      // 🗑️ 2. Borrar noticia de Firestore
      await deleteDoc(doc(db, "noticias", id));

      // ⚡ 3. Actualizar UI
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error al borrar noticia:", err);
      alert("Error al borrar la noticia");
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📰 Noticias</h1>

        <div className="flex gap-3">
          <Link
            href="/admin/noticias/nueva"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            + Nueva noticia
          </Link>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* LISTADO */}
      {loading ? (
        <p>Cargando noticias...</p>
      ) : noticias.length === 0 ? (
        <p>No hay noticias aún.</p>
      ) : (
        <div className="space-y-3">
          {noticias.map((n) => (
            <div
              key={n.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-900 border border-gray-800 rounded p-4"
            >
              <div>
                <p className="font-semibold">
                  {n.title}{" "}
                  {n.priority === "main" && "⭐"}
                  {n.priority === "side" && "📌"}
                </p>
                <p className="text-sm text-gray-400">
                  {n.date?.toDate?.().toLocaleDateString("es-MX")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPriority(n.id, "main")}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                >
                  Principal
                </button>

                <button
                  onClick={() => setPriority(n.id, "side")}
                  className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
                >
                  Secundaria
                </button>

                <button
                  onClick={() => setPriority(n.id, null)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                >
                  Quitar
                </button>

                <Link
                  href={`/admin/noticias/${n.id}`}
                  className="text-blue-400 hover:underline text-sm self-center"
                >
                  Editar
                </Link>

                <button
                  onClick={() =>
                    deleteNoticia(n.id, n.title, n.image)
                  }
                  className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
