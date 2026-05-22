import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./mdx-components";

// Velite kompiliert MDX → Function-Body-String. Hier zu React-Komponente lösen.
// Läuft server-side bei SSG → kein Client-JS für statische Inhalte.
function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
