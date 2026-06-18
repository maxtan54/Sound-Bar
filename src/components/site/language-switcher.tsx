"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { setLocale } from "@/actions/locale";

const LOCALES = ["de", "en"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: string) => {
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-muted-foreground/50 text-xs select-none px-0.5">
              |
            </span>
          )}
          <button
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
        </span>
      ))}
    </div>
  );
}
