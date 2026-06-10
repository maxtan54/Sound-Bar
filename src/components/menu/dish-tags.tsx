import { Badge } from "@/components/ui/badge";

const TAG_STYLES: Record<string, string> = {
  vegan: "border-green-500/30 bg-green-500/10 text-green-400",
  vegetarian: "border-lime-500/30 bg-lime-500/10 text-lime-400",
  spicy: "border-red-500/30 bg-red-500/10 text-red-400",
  "gluten-free": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  new: "border-sky-500/30 bg-sky-500/10 text-sky-400",
};

export function DishTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 pt-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className={TAG_STYLES[tag] ?? ""}>
          {tag}
        </Badge>
      ))}
    </div>
  );
}
