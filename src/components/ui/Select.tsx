/*
  ==========================================================
  Select.tsx
  ----------------------------------------------------------
  Reusable Select Component
  ----------------------------------------------------------
  select استاندارد پروژه، هم‌استایل با Input.tsx
  ==========================================================
*/

import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Select Props
  ----------------------------------------------------------
*/

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

/*
  ----------------------------------------------------------
  Select Component
  ----------------------------------------------------------
*/

function Select({ className, error = false, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full appearance-none",
          "font-estedad text-sm",
          "text-text-primary",
          "px-[var(--spacing-control-x)] pl-9",
          "rounded-[var(--radius-control)]",
          "border-[var(--border-width-default)] border",
          "border-border",
          "bg-surface",
          "outline-none",
          "focus:border-primary-900",
          "ds-focus-ring",
          "disabled:cursor-not-allowed",
          "disabled:bg-surface-muted",
          "disabled:opacity-60",

          error && [
            "border-danger",
            "focus:border-danger",
            "focus:ring-danger-soft",
          ],

          className,
        )}
        {...props}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
    </div>
  );
}

export { Select };
