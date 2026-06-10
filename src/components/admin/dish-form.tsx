"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDish, updateDish } from "@/actions/dishes";
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
  DISH_TAGS,
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
}: {
  dish?: Dish;
  categories: Category[];
}) {
  const router = useRouter();

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
          tags: dish.tags.filter((t): t is DishFormValues["tags"][number] =>
            (DISH_TAGS as readonly string[]).includes(t),
          ),
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
      toast.success(dish ? "Dish updated" : "Dish created");
      router.push("/admin/dishes");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const { errors } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      className="max-w-2xl space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...form.register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
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
          <Label>Category</Label>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
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
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" inputMode="decimal" placeholder="12.50" {...form.register("price")} />
          <FieldError message={errors.price?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight / volume</Label>
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
          <Label htmlFor="calories">Calories (optional)</Label>
          <Input id="calories" inputMode="numeric" {...form.register("calories")} />
          <FieldError message={errors.calories?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergens">Allergens (comma-separated, optional)</Label>
        <Input
          id="allergens"
          placeholder="nuts, dairy, gluten"
          {...form.register("allergens")}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {DISH_TAGS.map((tag) => {
                const active = field.value.includes(tag);
                return (
                  <button
                    key={tag}
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
                );
              })}
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
        <Label htmlFor="isAvailable">Visible on the public menu</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving…"
            : dish
              ? "Save changes"
              : "Create dish"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dishes")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
