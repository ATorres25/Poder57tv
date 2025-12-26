// app/noticias/page.tsx
import Link from "next/link";
import { getNoticias } from "@/lib/firebase";

/* ======================================================
   📄 LISTADO DE NOTICIAS
====================================================== */
export default async function NoticiasPage() {
  const noticias = await getNoticias();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">

      {/* 📰 ENCABEZADO */}
      <header className="space-y-2 animate-fade-up">
        <h1 className="text-4xl font-extrabold">📰 Noticias</h1>
        <p className="text-gray-400">
          Lo más reciente en Poder57tv
        </p>
      </header>

      {/* 📦 GRID */}
      {noticias.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n, index) => {
            const fecha = n.date?.toDate?.()?.toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                style={{ animationDelay: `${index * 80}ms` }}
                className="
                  group bg-gray-900 rounded-xl overflow-hidden
                  hover-lift hover-zoom animate-fade-up
                "
              >
                {/* 🖼️ IMAGEN */}
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* 📄 TEXTO */}
                <div className="p-4 space-y-3">
                  {fecha && (
                    <p className="text-xs text-gray-400 uppercase">
                      {fecha}
                    </p>
                  )}

                  <h2 className="font-bold text-lg leading-snug group-hover:text-blue-400 transition">
                    {n.title}
                  </h2>

                  <div
                    className="text-sm text-gray-400 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: n.contentHtml }}
                  />

                  <span className="inline-block text-blue-400 text-sm font-semibold">
                    Leer más →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">No hay noticias publicadas.</p>
      )}
    </main>
  );
}
