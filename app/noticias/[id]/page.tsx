// app/noticias/[id]/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

/* ======================================================
   🧠 SEO DINÁMICO
====================================================== */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;

  if (!id) return { title: "Noticia | Poder57tv" };

  const snap = await getDoc(doc(db, "noticias", id));
  if (!snap.exists()) return { title: "Noticia | Poder57tv" };

  const n: any = snap.data();
  const text =
    n.contentHtml?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "";

  return {
    title: `${n.title} | Poder57tv`,
    description: text,
    openGraph: {
      title: n.title,
      description: text,
      images: n.image ? [{ url: n.image }] : [],
      type: "article",
    },
  };
}

/* ======================================================
   📄 PÁGINA
====================================================== */
export default async function NoticiaPage({ params }: Props) {
  const { id } = await params;

  const snap = await getDoc(doc(db, "noticias", id));
  if (!snap.exists()) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Noticia no encontrada</h1>
        <Link href="/noticias" className="text-blue-400">
          Volver a noticias
        </Link>
      </main>
    );
  }

  const n: any = snap.data();

  const fecha = n.date?.toDate?.()?.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">

      {/* BREADCRUMB */}
      <nav className="text-sm text-gray-400">
        <Link href="/">Inicio</Link> /{" "}
        <Link href="/noticias">Noticias</Link>
      </nav>

      {/* TITULAR */}
      <h1 className="text-4xl font-extrabold leading-tight">
        {n.title}
      </h1>

      {fecha && (
        <p className="text-sm text-gray-400">
          Publicado el {fecha}
        </p>
      )}

      {/* IMAGEN */}
      {n.image && (
        <img
          src={n.image}
          alt={n.title}
          className="w-full rounded-2xl shadow-xl"
        />
      )}

      {/* CONTENIDO */}
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: n.contentHtml }}
      />
    </main>
  );
}
