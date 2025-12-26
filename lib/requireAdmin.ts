import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export function requireAdmin(): Promise<boolean> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(!!user);
    });
  });
}
