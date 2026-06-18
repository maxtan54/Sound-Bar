"use client";

import { useMutation } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteCategory } from "@/actions/categories";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "@/types";

export function CategoryTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const t = useTranslations("admin.category");

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteCategory(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success(t("deleted"));
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  if (categories.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("colName")}</TableHead>
            <TableHead>{t("colSlug")}</TableHead>
            <TableHead className="w-28">{t("colSortOrder")}</TableHead>
            <TableHead className="w-24 text-right">{t("colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.slug}
              </TableCell>
              <TableCell>{category.sortOrder}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <CategoryFormDialog category={category}>
                    <Button variant="ghost" size="icon-sm" aria-label={t("colActions")}>
                      <Pencil />
                    </Button>
                  </CategoryFormDialog>
                  <DeleteConfirmDialog
                    title={t("deleteTitle", { name: category.name })}
                    description={t("deleteDescription")}
                    onConfirm={() => deleteMutation.mutate(category.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("colActions")}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </DeleteConfirmDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
