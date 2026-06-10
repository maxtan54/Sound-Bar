import { UtensilsCrossed } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-muted-foreground">
      <UtensilsCrossed className="size-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
