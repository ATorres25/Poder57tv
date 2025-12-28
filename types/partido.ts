import { Timestamp } from "firebase/firestore";

export type EstadoPartido = "programado" | "en_vivo" | "finalizado";

export interface Partido {
  id?: string; // Firestore
  liga: string;
  local: string;
  visitante: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  estado: EstadoPartido;
  createdAt: Timestamp;
}
