"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  async function login(e: any) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  if (!user)
    return (
      <div className="max-w-md mx-auto py-20">
        <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>

        <form onSubmit={login} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
            Entrar
          </button>
        </form>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel Administrativo</h1>

      <nav className="space-y-3">
        <Link href="/admin/noticias" className="block text-blue-400">
          📰 Gestionar Noticias
        </Link>
      </nav>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
