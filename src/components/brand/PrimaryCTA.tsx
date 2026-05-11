import Link from "next/link";
import { Arrow } from "./Arrow";

interface Props {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "filled" | "ghost" | "accent";
  size?: "lg" | "md";
  className?: string;
  type?: "button" | "submit";
}

export function PrimaryCTA({
  href,
  onClick,
  children,
  variant = "filled",
  size = "lg",
  className = "",
  type = "button",
}: Props) {
  const base =
    "inline-flex items-center gap-2.5 rounded-pill font-medium tracking-tight transition-transform duration-150 ease-out hover:-translate-y-px active:translate-y-0";
  const sizing =
    size === "lg" ? "px-7 py-[18px] text-[17px]" : "px-5 py-3 text-[14.5px]";

  const variants: Record<string, string> = {
    filled:
      "bg-fir text-paper shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-12px_rgba(30,58,52,0.7)] hover:bg-fir-deep",
    ghost:
      "bg-transparent text-fir border border-fir hover:bg-fir hover:text-paper",
    accent:
      "bg-copper text-fir hover:bg-copper-deep hover:text-paper",
  };

  const cls = `${base} ${sizing} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
        <Arrow size={size === "lg" ? 16 : 13} />
      </Link>
    );
  }
  return (
    <button onClick={onClick} type={type} className={cls}>
      {children}
      <Arrow size={size === "lg" ? 16 : 13} />
    </button>
  );
}
