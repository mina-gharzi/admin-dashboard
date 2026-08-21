/*
  ==========================================================
  Input.tsx
  ----------------------------------------------------------
  Reusable Input Component
  ----------------------------------------------------------
  این کامپوننت برای تمام inputهای پروژه استفاده می‌شود.

  ویژگی‌ها:
  - TypeScript Props
  - Error State
  - Disabled State
  - Focus State
  - Tailwind Design Tokens
  ==========================================================
*/

import type { InputHTMLAttributes } from "react";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Input Props
  ----------------------------------------------------------
*/

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/*
  ----------------------------------------------------------
  Input Component
  ----------------------------------------------------------
*/

function Input({ className, error = false, ...props }: InputProps) {
  return (
    <input
      aria-invalid={error || undefined}
      className={cn(
        // Layout
        "flex h-10 w-full",

        // Typography
        "font-estedad text-sm",
        "text-text-primary",

        // Spacing
        "px-[var(--spacing-control-x)]",

        // Shape
        "rounded-[var(--radius-control)]",
        "border-[var(--border-width-default)] border",

        // Default colors
        "border-border",
        "bg-surface",

        // Placeholder
        "placeholder:text-text-secondary",

        // Focus
        "outline-none",
        "focus:border-primary-900",
        "ds-focus-ring",

        // Disabled
        "disabled:cursor-not-allowed",
        "disabled:bg-surface-muted",
        "disabled:opacity-60",

        // Error
        error && ["border-danger", "focus:border-danger", "focus:ring-danger-soft"],

        className,
      )}
      {...props}
    />
  );
}

export { Input };
