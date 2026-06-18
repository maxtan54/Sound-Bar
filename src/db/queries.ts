import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { categories, customTags, dishes } from "@/db/schema";
import type { Category, DishWithCategory } from "@/types";

export async function getCustomTags(): Promise<string[]> {
  const rows = await db
    .select({ name: customTags.name })
    .from(customTags)
    .orderBy(asc(customTags.name));
  return rows.map((r) => r.name);
}

export async function getCategories(): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0];
}

export async function getAvailableDishes(
  categorySlug?: string,
): Promise<DishWithCategory[]> {
  const conditions = [eq(dishes.isAvailable, true)];
  if (categorySlug) conditions.push(eq(categories.slug, categorySlug));

  const rows = await db
    .select()
    .from(dishes)
    .innerJoin(categories, eq(dishes.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(asc(categories.sortOrder), asc(dishes.name));

  return rows.map(({ dishes: dish, categories: category }) => ({
    ...dish,
    category,
  }));
}

export async function getDishById(
  id: number,
): Promise<DishWithCategory | undefined> {
  const rows = await db
    .select()
    .from(dishes)
    .innerJoin(categories, eq(dishes.categoryId, categories.id))
    .where(eq(dishes.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return undefined;
  return { ...row.dishes, category: row.categories };
}

export async function getAllDishes(): Promise<DishWithCategory[]> {
  const rows = await db
    .select()
    .from(dishes)
    .innerJoin(categories, eq(dishes.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), asc(dishes.name));

  return rows.map(({ dishes: dish, categories: category }) => ({
    ...dish,
    category,
  }));
}
