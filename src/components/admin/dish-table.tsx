"use client";

import { useMutation } from "@tanstack/react-query";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteDish, toggleDishAvailability } from "@/actions/dishes";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import type { DishWithCategory } from "@/types";

export function DishTable({ dishes }: { dishes: DishWithCategory[] }) {
  const router = useRouter();
  const t = useTranslations("admin.dish");

  const toggleMutation = useMutation({
    mutationFn: async (args: { id: number; isAvailable: boolean }) => {
      const result = await toggleDishAvailability(args.id, args.isAvailable);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => router.refresh(),
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteDish(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success(t("deleted"));
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  if (dishes.length === 0) {
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
            <TableHead className="w-16" />
            <TableHead>{t("colName")}</TableHead>
            <TableHead>{t("colCategory")}</TableHead>
            <TableHead>{t("colPrice")}</TableHead>
            <TableHead className="w-24">{t("colVisible")}</TableHead>
            <TableHead className="w-24 text-right">{t("colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dishes.map((dish) => (
            <TableRow key={dish.id}>
              <TableCell>
                {dish.imageUrl ? (
                  <div className="relative size-10 overflow-hidden rounded-md">
                    <Image
                      src={dish.imageUrl}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <ImageOff className="size-4" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{dish.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {dish.category.name}
              </TableCell>
              <TableCell>{formatPrice(dish.priceCents)}</TableCell>
              <TableCell>
                <Switch
                  checked={dish.isAvailable}
                  disabled={toggleMutation.isPending}
                  onCheckedChange={(checked) =>
                    toggleMutation.mutate({ id: dish.id, isAvailable: checked })
                  }
                  aria-label={dish.name}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link
                      href={`/admin/dishes/${dish.id}/edit`}
                      aria-label={t("colActions")}
                    >
                      <Pencil />
                    </Link>
                  </Button>
                  <DeleteConfirmDialog
                    title={t("deleteTitle", { name: dish.name })}
                    description={t("deleteDescription")}
                    onConfirm={() => deleteMutation.mutate(dish.id)}
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
