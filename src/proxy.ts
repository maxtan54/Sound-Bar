import createIntlMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import { routing } from "@/i18n/routing";

// Next.js 16: proxy.ts replaces middleware.ts. Coarse redirect layer only —
// real enforcement lives in the admin layout and in every server action.

const intlMiddleware = createIntlMiddleware(routing);

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && !isLoggedIn) {
      return Response.redirect(new URL("/admin/login", req.nextUrl));
    }
    if (pathname === "/admin/login" && isLoggedIn) {
      return Response.redirect(new URL("/admin/dishes", req.nextUrl));
    }
    return;
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)", "/admin/:path*"],
};
