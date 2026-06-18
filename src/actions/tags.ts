"use server";

import { db } from "@/db";
import { customTags } from "@/db/schema";

export async function createCustomTag(
  name: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return { success: false, error: "Tag name is required" };
  if (trimmed.length > 50) return { success: false, error: "Tag name too long" };

  try {
    await db
      .insert(customTags)
      .values({ name: trimmed })
      .onConflictDoNothing();
    return { success: true };
  } catch (err) {
    const code = (err as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") return { success: true }; // already exists — fine
    return { success: false, error: "Failed to save tag" };
  }
}
