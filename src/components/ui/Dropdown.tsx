/*
  ==========================================================
  Dropdown.tsx
  ----------------------------------------------------------
  Smart Dropdown
  - Fixed positioning
  - جلوگیری از بریده شدن داخل table / overflow
  - باز شدن خودکار بالا یا پایین
  - جلوگیری از خروج از چپ و راست صفحه
  - حفظ API قبلی
  ==========================================================
*/

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger?: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  showChevron?: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
  placement: "top" | "bottom";
}

function Dropdown({
  trigger,
  items,
  align = "right",
  className,
  showChevron = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /*
    ==========================================================
    Calculate Menu Position
    ==========================================================
  */

  const updatePosition = () => {
    const triggerElement = triggerRef.current;
    const menuElement = menuRef.current;

    if (!triggerElement || !menuElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const menuRect = menuElement.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const GAP = 8;
    const EDGE_PADDING = 8;

    /*
      --------------------------------------------------------
      Vertical Position
      --------------------------------------------------------
    */

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    const shouldOpenUp =
      spaceBelow < menuRect.height + GAP && spaceAbove >= menuRect.height + GAP;

    let top: number;
    let placement: "top" | "bottom";

    if (shouldOpenUp) {
      top = triggerRect.top - menuRect.height - GAP;
      placement = "top";
    } else {
      top = triggerRect.bottom + GAP;
      placement = "bottom";
    }

    /*
      --------------------------------------------------------
      Horizontal Position
      --------------------------------------------------------
    */

    let left: number;

    if (align === "right") {
      left = triggerRect.right - menuRect.width;
    } else {
      left = triggerRect.left;
    }

    /*
      --------------------------------------------------------
      Keep inside viewport
      --------------------------------------------------------
    */

    const maxLeft = viewportWidth - menuRect.width - EDGE_PADDING;

    left = Math.max(EDGE_PADDING, Math.min(left, maxLeft));

    /*
      --------------------------------------------------------
      Extra vertical safety
      --------------------------------------------------------
    */

    const maxTop = viewportHeight - menuRect.height - EDGE_PADDING;

    top = Math.max(EDGE_PADDING, Math.min(top, maxTop));

    setMenuPosition({
      top,
      left,
      placement,
    });
  };

  /*
    ==========================================================
    Open → Calculate Position
    ==========================================================
  */

  useLayoutEffect(() => {
    if (!open) return;

    /*
      یک فریم صبر می‌کنیم تا منو Render شود
      و ارتفاع/عرض واقعی آن را داشته باشیم.
    */
    requestAnimationFrame(() => {
      updatePosition();
    });
  }, [open, items.length]);

  /*
    ==========================================================
    Update Position On Scroll / Resize
    ==========================================================
  */

  useEffect(() => {
    if (!open) return;

    const handlePositionUpdate = () => {
      updatePosition();
    };

    window.addEventListener("resize", handlePositionUpdate);

    /*
      capture = true
      باعث می‌شود Scroll داخل container جدول
      هم باعث آپدیت موقعیت Dropdown شود.
    */
    window.addEventListener("scroll", handlePositionUpdate, true);

    return () => {
      window.removeEventListener("resize", handlePositionUpdate);

      window.removeEventListener("scroll", handlePositionUpdate, true);
    };
  }, [open]);

  /*
    ==========================================================
    Click Outside
    ==========================================================
  */

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedTrigger = triggerRef.current?.contains(target);

      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  /*
    ==========================================================
    Escape (و برگردوندن فوکوس به trigger)
    ==========================================================
  */

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /*
    ==========================================================
    Keyboard: موقع باز شدن منو، فوکوس میره روی اولین گزینه
    (برای دسترسی‌پذیری کیبورد کامل)
    ==========================================================
  */

  useEffect(() => {
    if (!open) return;

    const enabledIndex = items.findIndex((item) => !item.disabled);
    if (enabledIndex === -1) return;

    // یک فریم صبر می‌کنیم تا دکمه‌های منو mount بشن
    const frame = requestAnimationFrame(() => {
      itemRefs.current[enabledIndex]?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open, items]);

  /*
    ==========================================================
    Roving focus بین آیتم‌های منو با کلیدهای جهت‌دار
    ==========================================================
  */

  const focusItemAt = (index: number) => {
    const total = items.length;
    if (total === 0) return;

    let nextIndex = ((index % total) + total) % total;
    let attempts = 0;

    while (items[nextIndex]?.disabled && attempts < total) {
      nextIndex = (nextIndex + 1) % total;
      attempts += 1;
    }

    itemRefs.current[nextIndex]?.focus();
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent) => {
    const currentIndex = itemRefs.current.findIndex(
      (el) => el === document.activeElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItemAt(currentIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItemAt(currentIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItemAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItemAt(items.length - 1);
    }
  };

  /*
    ==========================================================
    باز/بسته کردن با کیبورد از روی Trigger
    ==========================================================
  */

  const handleTriggerKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
    } else if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  /*
    ==========================================================
    Render
    ==========================================================
  */

  const triggerElement = isValidElement(trigger) ? (trigger as ReactElement<any>) : null;

  return (
    <div ref={triggerRef} className={cn("relative inline-block", className)}>
      {/* ====================================================
          Trigger
          ==================================================== */}

      {triggerElement ? (
        cloneElement(triggerElement, {
          ref: triggerButtonRef,
          onClick: (event: React.MouseEvent) => {
            triggerElement.props.onClick?.(event);
            setOpen((current) => !current);
          },
          onKeyDown: (event: React.KeyboardEvent) => {
            triggerElement.props.onKeyDown?.(event);
            if (event.defaultPrevented) return;
            handleTriggerKeyDown(event);
          },
          ...(triggerElement.type === "button"
            ? {}
            : {
                role: "button",
                tabIndex: 0,
              }),
          "aria-haspopup": "menu",
          "aria-expanded": open,
          "aria-controls": menuId,
          className: cn(
            triggerElement.props.className,
            "ds-focus-ring",
          ),
        })
      ) : (
        <button
          ref={triggerButtonRef as React.RefObject<HTMLButtonElement>}
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-control)]",
            "border border-primary-300/70 bg-surface",
            "px-3 py-2 font-estedad text-sm text-text-primary",
            "transition-colors",
            "hover:bg-primary-100 hover:text-primary-900",
            "focus-visible:outline-none",
            "ds-focus-ring",
          )}
        >
          <span>گزینه‌ها</span>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={cn(
              "transition-transform ds-transition",
              open && "rotate-180",
            )}
          />
        </button>
      )}
      {/* ====================================================
          Menu
          ==================================================== */}

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="گزینه‌ها"
          onKeyDown={handleMenuKeyDown}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
            zIndex: 9999,
          }}
          className={cn(
            "min-w-45",
            "overflow-hidden rounded-[var(--radius-control)]",
            "border border-primary-300/70",
            "bg-surface/95 backdrop-blur-sm",
            "p-1.5",
            "shadow-[var(--shadow-popover)]",
            "animate-in fade-in-50 zoom-in-95",
          )}
        >
          {items.map((item, index) => {
            const showDivider =
              item.danger && index > 0 && !items[index - 1].danger;

            return (
              <div key={item.label}>
                {showDivider && <div className="my-1 h-px bg-primary-100/80" />}

                <button
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return;

                    item.onClick();
                    setOpen(false);
                    triggerButtonRef.current?.focus();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5",
                    "rounded-xl px-3 py-2",
                    "font-estedad text-[12px] font-medium leading-6",
                    "text-text-primary",
                    "transition-colors",
                    "hover:bg-primary-100/60",
                    "focus-visible:outline-none focus-visible:bg-primary-100/60",
                    item.danger && "text-danger hover:bg-danger/10",
                    item.disabled && "cursor-not-allowed opacity-50",
                  )}
                  role="menuitem"
                  tabIndex={-1}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Dropdown };
