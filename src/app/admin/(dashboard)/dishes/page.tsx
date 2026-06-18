import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { DishTable } from "@/components/admin/dish-table";
import { Button } from "@/components/ui/button";
import { getAllDishes } from "@/db/queries";

export const metadata: Metadata = { title: "Dishes — Admin" };

export default async function DishesPage() {
  const [dishes, t] = await Promise.all([
    getAllDishes(),
    getTranslations("admin.dish"),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("pageTitle")}</h1>
        <Button size="sm" asChild>
          <Link href="/admin/dishes/new">
            <Plus />
            {t("newDish")}
          </Link>
        </Button>
      </div>
      <DishTable dishes={dishes} />
    </div>
  );
}
