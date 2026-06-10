import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminProviders } from "@/components/admin/providers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminProviders>
      <div className="min-h-screen bg-muted/40">
        <AdminNav />
        <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
      </div>
    </AdminProviders>
  );
}
