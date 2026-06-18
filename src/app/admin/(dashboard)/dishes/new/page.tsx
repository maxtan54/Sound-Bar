import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DishForm } from "@/components/admin/dish-form";
import { getCategories } from "@/db/queries";

export const metadata: Metadata = { title: "New Dish — Admin" };

export default async function NewDishPage() {
  const [categories, t] = await Promise.all([
    getCategories(),
    getTranslations("admin.dish"),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("newDish")}</h1>
      {categories.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("noCategoryYet")}
        </p>
      ) : (
        <DishForm categories={categories} />
      )}
    </div>
  );
}
