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

/*
  ==========================================================
  Button.tsx
  ----------------------------------------------------------
  Reusable Button component
  ----------------------------------------------------------
*/

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

/*
  ==========================================================
  Types
  ==========================================================
*/

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/*
  ==========================================================
  Variant Styles
  ----------------------------------------------------------
  Clean / professional / dashboard style
  ==========================================================
*/

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-primary-900",
    "text-white",
    "border border-primary-900",

    "hover:bg-primary-800",
    "hover:border-primary-800",

    "active:bg-primary-950",
    "active:border-primary-950",

    "shadow-sm",
  ),

  secondary: cn(
    "bg-primary-100",
    "text-primary-900",
    "border border-primary-100",

    "hover:bg-primary-200",
    "hover:border-primary-200",

    "active:bg-primary-200",
  ),

  outline: cn(
    "bg-surface",
    "text-text-primary",
    "border border-border",

    "hover:bg-primary-50",
    "hover:border-primary-300",

    "active:bg-primary-100",
  ),

  ghost: cn(
    "bg-transparent",
    "text-text-secondary",
    "border border-transparent",

    "hover:bg-primary-50",
    "hover:text-primary-900",

    "active:bg-primary-100",
  ),

  danger: cn(
    "bg-danger",
    "text-white",
    "border border-danger",

    "hover:brightness-95",

    "active:brightness-90",

    "shadow-sm",
  ),
};

/*
  ==========================================================
  Size Styles
  ==========================================================
*/

const sizeStyles: Record<ButtonSize, string> = {
  sm: cn("h-9", "px-3.5", "text-xs", "gap-1.5"),

  md: cn("h-10", "px-4", "text-sm", "gap-2"),

  lg: cn("h-11", "px-5", "text-sm", "gap-2"),
};

/*
  ==========================================================
  Button Component
  ==========================================================
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
          --------------------------------------------------
          Base
          --------------------------------------------------
        */

        "inline-flex",
        "items-center",
        "justify-center",

        "rounded-lg",

        "font-vazirmatn",
        "font-medium",
        "whitespace-nowrap",

        "transition-all",
        "duration-150",

        "select-none",

        "outline-none",

        /*
          --------------------------------------------------
          Interaction
          --------------------------------------------------
        */

        "active:scale-[0.98]",

        "focus-visible:ring-2",
        "focus-visible:ring-primary-300",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-surface",

        /*
          --------------------------------------------------
          Disabled
          --------------------------------------------------
        */

        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        /*
          --------------------------------------------------
          Variant
          --------------------------------------------------
        */

        variantStyles[variant],

        /*
          --------------------------------------------------
          Size
          --------------------------------------------------
        */

        sizeStyles[size],

        /*
          --------------------------------------------------
          Custom
          --------------------------------------------------
        */

        className,
      )}
      {...props}
    >
      {/* Loading */}

      {loading && (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      )}

      {/* Right Icon */}

      {!loading && rightIcon}

      {/* Content */}

      {children}

      {/* Left Icon */}

      {!loading && leftIcon}
    </button>
  );
}

export default Button;
