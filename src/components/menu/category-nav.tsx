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
      "rounded-full border px-4 py-1.5 text-sm transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "bg-background text-muted-foreground hover:bg-accent",
    );

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Menu categories">
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
