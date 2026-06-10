"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/auth";
import { db } from "@/db";
import { dishes } from "@/db/schema";
import { dishSchema } from "@/lib/validations";
import type { ActionResult } from "@/types";

function revalidateMenu(dishId?: number) {
  revalidatePath("/");
  revalidatePath("/admin/dishes");
  if (dishId !== undefined) revalidatePath(`/dishes/${dishId}`);
}

export async function createDish(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = dishSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.insert(dishes).values(parsed.data);
  } catch {
    return { success: false, error: "Failed to create dish" };
  }

  revalidateMenu();
  return { success: true };
}

export async function updateDish(
  id: number,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = dishSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.update(dishes).set(parsed.data).where(eq(dishes.id, id));
  } catch {
    return { success: false, error: "Failed to update dish" };
  }

  revalidateMenu(id);
  return { success: true };
}

export async function toggleDishAvailability(
  id: number,
  isAvailable: boolean,
): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db.update(dishes).set({ isAvailable }).where(eq(dishes.id, id));
  } catch {
    return { success: false, error: "Failed to update availability" };
  }

  revalidateMenu(id);
  return { success: true };
}

export async function deleteDish(id: number): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db.delete(dishes).where(eq(dishes.id, id));
  } catch {
    return { success: false, error: "Failed to delete dish" };
  }

  revalidateMenu(id);
  return { success: true };
}
