/*
  ==========================================================
  Button.tsx
  ----------------------------------------------------------
  Reusable Button component.

  مسئولیت‌ها:

  - ایجاد دکمه استاندارد برای کل پروژه
  - مدیریت Variantهای مختلف
  - مدیریت Sizeهای مختلف
  - پشتیبانی از Loading
  - پشتیبانی از Icon
  - حفظ یکپارچگی Design System
  ==========================================================
*/

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Button Variants
  ----------------------------------------------------------
*/

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

/*
  ----------------------------------------------------------
  Button Sizes
  ----------------------------------------------------------
*/

type ButtonSize = "sm" | "md" | "lg";

/*
  ----------------------------------------------------------
  Button Props
  ----------------------------------------------------------
*/

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;

  size?: ButtonSize;

  loading?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}

/*
  ----------------------------------------------------------
  Variant Styles
  ----------------------------------------------------------
*/

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn("bg-primary-900", "text-white", "hover:bg-primary-700"),

  secondary: cn("bg-primary-100", "text-primary-900", "hover:bg-primary-200"),

  outline: cn(
    "border border-border",
    "bg-surface",
    "text-text-primary",
    "hover:bg-primary-100",
  ),

  ghost: cn(
    "bg-transparent",
    "text-text-secondary",
    "hover:bg-primary-100",
    "hover:text-primary-900",
  ),

  danger: cn("bg-danger", "text-white", "hover:opacity-90"),
};

/*
  ----------------------------------------------------------
  Size Styles
  ----------------------------------------------------------
*/

const sizeStyles: Record<ButtonSize, string> = {
  sm: cn("h-9", "px-3.5", "text-xs"),

  md: cn("h-10", "px-4", "text-sm"),

  lg: cn("h-11", "px-5", "text-sm"),
};

/*
  ----------------------------------------------------------
  Button Component
  ----------------------------------------------------------
*/

function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        /*
          ------------------------------------------------
          Base Styles
          ------------------------------------------------
        */

        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2",

        "rounded-[var(--radius-control)]",

        "font-estedad",
        "font-medium",

        "whitespace-nowrap",

        "ds-transition",

        "outline-none",

        "ds-focus-ring",

        /*
          ------------------------------------------------
          Variant
          ------------------------------------------------
        */

        variantStyles[variant],

        /*
          ------------------------------------------------
          Size
          ------------------------------------------------
        */

        sizeStyles[size],

        /*
          ------------------------------------------------
          Disabled
          ------------------------------------------------
        */

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        /*
          ------------------------------------------------
          Custom Class
          ------------------------------------------------
        */

        className,
      )}
      {...props}
    >
      {/* ==================================================
          Loading
          ================================================== */}

      {loading && <Loader2 size={16} className="animate-spin" />}

      {/* ==================================================
          Right Icon
          ================================================== */}

      {!loading && rightIcon}

      {/* ==================================================
          Content
          ================================================== */}

      {children}

      {/* ==================================================
          Left Icon
          ================================================== */}

      {!loading && leftIcon}
    </button>
  );
}

export default Button;
