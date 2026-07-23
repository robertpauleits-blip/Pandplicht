import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-[background-color,color,transform,box-shadow] duration-200 focus-visible:outline-3 focus-visible:outline-action focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "cta-btn bg-pine text-white hover:bg-pine-dark active:bg-pine-dark shadow-soft hover:-translate-y-0.5",
  secondary:
    "bg-surface text-pine border-2 border-pine/25 hover:border-pine/60 hover:-translate-y-0.5",
  ghost: "text-pine hover:bg-mint-soft",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.95rem] min-h-[44px]",
  lg: "px-7 py-3.5 text-[1.05rem] min-h-[52px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href"
  >) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
