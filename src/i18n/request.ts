import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const LOCALES = ["de", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT: Locale = "de";

export default getRequestConfig(async () => {
  const store = await cookies();
  const raw = store.get("NEXT_LOCALE")?.value ?? DEFAULT;
  const locale: Locale = (LOCALES as readonly string[]).includes(raw)
    ? (raw as Locale)
    : DEFAULT;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
