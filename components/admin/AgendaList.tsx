"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import AgendaForm from "./AgendaForm";
import AgendaRow from "./AgendaRow";
import { Partido } from "@/types/partido";

export default function AgendaList() {
  const [partidos, setPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "agenda"),
      orderBy("fecha", "asc"),
      orderBy("hora", "asc")
    );

    return onSnapshot(q, (snap) => {
      setPartidos(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Partido),
        }))
      );
    });
  }, []);

  return (
    <div className="space-y-6">
      <AgendaForm />

      <div className="space-y-2">
        {partidos.map((p) => (
          <AgendaRow key={p.id} partido={p} />
        ))}
      </div>
    </div>
  );
}
