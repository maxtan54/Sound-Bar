import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

  const [dish, categories, t] = await Promise.all([
    getDishById(dishId),
    getCategories(),
    getTranslations("admin.dish"),
  ]);
  if (!dish) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("editDish")}</h1>
      <DishForm dish={dish} categories={categories} />
    </div>
  );
}
