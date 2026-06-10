import type { Metadata } from "next";

import { DishForm } from "@/components/admin/dish-form";
import { getCategories } from "@/db/queries";

export const metadata: Metadata = { title: "New Dish — Admin" };

export default async function NewDishPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New dish</h1>
      {categories.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Create a category first — every dish belongs to one.
        </p>
      ) : (
        <DishForm categories={categories} />
      )}
    </div>
  );
}
