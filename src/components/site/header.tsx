"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { RESTAURANT_INFO } from "@/lib/restaurant";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="size-5 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-wide">
            {RESTAURANT_INFO.name}
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground",
              pathname === "/"
                ? "font-medium text-primary"
                : "text-muted-foreground",
            )}
          >
            {t("menu")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
