import { CATEGORY_LABEL, type Category } from "@/lib/blog/meta";

interface Props {
  category: Category;
  label?: string;
}

export function CategoryBadge({ category, label }: Props) {
  return (
    <span className="inline-block text-[10px] uppercase tracking-[0.14em] text-copper font-medium">
      {label ?? CATEGORY_LABEL[category]}
    </span>
  );
}
