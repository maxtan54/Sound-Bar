"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export type LoginState = { error: string } | null;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dishes",
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    // signIn redirects by throwing — let Next.js handle it
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
