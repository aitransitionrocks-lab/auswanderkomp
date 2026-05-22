import { DEFAULT_AUTHOR } from "@/lib/blog/meta";

export function AuthorBox() {
  const a = DEFAULT_AUTHOR;
  return (
    <div className="mt-12 pt-8 border-t border-line flex items-start gap-4">
      <div className="w-12 h-12 rounded-pill bg-highlight shrink-0 flex items-center justify-center font-serif text-fir text-lg">
        {a.name.charAt(0)}
      </div>
      <div>
        <div className="font-serif text-[17px] text-ink">{a.name}</div>
        <div className="text-[12px] uppercase tracking-[0.1em] text-copper mb-1.5">
          {a.role}
        </div>
        <p className="text-[14px] text-inkSoft leading-[1.5] max-w-[55ch]">
          {a.bio}
        </p>
      </div>
    </div>
  );
}
