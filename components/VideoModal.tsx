"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoModal({
  videoId,
  onClose,
}: {
  videoId: string;
  onClose: () => void;
}) {
  // Cerrar con tecla ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // cerrar clic afuera
      >
        <motion.div
          className="relative bg-black rounded-xl shadow-2xl max-w-5xl w-[90%] overflow-hidden"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()} // evita cierre al presionar adentro
        >
          {/* BOTÓN DE CIERRE */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white
                       p-2 rounded-full text-xl transition"
            aria-label="Cerrar"
          >
            ✖
          </button>

          {/* VIDEO */}
          <div className="w-full relative pb-[56.25%] bg-black">
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Video player"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
