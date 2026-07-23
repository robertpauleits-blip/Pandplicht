import type { AssessmentStatus, TopicId } from "@/rules/types";
import { STATUS_LABEL_OVERRIDES, STATUS_META } from "@/rules/topics";

const TONES = {
  yes: "bg-status-yes-bg border-status-yes-border text-status-yes-ink",
  maybe: "bg-status-maybe-bg border-status-maybe-border text-status-maybe-ink",
  no: "bg-status-no-bg border-status-no-border text-status-no-ink",
  unknown:
    "bg-status-unknown-bg border-status-unknown-border text-status-unknown-ink",
} as const;

function StatusIcon({ tone }: { tone: keyof typeof TONES }) {
  const common = {
    className: "h-4 w-4 shrink-0",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (tone) {
    case "yes":
      return (
        <svg {...common}>
          <path d="M10 3.5 17 16H3L10 3.5Z" />
          <path d="M10 8.5v3.2M10 13.9v.1" />
        </svg>
      );
    case "maybe":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7" />
          <path d="M8 8.2a2 2 0 1 1 2.7 1.9c-.5.2-.7.5-.7 1v.4M10 14v.1" />
        </svg>
      );
    case "no":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7" />
          <path d="m7 10.2 2.1 2.1L13.4 8" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7" />
          <path d="M10 6.5v4M10 13.9v.1" />
        </svg>
      );
  }
}

/**
 * Statuslabel met icoon + tekst, betekenis nooit alleen via kleur.
 */
export function StatusBadge({
  status,
  topicId,
  className = "",
}: {
  status: AssessmentStatus;
  topicId?: TopicId;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const label =
    (topicId && STATUS_LABEL_OVERRIDES[topicId]?.[status]) || meta.label;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.82rem] font-bold ${TONES[meta.tone]} ${className}`}
    >
      <StatusIcon tone={meta.tone} />
      {label}
    </span>
  );
}
