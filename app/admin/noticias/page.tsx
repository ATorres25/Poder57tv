"use client";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Noticia = {
  id: string;
  title: string;
  date: any;
};

export default function AdminNoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGOUT
  async function logout() {
    await signOut(auth);
    document.cookie = "admin_session=; path=/; max-age=0";
    router.replace("/admin/login");
  }

  // 📥 Cargar noticias
  useEffect(() => {
    async function loadNoticias() {
      const q = query(
        collection(db, "noticias"),
        orderBy("date", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setNoticias(data);
      setLoading(false);
    }

    loadNoticias();
  }, []);

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
              className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded p-4"
            >
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-400">
                  {n.date?.toDate?.().toLocaleDateString("es-MX")}
                </p>
              </div>

              <Link
                href={`/admin/noticias/${n.id}`}
                className="text-blue-400 hover:underline"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
