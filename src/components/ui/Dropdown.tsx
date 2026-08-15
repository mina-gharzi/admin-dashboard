/*
  ==========================================================
  Dropdown.tsx
  ----------------------------------------------------------
  Reusable Dropdown Menu
  ----------------------------------------------------------
  برای نمایش منوهای کوچک و Actionهای مرتبط استفاده می‌شود.
  ==========================================================
*/

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Dropdown Item
  ----------------------------------------------------------
*/

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

/*
  ----------------------------------------------------------
  Dropdown Props
  ----------------------------------------------------------
*/

interface DropdownProps {
  trigger?: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

/*
  ----------------------------------------------------------
  Dropdown Component
  ----------------------------------------------------------
*/

function Dropdown({
  trigger,
  items,
  align = "right",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
    --------------------------------------------------------
    Close when clicking outside
    --------------------------------------------------------
  */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
    --------------------------------------------------------
    Close with Escape
    --------------------------------------------------------
  */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "relative inline-block",
        className
      )}
    >
      {/* Trigger */}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-2",
          "rounded-md",
          "border border-border",
          "bg-surface",
          "px-3 py-2",
          "font-vazirmatn text-sm",
          "text-text-primary",
          "transition-colors",
          "hover:bg-primary-100",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-primary-900"
        )}
      >
        {trigger ?? "Options"}

        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Menu */}

      {open && (
        <div
          className={cn(
            "absolute top-full z-40 mt-2 min-w-48",
            "overflow-hidden",
            "rounded-lg",
            "border border-border",
            "bg-surface",
            "p-1",
            "shadow-md",

            align === "right" && "right-0",
            align === "left" && "left-0"
          )}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2",
                "rounded-md",
                "px-3 py-2",
                "font-vazirmatn text-sm",
                "text-text-primary",
                "transition-colors",
                "hover:bg-primary-100",

                item.danger &&
                  "text-danger hover:bg-red-50",

                item.disabled &&
                  "cursor-not-allowed opacity-50"
              )}
              role="menuitem"
            >
              {item.icon}

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { Dropdown };