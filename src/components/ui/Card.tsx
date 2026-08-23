/*
  ==========================================================
  Card.tsx
  ----------------------------------------------------------
  Reusable Card Components
  ----------------------------------------------------------
  Card برای نمایش محتوا در بخش‌های مختلف Dashboard استفاده
  می‌شود؛ مثل آمار، نمودار، جدول و اطلاعات کاربران.
  ==========================================================
*/

import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

/*
  ==========================================================
  Card
  ==========================================================
*/

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)]",
        "border-[var(--border-width-default)] border-border",
        "bg-surface",
        "text-text-primary",
        "shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

/*
  ==========================================================
  Exports
  ==========================================================
*/

export { Card };
