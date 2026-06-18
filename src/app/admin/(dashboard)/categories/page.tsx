import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { CategoryTable } from "@/components/admin/category-table";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/db/queries";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function CategoriesPage() {
  const [categories, t] = await Promise.all([
    getCategories(),
    getTranslations("admin.category"),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("pageTitle")}</h1>
        <CategoryFormDialog>
          <Button size="sm">
            <Plus />
            {t("newCategory")}
          </Button>
        </CategoryFormDialog>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
