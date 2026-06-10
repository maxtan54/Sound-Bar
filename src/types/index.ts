import type { InferSelectModel } from "drizzle-orm";

import type { categories, dishes } from "@/db/schema";

export type Category = InferSelectModel<typeof categories>;
export type Dish = InferSelectModel<typeof dishes>;

export type DishWithCategory = Dish & { category: Category };

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };
