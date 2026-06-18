import type { InferSelectModel } from "drizzle-orm";

import type { categories, dishes } from "@/db/schema";

type DishRow = InferSelectModel<typeof dishes>;
export type Category = InferSelectModel<typeof categories>;
export type Dish = DishRow & { tags: string[] };

export type DishWithCategory = Dish & { category: Category };

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };
