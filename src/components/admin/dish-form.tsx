"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDish, updateDish } from "@/actions/dishes";
import { createCustomTag, deleteCustomTag, updateCustomTag } from "@/actions/tags";
import { ImageUpload } from "@/components/admin/image-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  dishFormSchema,
  dishFormToInput,
  type DishFormValues,
} from "@/lib/validations";
import type { Category, Dish } from "@/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function DishForm({
  dish,
  categories,
  customTags: initialCustomTags = [],
}: {
  dish?: Dish;
  categories: Category[];
  customTags?: string[];
}) {
  const router = useRouter();
  const t = useTranslations("admin.dish");
  const customTagInputRef = useRef<HTMLInputElement>(null);
  const [persistedTags, setPersistedTags] = useState<string[]>(initialCustomTags);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const editTagInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: dish
      ? {
          name: dish.name,
          description: dish.description ?? "",
          categoryId: String(dish.categoryId),
          imageUrl: dish.imageUrl ?? "",
          weight: String(dish.weight),
          weightUnit: dish.weightUnit,
          price: (dish.priceCents / 100).toFixed(2),
          calories: dish.calories ? String(dish.calories) : "",
          allergens: dish.allergens.join(", "),
          tags: dish.tags,
          isAvailable: dish.isAvailable,
        }
      : {
          name: "",
          description: "",
          categoryId: "",
          imageUrl: "",
          weight: "",
          weightUnit: "g",
          price: "",
          calories: "",
          allergens: "",
          tags: [],
          isAvailable: true,
        },
  });

  const mutation = useMutation({
    mutationFn: async (values: DishFormValues) => {
      const input = dishFormToInput(values);
      const result = dish
        ? await updateDish(dish.id, input)
        : await createDish(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success(dish ? t("updated") : t("created"));
      router.push("/admin/dishes");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const { errors } = form.formState;

  async function addCustomTag(currentTags: string[], onChange: (v: string[]) => void) {
    const raw = customTagInputRef.current?.value.trim().toLowerCase() ?? "";
    if (!raw) return;
    if (!currentTags.includes(raw)) {
      onChange([...currentTags, raw]);
    }
    if (customTagInputRef.current) customTagInputRef.current.value = "";
    if (!persistedTags.includes(raw)) {
      const result = await createCustomTag(raw);
      if (result.success) {
        setPersistedTags((prev) => [...prev, raw].sort());
      }
    }
  }

  async function handleDeleteTag(tag: string, selectedTags: string[], onChange: (v: string[]) => void) {
    const result = await deleteCustomTag(tag);
    if (!result.success) { toast.error(result.error); return; }
    setPersistedTags((prev) => prev.filter((t) => t !== tag));
    if (selectedTags.includes(tag)) onChange(selectedTags.filter((t) => t !== tag));
  }

  async function handleRenameTag(oldName: string, selectedTags: string[], onChange: (v: string[]) => void) {
    const newName = editTagInputRef.current?.value.trim().toLowerCase() ?? "";
    if (!newName || newName === oldName) { setEditingTag(null); return; }
    const result = await updateCustomTag(oldName, newName);
    if (!result.success) { toast.error(result.error); return; }
    setPersistedTags((prev) => prev.map((t) => (t === oldName ? newName : t)).sort());
    if (selectedTags.includes(oldName)) onChange(selectedTags.map((t) => (t === oldName ? newName : t)));
    setEditingTag(null);
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      className="max-w-2xl space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <Input id="name" {...form.register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("descriptionLabel")}</Label>
        <Textarea id="description" rows={3} {...form.register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="space-y-2">
        <Label>{t("photoLabel")}</Label>
        <Controller
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("categoryLabel")}</Label>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.categoryId?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t("priceLabel")}</Label>
          <Input id="price" inputMode="decimal" placeholder="12.50" {...form.register("price")} />
          <FieldError message={errors.price?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">{t("weightLabel")}</Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              inputMode="numeric"
              placeholder="350"
              {...form.register("weight")}
            />
            <Controller
              control={form.control}
              name="weightUnit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError message={errors.weight?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calories">{t("caloriesLabel")}</Label>
          <Input id="calories" inputMode="numeric" {...form.register("calories")} />
          <FieldError message={errors.calories?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergens">{t("allergensLabel")}</Label>
        <Input
          id="allergens"
          placeholder={t("allergensPlaceholder")}
          {...form.register("allergens")}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("tagsLabel")}</Label>
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {persistedTags.map((tag) => {
                  const active = field.value.includes(tag);
                  if (editingTag === tag) {
                    return (
                      <div key={tag} className="flex items-center gap-1">
                        <Input
                          ref={editTagInputRef}
                          defaultValue={tag}
                          className="h-6 w-32 px-2 text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); handleRenameTag(tag, field.value, field.onChange); }
                            if (e.key === "Escape") setEditingTag(null);
                          }}
                        />
                        <Button type="button" size="sm" className="h-6 px-2 text-xs" onClick={() => handleRenameTag(tag, field.value, field.onChange)}>
                          Save
                        </Button>
                        <button type="button" className="opacity-60 hover:opacity-100" onClick={() => setEditingTag(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div key={tag} className="flex items-center gap-0.5 group">
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            active
                              ? field.value.filter((t) => t !== tag)
                              : [...field.value, tag],
                          )
                        }
                      >
                        <Badge
                          variant={active ? "default" : "outline"}
                          className={cn("cursor-pointer", !active && "text-muted-foreground")}
                        >
                          {tag}
                        </Badge>
                      </button>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                        onClick={() => setEditingTag(tag)}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                        onClick={() => handleDeleteTag(tag, field.value, field.onChange)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Input
                  ref={customTagInputRef}
                  placeholder="Add custom tag…"
                  className="max-w-56"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag(field.value, field.onChange);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCustomTag(field.value, field.onChange)}
                >
                  Add
                </Button>
              </div>

              {field.value.filter((t) => !persistedTags.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value
                    .filter((t) => !persistedTags.includes(t))
                    .map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-0.5 rounded-sm opacity-60 hover:opacity-100"
                          onClick={() => field.onChange(field.value.filter((t) => t !== tag))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-3">
        <Controller
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <Switch
              id="isAvailable"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isAvailable">{t("visibleLabel")}</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? t("saving")
            : dish
              ? t("saveChanges")
              : t("createDish")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dishes")}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
