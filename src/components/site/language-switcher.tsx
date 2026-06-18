"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className="flex items-center gap-0.5">
      {(["de", "en"] as const).map((l, i) => (
        <>
          {i > 0 && (
            <span key={`sep-${l}`} className="text-muted-foreground/50 text-xs select-none">
              |
            </span>
          )}
          <button
            key={l}
            onClick={() => switchLocale(l)}
            disabled={isPending || locale === l}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              locale === l
                ? "font-semibold text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.toUpperCase()}
          </button>
        </>
      ))}
    </div>
  );
}
