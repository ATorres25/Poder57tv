"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeaderProps {
  hasLive: boolean;
}

const Header: React.FC<HeaderProps> = ({ hasLive }) => {
  return (
    <header className="w-full bg-black/80 backdrop-blur border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Poder57TV"
            width={150}
            height={44}
            priority
          />
        </Link>

        {/* CTAs */}
        <div className="flex items-center gap-3 ml-auto">

          {hasLive && (
            <Link
              href="/en-vivo"
              className="hidden sm:flex items-center gap-1 bg-red-600 px-3 py-2 rounded-md text-xs font-extrabold text-white hover:bg-red-700 transition animate-live-pulse"
            >
              🔴 EN VIVO
            </Link>
          )}

          <a
            href="https://www.youtube.com/@poder57tv"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 transition px-3 py-2 rounded-md text-xs font-bold text-white"
          >
            Youtube
          </a>

          <a
            href="https://www.facebook.com/Poder57tv"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded-md text-xs font-bold text-white"
          >
            Facebook
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
