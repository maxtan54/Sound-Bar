import {
  Coffee,
  CookingPot,
  Pizza,
  Salad,
  Soup,
  UtensilsCrossed,
} from "lucide-react";

const ICONS = [UtensilsCrossed, Soup, Pizza, Salad, Coffee, CookingPot];

// Decorative fallback for dishes without a photo: the food icons cycled
// into a tiled pattern, rotated 40°.
export function ImagePlaceholder({ iconClass = "size-7" }: { iconClass?: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-1/4 flex rotate-45 flex-wrap content-center items-center justify-center gap-7">
        {Array.from({ length: 96 }).map((_, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Icon key={i} className={`${iconClass} text-muted-foreground/25`} />
          );
        })}
      </div>
    </div>
  );
}
