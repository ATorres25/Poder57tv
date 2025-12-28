"use client";

import { db } from "@/lib/firebase";
import {
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Partido, EstadoPartido } from "@/types/partido";

interface Props {
  partido: Partido;
}

export default function AgendaRow({ partido }: Props) {
  const setEstado = async (estado: EstadoPartido) => {
    if (!partido.id) return;
    await updateDoc(doc(db, "agenda", partido.id), { estado });
  };

  const eliminar = async () => {
    if (!partido.id) return;
    if (confirm("¿Eliminar partido?")) {
      await deleteDoc(doc(db, "agenda", partido.id));
    }
  };

  return (
    <div className="bg-gray-800 p-3 rounded flex justify-between items-center">
      <div>
        <p className="font-semibold">
          {partido.local} vs {partido.visitante}
        </p>
        <p className="text-xs text-gray-400">
          {partido.fecha} {partido.hora} — {partido.estado}
        </p>
      </div>

      <div className="flex gap-2">
        {(["programado", "en_vivo", "finalizado"] as EstadoPartido[]).map(
          (e) => (
            <button
              key={e}
              onClick={() => setEstado(e)}
              className="text-xs px-2 py-1 border rounded"
            >
              {e}
            </button>
          )
        )}

        <button
          onClick={eliminar}
          className="text-xs px-2 py-1 bg-red-700 rounded"
        >
          X
        </button>
      </div>
    </div>
  );
}
