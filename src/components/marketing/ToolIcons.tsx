const common = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function IconPand({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M5 27V13l8-6 8 6v14" />
      <path d="M21 27V11h6v16" />
      <path d="M11 27v-6h4v6" />
      <path d="m20 18 2 2 4-4.5" strokeWidth={2.4} />
    </svg>
  );
}

export function IconMeter({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M6 24a10 10 0 1 1 20 0" />
      <path d="M16 24l5-8" />
      <circle cx="16" cy="24" r="2" fill="currentColor" stroke="none" />
      <path d="M8.5 17.5 7 16.5M16 12v-2M23.5 17.5l1.5-1" />
      <path d="M4 28h24" />
    </svg>
  );
}

export function IconGrid({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M9 28V10M9 10l-5 6M9 10l5 6M4 16h10" />
      <path d="M23 28V10M23 10l-5 6M23 10l5 6M18 16h10" />
      <path d="M9 20c4.5 2.5 9.5 2.5 14 0" strokeDasharray="2.5 4" />
    </svg>
  );
}

export function IconBattery({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="5" y="10" width="20" height="14" rx="3" />
      <path d="M27 15v4" strokeWidth={3} />
      <path d="m15 12.5-3.5 5h4l-2.5 4.5 6.5-6.5h-3.5l2.5-3h-3.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
