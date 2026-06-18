"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("admin.category");

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
      toast.success(category ? t("updated") : t("created"));
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
            {category ? t("editCategory") : t("newCategory")}
          </DialogTitle>
          <DialogDescription>
            {t("dialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => mutation.mutate(formData)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="category-name">{t("nameLabel")}</Label>
            <Input
              id="category-name"
              name="name"
              defaultValue={category?.name ?? ""}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-sort">{t("sortOrderLabel")}</Label>
            <Input
              id="category-sort"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={category?.sortOrder ?? 0}
            />
            <p className="text-xs text-muted-foreground">
              {t("sortOrderHint")}
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? t("saving")
                : category
                  ? t("saveChanges")
                  : t("createCategory")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
