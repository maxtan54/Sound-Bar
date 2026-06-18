import { z } from "zod";

export const DISH_TAGS = [
  "vegan",
  "vegetarian",
  "spicy",
  "gluten-free",
  "new",
] as const;
export type DishTag = (typeof DISH_TAGS)[number];

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  sortOrder: z.number().int().min(0).default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// Authoritative server-side schema — actions parse against this.
export const dishSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().max(2000).nullable(),
  categoryId: z.number().int().positive("Category is required"),
  imageUrl: z.url().nullable(),
  weight: z.number().int().positive("Weight must be a positive number"),
  weightUnit: z.enum(["g", "ml"]),
  priceCents: z.number().int().positive("Price must be greater than zero"),
  calories: z.number().int().positive().nullable(),
  allergens: z.array(z.string().trim().min(1)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  isAvailable: z.boolean().default(true),
});
export type DishInput = z.infer<typeof dishSchema>;

// Client form schema — strings as the inputs produce them; converted to
// DishInput on submit.
export const dishFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().max(2000),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string(),
  weight: z
    .string()
    .regex(/^\d+$/, "Enter a whole number"),
  weightUnit: z.enum(["g", "ml"]),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a price like 12.50"),
  calories: z.string().regex(/^\d*$/, "Enter a whole number"),
  allergens: z.string(),
  tags: z.array(z.string().trim().min(1)),
  isAvailable: z.boolean(),
});
export type DishFormValues = z.infer<typeof dishFormSchema>;

export function dishFormToInput(values: DishFormValues): DishInput {
  return {
    name: values.name,
    description: values.description || null,
    categoryId: Number(values.categoryId),
    imageUrl: values.imageUrl || null,
    weight: Number(values.weight),
    weightUnit: values.weightUnit,
    priceCents: Math.round(Number(values.price) * 100),
    calories: values.calories ? Number(values.calories) : null,
    allergens: values.allergens
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean),
    tags: values.tags,
    isAvailable: values.isAvailable,
  };
}
