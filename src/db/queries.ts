import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { categories, customTags, dishTags, dishes } from "@/db/schema";
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

async function fetchTagsByDishIds(ids: number[]): Promise<Map<number, string[]>> {
  const tagMap = new Map<number, string[]>();
  if (ids.length === 0) return tagMap;

  const rows = await db
    .select({ dishId: dishTags.dishId, tagName: customTags.name })
    .from(dishTags)
    .innerJoin(customTags, eq(customTags.id, dishTags.tagId))
    .where(ids.length === 1 ? eq(dishTags.dishId, ids[0]) : inArray(dishTags.dishId, ids));

  for (const { dishId, tagName } of rows) {
    const arr = tagMap.get(dishId) ?? [];
    arr.push(tagName);
    tagMap.set(dishId, arr);
  }
  return tagMap;
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

  const tagMap = await fetchTagsByDishIds(rows.map((r) => r.dishes.id));

  return rows.map(({ dishes: dish, categories: category }) => ({
    ...dish,
    tags: tagMap.get(dish.id) ?? [],
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

  const tagMap = await fetchTagsByDishIds([id]);
  return { ...row.dishes, tags: tagMap.get(id) ?? [], category: row.categories };
}

export async function getAllDishes(): Promise<DishWithCategory[]> {
  const rows = await db
    .select()
    .from(dishes)
    .innerJoin(categories, eq(dishes.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), asc(dishes.name));

  const tagMap = await fetchTagsByDishIds(rows.map((r) => r.dishes.id));

  return rows.map(({ dishes: dish, categories: category }) => ({
    ...dish,
    tags: tagMap.get(dish.id) ?? [],
    category,
  }));
}
