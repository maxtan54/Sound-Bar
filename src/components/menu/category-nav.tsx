import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  const pillClass = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-1.5 text-sm whitespace-nowrap transition-colors",
      active
        ? "border-primary bg-primary font-medium text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
    );

  return (
    <nav
      className="flex justify-start gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
      aria-label="Menu categories"
    >
      <Link href="/" className={pillClass(!activeSlug)}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/?category=${category.slug}`}
          className={pillClass(activeSlug === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
