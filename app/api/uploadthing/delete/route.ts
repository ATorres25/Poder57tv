import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: "fileKey requerido" },
        { status: 400 }
      );
    }

    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error borrando imagen:", error);
    return NextResponse.json(
      { error: "Error al borrar imagen" },
      { status: 500 }
    );
  }
}
