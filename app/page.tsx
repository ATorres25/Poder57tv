// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import {
  getLatestVideos,
  getPlaylistVideos,
  getPastLiveStreams,
} from "@/lib/youtube";
import {
  getNoticias,
  getAgenda,
} from "@/lib/firebase";
import FacebookGalleries from "@/app/components/FacebookGalleries";

export const dynamic = "force-dynamic";

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
  const pastLives = await getPastLiveStreams(5);

  /* ================= AGENDA FUTURA ================= */
  const ahora = new Date();

  const agendaFutura = agenda.filter((p: any) => {
    if (!p.fecha || !p.hora) return false;
    const fechaHora = new Date(`${p.fecha}T${p.hora}:00`);
    return fechaHora >= ahora;
  });

  const entrevistas = await getPlaylistVideos(
    "PL5sir16OHByuXWJZySSKC8UTOBtt4C_XL",
    6
  );

  const liveVideos = videos.filter((v: any) => {
    const isLive = v?.snippet?.liveBroadcastContent === "live";
    const started =
      v?.liveStreamingDetails?.actualStartTime &&
      !v?.liveStreamingDetails?.actualEndTime;
    return isLive || started;
  });

  const heroLives = liveVideos.slice(0, 2);

  /* ================= NOTICIAS CON PRIORIDAD ================= */
  const principal = noticias.find(
    (n: any) => n.priority === "main"
  );

  const lateralesMarcados = noticias.filter(
    (n: any) => n.priority === "side"
  );

  const resto = noticias.filter(
    (n: any) =>
      n.id !== principal?.id &&
      n.priority !== "side"
  );

  const mainNews = principal || noticias[0];

  const secondaryNews = [
    ...lateralesMarcados,
    ...resto,
  ]
    .filter((n) => n.id !== mainNews?.id)
    .slice(0, 3);

  /* ================= MÁS NOTICIAS ================= */
  const usados = new Set([
    mainNews?.id,
    ...secondaryNews.map((n) => n.id),
  ]);

  const masNoticias = noticias
    .filter((n) => !usados.has(n.id))
    .slice(0, 5);

  return (
    <main className="relative text-white space-y-12 overflow-hidden">

      {/* ================= FONDO GLOW AZUL ================= */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-blue-600/20 blur-[180px]" />
        <div className="absolute top-[40%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[160px]" />
      </div>

      {/* ================= HERO ================= */}
      {heroLives.length > 0 && (
        <section className="grid md:grid-cols-2 gap-6">
          {heroLives.map((v: any) => (
            <Link
              key={v.id}
              href={`/video/${v.id}`}
              className="group relative rounded-xl overflow-hidden
                         transition-transform duration-300
                         hover:-translate-y-1"
            >
              <div className="relative aspect-video">
                <Image
                  src={v.snippet.thumbnails.high.url}
                  alt={v.snippet.title}
                  fill
                  className="object-cover transition-transform duration-500
                             group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-extrabold">
                  {v.snippet.title}
                </h2>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* ================= AGENDA ================= */}
      {agendaFutura.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold mb-2">Agenda</h2>
          <div className="flex gap-3 overflow-x-auto">
            {agendaFutura.map((p: any) => (
              <div
                key={p.id}
                className="min-w-[185px] bg-white text-black rounded-lg px-3 py-3
                           transition-transform duration-300
                           hover:-translate-y-1 hover:shadow-lg"
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
      )}

      {/* ================= NOTICIAS PRINCIPALES ================= */}
      {mainNews && (
        <section className="grid lg:grid-cols-3 gap-6">
          <Link
            href={`/noticias/${mainNews.id}`}
            className="lg:col-span-2 bg-white text-black rounded-xl overflow-hidden
                       transition-all duration-300
                       hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={mainNews.image}
              alt={mainNews.title}
              width={1200}
              height={600}
              className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="p-6">
              <h2 className="text-2xl font-extrabold">
                {mainNews.title}
              </h2>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            {secondaryNews.map((n: any) => (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                className="bg-white text-black rounded-xl overflow-hidden
                           transition-all duration-300
                           hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={n.image}
                  alt={n.title}
                  width={600}
                  height={400}
                  className="w-full h-32 object-cover transition-transform duration-500 hover:scale-105"
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
      <div className="flex justify-center bg-black py-4">
        <Image
          src="https://5y6xtj0au7.ufs.sh/f/fONHWhCkbsJLM3vRGyERAB2y4wvKo7Dj1cNLICfbTzPSFpZG"
          alt="Sponsors"
          width={640}
          height={128}
          className="object-contain"
        />
      </div>

      {/* ================= ENTREVISTAS ================= */}
      <section>
        <h2 className="text-xl font-extrabold mb-3">Entrevistas</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {entrevistas.map((v: any) => (
            <Link
              key={v.id}
              href={`/video/${v.id}`}
              className="bg-white text-black rounded-md overflow-hidden
                         transition-all duration-300
                         hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[9/16]">
                <Image
                  src={v.snippet.thumbnails.high.url}
                  alt={v.snippet.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
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

      {/* ================= GALERÍAS FACEBOOK ================= */}
      <FacebookGalleries />

      {/* ================= MÁS NOTICIAS ================= */}
      {masNoticias.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold mb-3">Más noticias</h2>
          <div className="grid md:grid-cols-5 gap-3">
            {masNoticias.map((n: any) => (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                className="flex gap-2 bg-white text-black rounded-md p-2
                           transition-all duration-300
                           hover:-translate-y-1 hover:shadow-md"
              >
                <Image
                  src={n.image}
                  alt={n.title}
                  width={90}
                  height={60}
                  className="object-cover rounded transition-transform duration-500 hover:scale-105"
                />
                <h3 className="text-xs font-semibold line-clamp-3">
                  {n.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= TRANSMISIONES ANTERIORES ================= */}
      {pastLives.length > 0 && (
        <section>
          <h2 className="text-xl font-extrabold mb-4">
            Transmisiones anteriores
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {pastLives.map((v: any) => (
              <Link
                key={v.id}
                href={`/video/${v.id}`}
                className="bg-white text-black rounded-lg overflow-hidden
                           transition-all duration-300
                           hover:-translate-y-1 hover:shadow-md"
              >
                <Image
                  src={v.snippet.thumbnails.medium.url}
                  alt={v.snippet.title}
                  width={320}
                  height={180}
                  className="w-full h-28 object-cover transition-transform duration-500 hover:scale-105"
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
