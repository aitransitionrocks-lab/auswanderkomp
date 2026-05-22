import Link from "next/link";

export const PAGE_SIZE = 10;

interface Props {
  current: number;
  total: number;
  basePath?: string; // default /blog, page n → /blog/seite/n
}

export function Pagination({ current, total, basePath = "/blog" }: Props) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;

  const href = (n: number) => (n === 1 ? basePath : `${basePath}/seite/${n}`);

  return (
    <nav
      aria-label="Seiten-Navigation"
      className="flex items-center justify-center gap-2 mt-12"
    >
      {current > 1 && (
        <Link
          href={href(current - 1)}
          className="px-4 py-2 rounded-pill border border-line text-[14px] hover:border-fir"
        >
          ← Zurück
        </Link>
      )}
      <span className="text-[13px] text-muted px-3">
        Seite {current} von {pages}
      </span>
      {current < pages && (
        <Link
          href={href(current + 1)}
          className="px-4 py-2 rounded-pill border border-line text-[14px] hover:border-fir"
        >
          Weiter →
        </Link>
      )}
    </nav>
  );
}
