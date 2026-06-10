"use server";

import { randomUUID } from "node:crypto";

import { requireAdmin } from "@/auth";
import { DISH_IMAGES_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";
import type { ActionResult } from "@/types";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

export async function uploadDishImage(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return { success: false, error: "Only JPEG, PNG and WebP images are allowed" };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "Image must be 4 MB or smaller" };
  }

  const path = `dishes/${randomUUID()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from(DISH_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error("Image upload failed:", error.message);
    return { success: false, error: "Upload failed. Try again." };
  }

  const { data } = supabaseAdmin.storage
    .from(DISH_IMAGES_BUCKET)
    .getPublicUrl(path);

  return { success: true, data: { url: data.publicUrl } };
}
