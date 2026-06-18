"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/auth";
import { db } from "@/db";
import { customTags, dishTags, dishes } from "@/db/schema";
import { dishSchema } from "@/lib/validations";
import type { ActionResult } from "@/types";

function revalidateMenu(dishId?: number) {
  revalidatePath("/");
  revalidatePath("/admin/dishes");
  if (dishId !== undefined) revalidatePath(`/dishes/${dishId}`);
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function syncDishTags(tx: Tx, dishId: number, tagNames: string[]) {
  await tx.delete(dishTags).where(eq(dishTags.dishId, dishId));
  if (tagNames.length === 0) return;

  const tagRows = await tx
    .select({ id: customTags.id })
    .from(customTags)
    .where(inArray(customTags.name, tagNames));

  if (tagRows.length > 0) {
    await tx.insert(dishTags).values(tagRows.map(({ id: tagId }) => ({ dishId, tagId })));
  }
}

export async function createDish(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = dishSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { tags, ...dishData } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      const [newDish] = await tx.insert(dishes).values(dishData).returning({ id: dishes.id });
      await syncDishTags(tx, newDish.id, tags);
    });
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

  const { tags, ...dishData } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      await tx.update(dishes).set(dishData).where(eq(dishes.id, id));
      await syncDishTags(tx, id, tags);
    });
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
