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
          "font-vazirmatn text-sm",
          "text-text-primary",
          "px-3 pl-9",
          "rounded-md",
          "border",
          "border-border",
          "bg-surface",
          "outline-none",
          "focus:border-primary-900",
          "focus:ring-2",
          "focus:ring-primary-100",
          "disabled:cursor-not-allowed",
          "disabled:bg-neutral-100",
          "disabled:opacity-60",

          error && [
            "border-danger",
            "focus:border-danger",
            "focus:ring-red-100",
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
