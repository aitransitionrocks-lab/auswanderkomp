import Link from "next/link";
import { Callout } from "./Callout";
import { ComparisonTable } from "./ComparisonTable";
import { FAQBlock } from "./FAQBlock";
import { QuizCTABox } from "./QuizCTABox";

// Component-Map für MDX. Custom-Components + getunte HTML-Defaults.
export const mdxComponents = {
  Callout,
  ComparisonTable,
  FAQBlock,
  QuizCTABox,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-serif text-[28px] leading-[1.2] text-fir tracking-tight mt-12 mb-4 scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-serif text-[22px] leading-[1.25] text-ink tracking-tight mt-8 mb-3 scroll-mt-24"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[17px] leading-[1.7] text-inkSoft my-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 space-y-2 list-disc pl-5 text-[17px] leading-[1.7] text-inkSoft" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 space-y-2 list-decimal pl-5 text-[17px] leading-[1.7] text-inkSoft" {...props} />
  ),
  a: ({ href = "#", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const internal = href.startsWith("/") || href.startsWith("#");
    if (internal) {
      return <Link href={href} className="text-copper-deep underline underline-offset-2 hover:text-fir" {...props} />;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-copper-deep underline underline-offset-2 hover:text-fir"
        {...props}
      />
    );
  },
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-2 border-copper pl-5 italic font-serif text-[18px] text-ink"
      {...props}
    />
  ),
};
