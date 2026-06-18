import { auth } from "@/auth";

// Next.js 16: proxy.ts replaces middleware.ts. Coarse redirect layer only —
// real enforcement lives in the admin layout and in every server action.
export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !isLoggedIn
  ) {
    return Response.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (pathname === "/admin/login" && isLoggedIn) {
    return Response.redirect(new URL("/admin/dishes", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
