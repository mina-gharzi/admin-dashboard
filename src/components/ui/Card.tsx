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
  Card Header
  ==========================================================
*/

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col", "gap-1.5", "p-[var(--spacing-card)]", className)}
      {...props}
    />
  );
}

/*
  ==========================================================
  Card Title
  ==========================================================
*/

function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-estedad",
        "text-lg",
        "font-semibold",
        "leading-7",
        "text-text-primary",
        className,
      )}
      {...props}
    />
  );
}

/*
  ==========================================================
  Card Description
  ==========================================================
*/

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-estedad",
        "text-sm",
        "leading-5",
        "text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

/*
  ==========================================================
  Card Content
  ==========================================================
*/

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-[var(--spacing-card)]", "pb-[var(--spacing-card)]", className)} {...props} />;
}

/*
  ==========================================================
  Exports
  ==========================================================
*/

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
