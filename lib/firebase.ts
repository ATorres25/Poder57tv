// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

/* 🔹 Configuración Firebase */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/* 🔹 Inicializar app una sola vez */
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

/* =========================
   📰 NOTICIAS
========================= */
export type Noticia = {
  id: string;
  title: string;
  contentHtml: string;
  image: string;
  published: boolean;
  date: Timestamp;
  priority?: "main" | "side" | null;
};

export async function getNoticias(): Promise<Noticia[]> {
  const q = query(
    collection(db, "noticias"),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title ?? "",
        contentHtml: data.contentHtml ?? "",
        image:
          data.image ||
          "https://via.placeholder.com/800x450.png?text=Noticia",
        published: data.published ?? false,
        date: data.date,
        priority: data.priority ?? null,
      };
    })
    .filter((n) => n.published === true);
}

/* =========================
   ⚽ AGENDA REAL
========================= */
export type Partido = {
  id: string;
  liga: string;
  local: string;
  visitante: string;
  fecha: string;
  hora: string;
  estado: "programado" | "en_vivo" | "finalizado";
  createdAt: Timestamp;
};

export async function getAgenda(): Promise<Partido[]> {
  const q = query(
    collection(db, "agenda"),
    orderBy("fecha", "asc"),
    orderBy("hora", "asc")
  );

  const snapshot = await getDocs(q);

  const ahora = new Date();
  const limite = new Date(ahora.getTime() - 2 * 60 * 60 * 1000);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Partido, "id">),
    }))
    .filter((p) => {
      if (p.estado === "en_vivo") return true;
      const fechaHora = new Date(`${p.fecha}T${p.hora}:00`);
      return fechaHora >= limite;
    });
}

/* =========================
   📘 GALERÍAS FACEBOOK
========================= */
export type FacebookGallery = {
  position: number;
  facebookUrl: string;
  active: boolean;
};

export async function getFacebookGalleries(): Promise<FacebookGallery[]> {
  const q = query(
    collection(db, "facebookGalleries"),
    orderBy("position", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => doc.data() as FacebookGallery)
    .filter((g) => g.active === true);
}
