"use client";

import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  const links = [
    { href: "/admin/dishes", label: t("dishes") },
    { href: "/admin/categories", label: t("categories") },
  ];

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <span className="font-semibold">{t("title")}</span>
        <nav className="flex flex-1 items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                pathname.startsWith(link.href)
                  ? "bg-accent font-medium"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" target="_blank">
            {t("viewSite")}
            <ExternalLink />
          </Link>
        </Button>
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut />
            {t("logOut")}
          </Button>
        </form>
      </div>
    </header>
  );
}
