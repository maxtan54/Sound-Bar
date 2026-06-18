import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
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
    .default([]),
  calories: integer("calories"),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const dishTags = pgTable(
  "dish_tags",
  {
    dishId: integer("dish_id")
      .notNull()
      .references(() => dishes.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => customTags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.dishId, t.tagId] })],
);
