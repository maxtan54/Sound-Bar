import { Badge } from "@/components/ui/badge";

const TAG_STYLES: Record<string, string> = {
  vegan: "bg-green-100 text-green-800 border-green-200",
  vegetarian: "bg-lime-100 text-lime-800 border-lime-200",
  spicy: "bg-red-100 text-red-800 border-red-200",
  "gluten-free": "bg-amber-100 text-amber-800 border-amber-200",
  new: "bg-blue-100 text-blue-800 border-blue-200",
};

export function DishTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className={TAG_STYLES[tag] ?? ""}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
