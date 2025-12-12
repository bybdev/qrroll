import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase/client";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    const { weddingId } = await request.json();

    if (!weddingId) {
      return Response.json({ error: "Wedding ID gerekli" }, { status: 400 });
    }

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("wedding_id", weddingId);

    if (error || !photos || photos.length === 0) {
      return Response.json({ error: "Fotoğraf bulunamadı" }, { status: 404 });
    }

    const zip = new JSZip();

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];

      try {
        const response = await fetch(photo.photo_url);
        const arrayBuffer = await response.arrayBuffer();

        const extension = photo.photo_url.split(".").pop()?.split("?")[0] || "jpg";
        const safeName = photo.guest_name
          ? photo.guest_name.replace(/[^a-zA-Z0-9]/g, "_")
          : "guest";

        const fileName = `${i + 1}-${safeName}.${extension}`;

        zip.file(fileName, arrayBuffer);
      } catch (err) {
        console.error("Fotoğraf indirilemedi:", photo.photo_url, err);
      }
    }

    // Buffer olarak üret
    const zipBuffer: Buffer = await zip.generateAsync({ type: "nodebuffer" });

    // TS hatasını çözen cast
    return new Response(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="wedding-photos.zip"',
      },
    });
  } catch (error) {
    console.error("ZIP creation error:", error);
    return Response.json({ error: "ZIP oluşturulamadı" }, { status: 500 });
  }
}
