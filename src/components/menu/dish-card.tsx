import Image from "next/image";
import Link from "next/link";

import { DishTags } from "@/components/menu/dish-tags";
import { ImagePlaceholder } from "@/components/menu/image-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { DishWithCategory } from "@/types";

export function DishCard({ dish }: { dish: DishWithCategory }) {
  return (
    <Link href={`/dishes/${dish.id}`} className="group">
      <Card className="h-full gap-0 overflow-hidden rounded-2xl border-border/60 py-0 shadow-md shadow-black/30 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-black/40">
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {dish.imageUrl ? (
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <CardContent className="space-y-1 p-4">
          <h3 className="font-serif text-lg font-semibold leading-snug">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {dish.description}
            </p>
          )}
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="text-sm text-muted-foreground">
              {dish.weight} {dish.weightUnit}
            </span>
            <span className="font-bold text-primary">
              {formatPrice(dish.priceCents)}
            </span>
          </div>
          <DishTags tags={dish.tags} />
        </CardContent>
      </Card>
    </Link>
  );
}
