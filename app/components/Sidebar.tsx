"use client";

import Link from "next/link";
import { Home, PlaySquare, Radio, Newspaper, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Videos", href: "/videos", icon: PlaySquare },
    { name: "En Vivo", href: "/envivo", icon: Radio },
    { name: "Noticias", href: "/noticias", icon: Newspaper },
    { name: "Eventos", href: "/eventos", icon: Calendar },
  ];

  return (
    <aside
      className="
        hidden md:flex 
        flex-col 
        w-56 h-screen 
        fixed left-0 top-0 
        bg-black border-r border-gray-800 
        pt-24 pb-6 
        z-40
      "
    >
      <nav className="flex flex-col gap-1 px-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}
              `}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
