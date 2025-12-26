"use client";

import React, { useCallback, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  initialHtml?: string;
  onChange: (html: string) => void;
  uploadImage: (file: File) => Promise<string>;
};

export default function RichEditor({
  initialHtml = "",
  onChange,
  uploadImage,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false, // ✅ CLAVE PARA NEXT APP ROUTER
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Escribe el contenido de la noticia...",
      }),
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // pegar imágenes (paste / drag & drop)
  useEffect(() => {
    if (!editor) return;

    async function handleFiles(files: FileList | File[]) {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
    }

    function onPaste(e: ClipboardEvent) {
      const files = e.clipboardData?.files;
      if (files?.length) handleFiles(files);
    }

    function onDrop(e: DragEvent) {
      const files = e.dataTransfer?.files;
      if (files?.length) handleFiles(files);
    }

    window.addEventListener("paste", onPaste as any);
    window.addEventListener("drop", onDrop as any);

    return () => {
      window.removeEventListener("paste", onPaste as any);
      window.removeEventListener("drop", onDrop as any);
    };
  }, [editor, uploadImage]);

  const addImageFromFile = useCallback(
    async (file: File) => {
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor, uploadImage]
  );

  if (!editor) return null;

  return (
    <div className="bg-gray-900 rounded p-3">
      {/* Toolbar */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 rounded bg-gray-800"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 rounded bg-gray-800"
        >
          i
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="px-3 py-1 rounded bg-gray-800"
        >
          H2
        </button>

        <label className="px-3 py-1 rounded bg-gray-800 cursor-pointer">
          📎 Imagen
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) addImageFromFile(f);
            }}
          />
        </label>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-full"
      />
    </div>
  );
}
