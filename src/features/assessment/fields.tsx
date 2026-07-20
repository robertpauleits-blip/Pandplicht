"use client";

import type { ReactNode } from "react";

/**
 * Toegankelijke formulierbouwstenen voor de wizard:
 * fieldset/legend-groepen, radiokaarten en checkboxkaarten.
 */

export function FieldGroup({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mb-7">
      <legend className="text-[1.05rem] font-bold text-ink">{legend}</legend>
      {hint ? <p className="mt-1 text-sm text-ink-soft">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

export function RadioCards<T extends string>({
  name,
  value,
  onChange,
  options,
  columns = 2,
}: {
  name: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: string; description?: string }[];
  columns?: 1 | 2 | 3;
}) {
  const grid =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";
  return (
    <div className={`grid gap-2.5 ${grid}`}>
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-card border-2 px-4 py-3 transition-colors ${
              checked
                ? "border-action bg-mint-soft"
                : "border-line bg-surface hover:border-action/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="mt-1 h-4 w-4 shrink-0 accent-pine"
            />
            <span>
              <span className="font-semibold text-ink">{opt.label}</span>
              {opt.description ? (
                <span className="mt-0.5 block text-sm text-ink-soft">
                  {opt.description}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function CheckboxCards<T extends string>({
  values,
  onChange,
  options,
}: {
  values: T[];
  onChange: (v: T[]) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const checked = values.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-card border-2 px-4 py-3 transition-colors ${
              checked
                ? "border-action bg-mint-soft"
                : "border-line bg-surface hover:border-action/50"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? values.filter((v) => v !== opt.value)
                    : [...values, opt.value],
                )
              }
              className="h-4 w-4 shrink-0 accent-pine"
            />
            <span className="font-semibold text-ink">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function TextInput({
  id,
  label,
  hint,
  error,
  ...rest
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
} & React.ComponentPropsWithoutRef<"input">) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mb-1 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        aria-describedby={
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none ${
          error ? "border-coral" : "border-line focus:border-action"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-coral-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
