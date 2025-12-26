// app/video/[id]/page.tsx
import { getVideoById, getLatestVideos } from "@/lib/youtube";
import Link from "next/link";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import VideoActions from "@/components/VideoActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: Props) {
  const { id } = await params;

  const video = await getVideoById(id);

  if (!video || !video.snippet) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Video no encontrado</h1>
        <p className="text-gray-400 mt-2">
          Lo sentimos, el video solicitado no existe.
        </p>
        <Link href="/" className="mt-4 inline-block text-blue-400">
          Volver al inicio
        </Link>
      </main>
    );
  }

  const related = await getLatestVideos(10);

  const title = video.snippet.title ?? "Sin título";
  const description = video.snippet.description ?? "";
  const publishedAt = video.snippet.publishedAt;
  const pageUrl = `https://www.poder57tv.com/video/${id}`;

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">

      {/* 🔙 VOLVER */}
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Volver
      </Link>

      {/* 🎬 REPRODUCTOR */}
      <div className="bg-black rounded-xl overflow-hidden shadow-xl">
        <div className="relative pb-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* 📝 INFO */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          {title}
        </h1>

        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
          {publishedAt && (
            <span>
              Publicado el{" "}
              {format(new Date(publishedAt), "d 'de' MMMM yyyy", {
                locale: es,
              })}
            </span>
          )}

          {/* 🔗 ACCIONES (CLIENT COMPONENT) */}
          <div className="ml-auto">
            <VideoActions url={pageUrl} />
          </div>
        </div>
      </div>

      {/* 📄 DESCRIPCIÓN */}
      <DescriptionBlock text={description} />

      {/* 🎥 RELACIONADOS */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          También te puede interesar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {related
            .filter((r: any) => r.id !== id)
            .slice(0, 6)
            .map((r: any) => {
              const videoId = r.id;
              const thumb =
                r.snippet?.thumbnails?.maxres?.url ??
                r.snippet?.thumbnails?.high?.url ??
                "";

              return (
                <Link
                  href={`/video/${videoId}`}
                  key={videoId}
                  className="group bg-gray-900 rounded-xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.02]"
                >
                  <img
                    src={thumb}
                    alt={r.snippet?.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-2">
                      {r.snippet?.title}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </main>
  );
}

/* 📦 DESCRIPCIÓN */
function DescriptionBlock({ text }: { text: string }) {
  if (!text) return null;

  return (
    <details className="bg-gray-900/40 rounded-xl p-4 cursor-pointer">
      <summary className="text-sm text-gray-300 select-none">
        Ver descripción
      </summary>
      <p className="mt-2 text-sm text-gray-300 whitespace-pre-line leading-relaxed">
        {text}
      </p>
    </details>
  );
}
