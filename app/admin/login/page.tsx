"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function loginGoogle() {
    try {
      setLoading(true);

      // 🔐 Validar que Auth esté disponible (solo cliente)
      if (!auth) {
        alert("Firebase Auth no está disponible");
        setLoading(false);
        return;
      }

      // 1️⃣ Login con Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) {
        alert("No se pudo obtener el usuario");
        setLoading(false);
        return;
      }

      // 2️⃣ Verificar si es admin en Firestore
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        alert("No tienes permisos de administrador");
        setLoading(false);
        return;
      }

      // 3️⃣ Crear cookie para el middleware
      document.cookie = "admin_session=true; path=/";

      // 4️⃣ Redirigir al panel
      router.replace("/admin/noticias");

    } catch (err: any) {
      console.error(err);
      alert("Error al iniciar sesión: " + err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Panel Administrador</h1>

        <button
          onClick={loginGoogle}
          disabled={loading}
          className="w-full bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Validando..." : "Iniciar sesión con Google"}
        </button>
      </div>
    </div>
  );
}
