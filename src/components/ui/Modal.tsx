/*
  ==========================================================
  Modal.tsx
  ----------------------------------------------------------
  Reusable Modal Component
  ----------------------------------------------------------
  این کامپوننت برای نمایش محتوای مهم روی صفحه استفاده می‌شود.

  مثال:
  - Delete confirmation
  - Create user
  - Edit product
  - View details

  ویژگی‌ها:
  - Controlled component
  - Escape برای بستن
  - Backdrop
  - Header / Content / Footer
  ==========================================================
*/

import { useEffect, useRef, type ReactNode } from "react";

import { X } from "lucide-react";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Focusable elements selector — برای پیدا کردن اعضای قابل
  فوکوس داخل مودال (برای focus trap و فوکوس اولیه)
  ----------------------------------------------------------
*/
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
  ----------------------------------------------------------
  Modal Props
  ----------------------------------------------------------
*/

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/*
  ----------------------------------------------------------
  Modal Component
  ----------------------------------------------------------
*/

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  /*
    --------------------------------------------------------
    Close modal with Escape
    --------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  /*
    --------------------------------------------------------
    Focus management: موقع باز شدن، فوکوس رو از پشت صفحه
    می‌گیریم و می‌بریم داخل مودال؛ موقع بسته شدن، فوکوس رو
    به همون عنصری که مودال رو باز کرده بود برمی‌گردونیم.
    Tab هم داخل مودال قفل میشه (focus trap) تا کاربر با
    کیبورد به پشت مودال نره.
    --------------------------------------------------------
  */

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const dialogNode = dialogRef.current;
    const focusables = dialogNode
      ? Array.from(dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];

    (focusables[0] ?? dialogNode)?.focus();

    function handleTabTrap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableEls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTabTrap);

    return () => {
      document.removeEventListener("keydown", handleTabTrap);
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  /*
    --------------------------------------------------------
    قفل اسکرول پشت صفحه وقتی مودال بازه
    --------------------------------------------------------
  */

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /*
    اگر Modal باز نیست چیزی Render نمی‌کنیم.
  */

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}

      <button
        type="button"
        aria-label="بستن مودال"
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}

      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-lg",
          "overflow-hidden",
          "rounded-[var(--radius-panel)]",
          "border border-border",
          "bg-surface",
          "shadow-[var(--shadow-modal)]",
          "outline-none",
          className,
        )}
      >
        {/* Header */}

        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border p-6">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="font-estedad text-lg font-semibold text-text-primary"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 font-estedad text-sm text-text-secondary">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "rounded-md p-1.5",
                "text-text-secondary",
                "transition-colors",
                "hover:bg-primary-100",
                "hover:text-primary-900",
                "focus-visible:outline-none",
                "ds-focus-ring",
              )}
              aria-label="بستن"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}

        <div className="p-6">{children}</div>

        {/* Footer */}

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border bg-background p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Modal };
