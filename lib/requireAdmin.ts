import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export function requireAdmin(): Promise<boolean> {
  return new Promise((resolve) => {
    // 🔒 Si auth no está disponible (SSR / build), no es admin
    if (!auth) {
      resolve(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(!!user);
      unsubscribe();
    });
  });
}
