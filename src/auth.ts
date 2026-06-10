import { createHash, timingSafeEqual } from "node:crypto";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Hash both sides so buffers are equal length, then compare in constant time.
function safeCompare(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Required when self-hosting behind a proxy or non-Vercel host
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !adminEmail ||
          !adminPassword
        ) {
          return null;
        }

        if (safeCompare(email, adminEmail) && safeCompare(password, adminPassword)) {
          return { id: "admin", email: adminEmail, name: "Admin" };
        }
        return null;
      },
    }),
  ],
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
