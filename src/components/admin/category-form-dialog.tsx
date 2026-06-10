"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createCategory, updateCategory } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

export function CategoryFormDialog({
  category,
  children,
}: {
  category?: Category;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const input = {
        name: String(formData.get("name") ?? ""),
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      };
      const result = category
        ? await updateCategory(category.id, input)
        : await createCategory(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success(category ? "Category updated" : "Category created");
      setOpen(false);
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit category" : "New category"}
          </DialogTitle>
          <DialogDescription>
            Categories group dishes on the public menu.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => mutation.mutate(formData)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              name="name"
              defaultValue={category?.name ?? ""}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-sort">Sort order</Label>
            <Input
              id="category-sort"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={category?.sortOrder ?? 0}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first on the menu.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving…"
                : category
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
