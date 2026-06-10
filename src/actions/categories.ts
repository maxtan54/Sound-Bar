"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { categorySchema } from "@/lib/validations";
import type { ActionResult } from "@/types";

// Drizzle wraps driver errors (DrizzleQueryError → cause: PostgresError),
// so walk the cause chain for the SQLSTATE code.
function pgErrorCode(error: unknown): string | undefined {
  let current: unknown = error;
  while (typeof current === "object" && current !== null) {
    const { code, cause } = current as { code?: unknown; cause?: unknown };
    if (typeof code === "string") return code;
    current = cause;
  }
  return undefined;
}

function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/dishes");
}

export async function createCategory(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db.insert(categories).values({
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      sortOrder: parsed.data.sortOrder,
    });
  } catch (error) {
    if (pgErrorCode(error) === "23505") {
      return {
        success: false,
        error: "A category with a similar name already exists",
      };
    }
    return { success: false, error: "Failed to create category" };
  }

  revalidateMenu();
  return { success: true };
}

export async function updateCategory(
  id: number,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await db
      .update(categories)
      .set({
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        sortOrder: parsed.data.sortOrder,
      })
      .where(eq(categories.id, id));
  } catch (error) {
    if (pgErrorCode(error) === "23505") {
      return {
        success: false,
        error: "A category with a similar name already exists",
      };
    }
    return { success: false, error: "Failed to update category" };
  }

  revalidateMenu();
  return { success: true };
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db.delete(categories).where(eq(categories.id, id));
  } catch (error) {
    if (pgErrorCode(error) === "23503") {
      return {
        success: false,
        error:
          "This category still has dishes. Move or delete them first.",
      };
    }
    return { success: false, error: "Failed to delete category" };
  }

  revalidateMenu();
  return { success: true };
}
