import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DishForm } from "@/components/admin/dish-form";
import { getCategories, getDishById } from "@/db/queries";

export const metadata: Metadata = { title: "Edit Dish — Admin" };

export default async function EditDishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dishId = Number(id);
  if (!Number.isInteger(dishId)) notFound();

  const [dish, categories] = await Promise.all([
    getDishById(dishId),
    getCategories(),
  ]);
  if (!dish) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit dish</h1>
      <DishForm dish={dish} categories={categories} />
    </div>
  );
}
