import { ArrowLeft, Flame, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DishTags } from "@/components/menu/dish-tags";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDishById } from "@/db/queries";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

async function getDishOr404(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) notFound();
  const dish = await getDishById(id);
  if (!dish || !dish.isAvailable) notFound();
  return dish;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dish = await getDishOr404(id);
  return {
    title: dish.name,
    description: dish.description ?? undefined,
  };
}

export default async function DishPage({ params }: Props) {
  const { id } = await params;
  const dish = await getDishOr404(id);

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8 md:py-12 animate-in fade-in duration-500">
      <Link
        href={`/?category=${dish.category.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to {dish.category.name}
      </Link>

      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-lg shadow-black/30">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <UtensilsCrossed className="size-12" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">{dish.category.name}</Badge>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              {dish.name}
            </h1>
          </div>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(dish.priceCents)}
          </span>
        </div>

        {dish.description && (
          <p className="text-muted-foreground">{dish.description}</p>
        )}

        <DishTags tags={dish.tags} />

        <Separator />

        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Weight</dt>
            <dd className="font-medium">
              {dish.weight} {dish.weightUnit}
            </dd>
          </div>
          {dish.calories !== null && (
            <div>
              <dt className="text-muted-foreground">Calories</dt>
              <dd className="flex items-center gap-1 font-medium">
                <Flame className="size-3.5 text-primary" />
                {dish.calories} kcal
              </dd>
            </div>
          )}
          {dish.allergens.length > 0 && (
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-muted-foreground">Allergens</dt>
              <dd className="font-medium">{dish.allergens.join(", ")}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
