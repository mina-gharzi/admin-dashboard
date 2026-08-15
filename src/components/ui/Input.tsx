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

function Input({
  className,
  error = false,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        // Layout
        "flex h-10 w-full",

        // Typography
        "font-vazirmatn text-sm",
        "text-text-primary",

        // Spacing
        "px-3",

        // Shape
        "rounded-md",
        "border",

        // Default colors
        "border-border",
        "bg-surface",

        // Placeholder
        "placeholder:text-text-secondary",

        // Focus
        "outline-none",
        "focus:border-primary-900",
        "focus:ring-2",
        "focus:ring-primary-100",

        // Disabled
        "disabled:cursor-not-allowed",
        "disabled:bg-neutral-100",
        "disabled:opacity-60",

        // Error
        error && [
          "border-danger",
          "focus:border-danger",
          "focus:ring-red-100",
        ],

        className
      )}
      {...props}
    />
  );
}

export { Input };