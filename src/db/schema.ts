import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const weightUnitEnum = pgEnum("weight_unit", ["g", "ml"]);

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const customTags = pgTable("custom_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const dishes = pgTable("dishes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  weight: integer("weight").notNull(),
  weightUnit: weightUnitEnum("weight_unit").notNull().default("g"),
  // Integer cents avoids floating-point drift on prices
  priceCents: integer("price_cents").notNull(),
  allergens: text("allergens")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  calories: integer("calories"),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
