import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// All types WhatsApp, iOS camera, Android gallery may produce
const VALID_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "application/octet-stream", // WhatsApp on some Android sends this
]);

const VALID_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp", "gif",
  "heic", "heif", "bmp", "tiff", "tif", "avif",
]);

function getExtension(filename: string, mimeType: string): string {
  // Try from filename first
  const parts = filename.split(".");
  if (parts.length > 1) {
    const ext = parts.pop()!.toLowerCase();
    if (VALID_EXTENSIONS.has(ext)) return ext;
  }
  // Fall back to MIME type
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/bmp": "bmp",
    "image/tiff": "jpg",
    "image/avif": "avif",
  };
  return mimeMap[mimeType] || "jpg";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type — check MIME or extension
    const mimeType = file.type?.toLowerCase() || "";
    const fileName = file.name || "";
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    
    const isValidMime = VALID_TYPES.has(mimeType) || mimeType.startsWith("image/");
    const isValidExt = VALID_EXTENSIONS.has(ext);

    if (!isValidMime && !isValidExt) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a photo (JPEG, PNG, HEIC, WEBP, etc.)" },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with correct extension
    const extension = getExtension(fileName, mimeType);
    const uniqueFileName = `${crypto.randomUUID()}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(uniqueFileName, buffer, {
        contentType: mimeType || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      return NextResponse.json(
        { error: "Failed to upload to cloud storage" },
        { status: 500 }
      );
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(uniqueFileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

