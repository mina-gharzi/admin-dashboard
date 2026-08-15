/*
  ==========================================================
  Badge.tsx
  ----------------------------------------------------------
  Reusable Badge Component
  ----------------------------------------------------------
  Badge برای نمایش وضعیت‌ها و برچسب‌های کوچک استفاده می‌شود.

  مثال:
  - Active
  - Pending
  - Failed
  - Paid
  - New
  ==========================================================
*/

import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Badge Variants
  ----------------------------------------------------------
*/

const badgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "whitespace-nowrap",

    "rounded-md",

    "px-2",
    "py-1",

    "font-vazirmatn",
    "text-xs",
    "font-medium",
  ],
  {
    variants: {
      variant: {
        success: [
          "bg-green-100",
          "text-success",
        ],

        warning: [
          "bg-amber-100",
          "text-amber-700",
        ],

        danger: [
          "bg-red-100",
          "text-danger",
        ],

        info: [
          "bg-sky-100",
          "text-info",
        ],

        primary: [
          "bg-primary-100",
          "text-primary-900",
        ],

        neutral: [
          "bg-slate-100",
          "text-text-secondary",
        ],
      },
    },

    defaultVariants: {
      variant: "neutral",
    },
  }
);

/*
  ----------------------------------------------------------
  Badge Props
  ----------------------------------------------------------
*/

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/*
  ----------------------------------------------------------
  Badge Component
  ----------------------------------------------------------
*/

function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export {
  Badge,
  badgeVariants,
};