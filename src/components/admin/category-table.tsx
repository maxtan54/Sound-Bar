"use client";

import { useMutation } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteCategory(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Category deleted");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  if (categories.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No categories yet. Create one to start building the menu
      </p>
    );
  }

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-28">Sort order</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
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
                    <Button variant="ghost" size="icon-sm" aria-label="Edit">
                      <Pencil />
                    </Button>
                  </CategoryFormDialog>
                  <DeleteConfirmDialog
                    title={`Delete “${category.name}”?`}
                    description="Dishes in this category must be moved or deleted first."
                    onConfirm={() => deleteMutation.mutate(category.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
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
