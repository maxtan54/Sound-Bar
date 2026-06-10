import { CategoryNav } from "@/components/menu/category-nav";
import { DishCard } from "@/components/menu/dish-card";
import { EmptyState } from "@/components/menu/empty-state";
import { getAvailableDishes, getCategories } from "@/db/queries";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, dishes] = await Promise.all([
    getCategories(),
    getAvailableDishes(category),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-4 md:p-6">
      <header className="space-y-1 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
        <p className="text-muted-foreground">
          Fresh dishes, made to order.
        </p>
      </header>

      <CategoryNav categories={categories} activeSlug={category} />

      {dishes.length === 0 ? (
        <EmptyState
          message={
            category
              ? "No dishes in this category yet."
              : "The menu is coming soon — check back shortly."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </main>
  );
}
