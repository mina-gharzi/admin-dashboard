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

import { useEffect, type ReactNode } from "react";

import { X } from "lucide-react";

import { cn } from "../../utils/cn";

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
    >
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}

      <div
        className={cn(
          "relative z-10 w-full max-w-lg",
          "overflow-hidden",
          "rounded-xl",
          "border border-border",
          "bg-surface",
          "shadow-lg",
          className,
        )}
      >
        {/* Header */}

        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border p-6">
            <div>
              {title && (
                <h2 className="font-estedad text-lg font-semibold text-text-primary">
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
                "focus-visible:ring-2",
                "focus-visible:ring-primary-900",
              )}
              aria-label="Close"
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
