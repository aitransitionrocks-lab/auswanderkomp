export function ComparisonTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <figure className="my-7 overflow-x-auto">
      <table className="w-full border-collapse text-[15px]">
        {caption && (
          <caption className="text-left text-[12px] uppercase tracking-[0.12em] text-muted mb-3">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-line">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left py-2.5 px-3 font-medium text-fir font-serif"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-line/60">
              {row.map((cell, ci) => (
                <td key={ci} className="py-2.5 px-3 text-inkSoft align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
