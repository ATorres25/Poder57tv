"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Partido } from "@/types/partido";

const initialForm: Omit<Partido, "id" | "createdAt" | "estado"> = {
  liga: "",
  local: "",
  visitante: "",
  fecha: "",
  hora: "",
};

export default function AgendaForm() {
  const [form, setForm] = useState(initialForm);

  const submit = async () => {
    if (!form.local || !form.visitante || !form.fecha || !form.hora) return;

    const nuevoPartido: Partido = {
      ...form,
      estado: "programado",
      createdAt: Timestamp.now(),
    };

    await addDoc(collection(db, "agenda"), nuevoPartido);
    setForm(initialForm);
  };

  return (
    <div className="bg-gray-900 p-4 rounded space-y-3">
      <h2 className="font-semibold">Nuevo partido</h2>

      <input
        placeholder="Liga"
        value={form.liga}
        onChange={(e) => setForm({ ...form, liga: e.target.value })}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <input
        placeholder="Local"
        value={form.local}
        onChange={(e) => setForm({ ...form, local: e.target.value })}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <input
        placeholder="Visitante"
        value={form.visitante}
        onChange={(e) => setForm({ ...form, visitante: e.target.value })}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <input
        type="date"
        value={form.fecha}
        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <input
        type="time"
        value={form.hora}
        onChange={(e) => setForm({ ...form, hora: e.target.value })}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <button
        onClick={submit}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Guardar partido
      </button>
    </div>
  );
}
