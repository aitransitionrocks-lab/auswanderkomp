interface FAQ {
  q: string;
  a: string;
}

// Rendert FAQ-Liste + emittiert FAQPage JSON-LD.
export function FAQBlock({ items }: { items: FAQ[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div className="my-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="divide-y divide-line border-t border-line">
        {items.map((it, i) => (
          <details key={i} className="group py-4">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4 font-medium text-[17px] text-ink">
              <span>{it.q}</span>
              <span className="text-copper text-xl shrink-0 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-[1.6] text-inkSoft">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
