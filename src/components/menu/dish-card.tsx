import { UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DishTags } from "@/components/menu/dish-tags";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { DishWithCategory } from "@/types";

export function DishCard({ dish }: { dish: DishWithCategory }) {
  return (
    <Link href={`/dishes/${dish.id}`} className="group">
      <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3] bg-muted">
          {dish.imageUrl ? (
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <UtensilsCrossed className="size-8" />
            </div>
          )}
        </div>
        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight">{dish.name}</h3>
            <span className="shrink-0 font-semibold">
              {formatPrice(dish.priceCents)}
            </span>
          </div>
          {dish.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {dish.description}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {dish.weight} {dish.weightUnit}
            </span>
            <DishTags tags={dish.tags} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
