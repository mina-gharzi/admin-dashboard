/*
  ==========================================================
  Textarea.tsx
  ----------------------------------------------------------
  Reusable Textarea Component
  ----------------------------------------------------------
  هم‌استایل با Input.tsx، برای فیلدهای متنی چندخطی
  (مثل توضیحات محصول)
  ==========================================================
*/

import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Textarea Props
  ----------------------------------------------------------
*/

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

/*
  ----------------------------------------------------------
  Textarea Component
  ----------------------------------------------------------
*/

function Textarea({ className, error = false, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex w-full",
        "min-h-24",
        "font-estedad text-sm",
        "text-text-primary",
        "px-[var(--spacing-control-x)] py-2",
        "rounded-[var(--radius-control)]",
        "border-[var(--border-width-default)] border",
        "border-border",
        "bg-surface",
        "placeholder:text-text-secondary",
        "outline-none",
        "focus:border-primary-900",
        "ds-focus-ring",
        "disabled:cursor-not-allowed",
        "disabled:bg-surface-muted",
        "disabled:opacity-60",
        "resize-none",

        error && ["border-danger", "focus:border-danger", "focus:ring-danger-soft"],

        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
