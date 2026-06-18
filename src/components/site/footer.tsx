import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { RESTAURANT_INFO } from "@/lib/restaurant";
import { LanguageSwitcher } from "./language-switcher";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-lg font-semibold">
            {RESTAURANT_INFO.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {RESTAURANT_INFO.tagline}
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href={RESTAURANT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={RESTAURANT_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <FacebookIcon className="size-5" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("navigation")}
          </p>
          <nav className="flex flex-col gap-2" aria-label="Footer">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("menu")}
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("contacts")}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {RESTAURANT_INFO.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a
                href={`tel:${RESTAURANT_INFO.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-foreground"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" />
              {RESTAURANT_INFO.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {RESTAURANT_INFO.name}.{" "}
            {t("rightsReserved")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
