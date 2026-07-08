"use server";

import { requireSession } from "@/lib/auth/guards";
import { isCloudinaryConfigured, uploadImage } from "@/lib/media/cloudinary";
import type { ActionResult } from "@/lib/types/common";

/**
 * Authenticated product-image upload to Cloudinary. Validates MIME type and
 * size server-side (never trust the client) before touching the upload API.
 */

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function uploadProductImage(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  await requireSession();

  if (!isCloudinaryConfigured()) {
    return { ok: false, error: "Image upload isn't configured. Set the Cloudinary env vars." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file was provided." };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Please use a PNG, JPG, or WebP image." };
  }
  if (file.size > MAX_BYTES) return { ok: false, error: "Image must be 5 MB or smaller." };

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(bytes);
    return { ok: true, data: { url } };
  } catch (err) {
    console.error("[cloudinary] upload failed:", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
