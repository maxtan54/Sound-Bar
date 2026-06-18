"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { customTags } from "@/db/schema";

type Result = { success: true } | { success: false; error: string };

export async function createCustomTag(name: string): Promise<Result> {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return { success: false, error: "Tag name is required" };
  if (trimmed.length > 50) return { success: false, error: "Tag name too long" };

  try {
    await db.insert(customTags).values({ name: trimmed }).onConflictDoNothing();
    return { success: true };
  } catch (err) {
    const code = (err as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") return { success: true };
    return { success: false, error: "Failed to save tag" };
  }
}

export async function updateCustomTag(oldName: string, newName: string): Promise<Result> {
  const trimmed = newName.trim().toLowerCase();
  if (!trimmed) return { success: false, error: "Tag name is required" };
  if (trimmed.length > 50) return { success: false, error: "Tag name too long" };
  if (trimmed === oldName) return { success: true };

  try {
    await db.update(customTags).set({ name: trimmed }).where(eq(customTags.name, oldName));
    return { success: true };
  } catch (err) {
    const code = (err as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") return { success: false, error: "Tag already exists" };
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteCustomTag(name: string): Promise<Result> {
  try {
    await db.delete(customTags).where(eq(customTags.name, name));
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete tag" };
  }
}
