import type { ElementType, ReactNode } from "react";

export function Container({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-10 xl:px-14 ${className}`}
    >
      {children}
    </Tag>
  );
}
