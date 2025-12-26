"use client";

import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  hasLive: boolean;
}

export default function Header({ hasLive }: HeaderProps) {
  return (
    <header className="w-full bg-black border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Poder57tv"
            width={160}
            height={48}
            priority
          />
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
          <Link href="/noticias" className="hover:text-white transition">
            Noticias
          </Link>
          <Link href="/videos" className="hover:text-white transition">
            Videos
          </Link>
          <Link href="/entrevistas" className="hover:text-white transition">
            Entrevistas
          </Link>
        </nav>

        {/* BOTÓN EN VIVO (CONDICIONAL) */}
        {hasLive && (
          <Link
            href="/en-vivo"
            className="bg-red-600 px-4 py-2 rounded-md text-sm font-bold text-white hover:bg-red-700 transition animate-pulse"
          >
            🔴 EN VIVO
          </Link>
        )}

      </div>
    </header>
  );
}
