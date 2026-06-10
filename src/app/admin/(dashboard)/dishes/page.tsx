import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DishTable } from "@/components/admin/dish-table";
import { Button } from "@/components/ui/button";
import { getAllDishes } from "@/db/queries";

export const metadata: Metadata = { title: "Dishes — Admin" };

export default async function DishesPage() {
  const dishes = await getAllDishes();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dishes</h1>
        <Button size="sm" asChild>
          <Link href="/admin/dishes/new">
            <Plus />
            New dish
          </Link>
        </Button>
      </div>
      <DishTable dishes={dishes} />
    </div>
  );
}
