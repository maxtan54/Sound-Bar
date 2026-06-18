import { getTranslations } from "next-intl/server";

import { CategoryNav } from "@/components/menu/category-nav";
import { DishCard } from "@/components/menu/dish-card";
import { EmptyState } from "@/components/menu/empty-state";
import { getAvailableDishes, getCategories } from "@/db/queries";
import { RESTAURANT_INFO } from "@/lib/restaurant";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, dishes, tMenu, tHero] = await Promise.all([
    getCategories(),
    getAvailableDishes(category),
    getTranslations("menu"),
    getTranslations("hero"),
  ]);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_50%_-20%,hsl(38_92%_50%/0.22),transparent_70%),radial-gradient(40%_80%_at_85%_110%,hsl(18_70%_35%/0.25),transparent_70%)]"
        />
        <div aria-hidden className="absolute inset-0 -z-20 bg-black/50" />
        <div className="container mx-auto px-4 py-20 text-center md:py-28 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            {tHero("label")}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-6xl">
            {RESTAURANT_INFO.name}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {RESTAURANT_INFO.tagline}
          </p>
          <div
            aria-hidden
            className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
      </section>

      <section className="container mx-auto space-y-8 px-4 py-10 md:py-14">
        <div className="space-y-2 text-center">
          <h2 className="font-serif text-2xl font-semibold md:text-3xl">
            {tMenu("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{tMenu("subtitle")}</p>
        </div>

        <CategoryNav categories={categories} activeSlug={category} />

        {dishes.length === 0 ? (
          <EmptyState
            message={category ? tMenu("emptyCategory") : tMenu("emptySoon")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
