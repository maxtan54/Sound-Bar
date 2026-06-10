import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { CategoryTable } from "@/components/admin/category-table";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/db/queries";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <CategoryFormDialog>
          <Button size="sm">
            <Plus />
            New category
          </Button>
        </CategoryFormDialog>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
