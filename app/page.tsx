// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import {
  getLatestVideos,
  getPlaylistVideos,
} from "@/lib/youtube";
import { getNoticias, getAgenda } from "@/lib/firebase";

/* ================= UTIL ================= */
function formatFecha(fecha: any) {
  if (!fecha) return "";

  if (typeof fecha === "object" && fecha.seconds) {
    const d = new Date(fecha.seconds * 1000);
    return d
      .toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  }

  if (typeof fecha === "string" && fecha.includes("-")) {
    const [y, m, d] = fecha.split("-");
    return `${d}-${m}-${y}`;
  }

  return fecha;
}

export default async function Home() {
  const videos = await getLatestVideos(50);
  const noticias = await getNoticias();
  const agenda = await getAgenda();

  const entrevistas = await getPlaylistVideos(
    "PL5sir16OHByuXWJZySSKC8UTOBtt4C_XL",
    5
  );

  const liveVideos = videos.filter((v: any) => {
    const isLive = v?.snippet?.liveBroadcastContent === "live";
    const started =
      v?.liveStreamingDetails?.actualStartTime &&
      !v?.liveStreamingDetails?.actualEndTime;
    return isLive || started;
  });

  const heroLives = liveVideos.slice(0, 2);
  const extraLives = liveVideos.slice(2, 6);

  const finishedLives = videos
    .filter((v: any) => v?.liveStreamingDetails?.actualEndTime)
    .slice(0, 5);

  const mainNews = noticias[0];
  const secondaryNews = noticias.slice(1, 5);

  return (
    <main className="bg-black text-white space-y-12">

      {/* ================= HERO EN VIVO ================= */}
      {heroLives.length > 0 && (
        <section className={`grid gap-6 ${heroLives.length > 1 ? "md:grid-cols-2" : ""}`}>
          {heroLives.map((v: any) => (
            <Link
              key={v.id}
              href={`/video/${v.id}`}
              className="relative rounded-xl overflow-hidden shadow-xl"
            >
              <div className="relative aspect-video">
                <Image
                  src={v.snippet.thumbnails.high.url}
                  alt={v.snippet.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

              <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 text-xs font-extrabold rounded">
                EN VIVO
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <h2 className="text-xl font-extrabold">
                  {v.snippet.title}
                </h2>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* ================= AGENDA ================= */}
      <section>
        <h2 className="text-lg font-extrabold mb-2">
          Agenda
        </h2>

        <div className="flex gap-3 overflow-x-auto">
          {agenda.map((p) => (
            <div
              key={p.id}
              className="min-w-[185px] bg-white text-black rounded-lg px-3 py-3 shadow"
            >
              <span className="text-[10px] font-bold uppercase text-gray-600">
                {p.liga}
              </span>

              <div className="mt-2 text-xs font-extrabold text-center">
                {p.local}
              </div>
              <div className="text-center text-[10px] text-gray-500">vs</div>
              <div className="text-xs font-extrabold text-center">
                {p.visitante}
              </div>

              <div className="mt-3 flex justify-between text-[10px]">
                <span>{formatFecha(p.fecha)}</span>
                <span className="font-bold text-red-600">
                  {p.hora}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MÁS EN VIVO ================= */}
      {extraLives.length > 0 && (
        <section>
          <h2 className="text-xl font-extrabold mb-4">
            Transmisiones en vivo
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {extraLives.map((v: any) => (
              <Link
                key={v.id}
                href={`/video/${v.id}`}
                className="bg-white text-black rounded-lg overflow-hidden shadow"
              >
                <Image
                  src={v.snippet.thumbnails.medium.url}
                  alt={v.snippet.title}
                  width={320}
                  height={180}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-xs font-semibold line-clamp-2">
                    {v.snippet.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= NOTICIAS ================= */}
      {mainNews && (
        <section className="grid lg:grid-cols-3 gap-6">
          <Link
            href={`/noticias/${mainNews.id}`}
            className="lg:col-span-2 bg-white text-black rounded-xl overflow-hidden shadow"
          >
            <Image
              src={mainNews.image}
              alt={mainNews.title}
              width={1200}
              height={600}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-extrabold">
                {mainNews.title}
              </h2>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            {secondaryNews.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                className="bg-white text-black rounded-xl overflow-hidden shadow"
              >
                <Image
                  src={n.image}
                  alt={n.title}
                  width={600}
                  height={400}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {n.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= SPONSOR ================= */}
      <div className="flex justify-center bg-black">
        <img
          src="https://5y6xtj0au7.ufs.sh/f/fONHWhCkbsJLM3vRGyERAB2y4wvKo7Dj1cNLICfbTzPSFpZG"
          alt="Sponsors"
          width={640}
          height={128}
          className="object-contain"
        />
      </div>

{/* ================= ENTREVISTAS ================= */}
<section>
  <h2 className="text-xl font-extrabold mb-4">
    Entrevistas
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {entrevistas.map((v: any) => (
      <Link
        key={v.id}
        href={`/video/${v.id}`}
        className="bg-white text-black border rounded-lg overflow-hidden shadow"
      >
        <div className="relative aspect-[9/16]">
          <Image
            src={v.snippet.thumbnails.high.url}
            alt={v.snippet.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-2">
          <h3 className="text-xs font-semibold line-clamp-2">
            {v.snippet.title}
          </h3>
        </div>
      </Link>
    ))}
  </div>
</section>


      {/* ================= TRANSMISIONES ANTERIORES ================= */}
      {finishedLives.length > 0 && (
        <section>
          <h2 className="text-xl font-extrabold mb-4">
            Transmisiones anteriores
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {finishedLives.map((v: any) => (
              <Link
                key={v.id}
                href={`/video/${v.id}`}
                className="bg-white text-black rounded-lg overflow-hidden shadow"
              >
                <Image
                  src={v.snippet.thumbnails.medium.url}
                  alt={v.snippet.title}
                  width={320}
                  height={180}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-xs font-semibold line-clamp-2">
                    {v.snippet.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
