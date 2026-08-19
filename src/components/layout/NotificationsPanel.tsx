/*
  ==========================================================
  NotificationsPanel.tsx
  ----------------------------------------------------------
  پنل اعلان‌های Header
  ----------------------------------------------------------
  برخلاف یه سیستم اعلان Mock ثابت، این پنل از داده‌های
  واقعی محاسبه میشه:

  - محصولاتی که موجودی‌شون کمه (از api.analytics)
  - سفارش‌هایی که در وضعیت «در انتظار» هستن

  summary/loading از Header پاس داده میشن تا هم دکمه‌ی زنگ
  (نقطه‌ی قرمز) و هم این پنل از یک fetch مشترک استفاده کنن
  و دوباره‌کاری در درخواست شبکه پیش نیاد.

  با کلیک بیرون از پنل یا Escape بسته میشه.
  ==========================================================
*/

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock3, PackageX } from "lucide-react";

import type { api } from "../../services/api";
import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

type AnalyticsSummary = Awaited<ReturnType<typeof api.analytics.getSummary>>;

interface NotificationsPanelProps {
  summary: AnalyticsSummary | null | undefined;
  loading: boolean;
  onClose: () => void;
}

/*
  ----------------------------------------------------------
  NotificationsPanel Component
  ----------------------------------------------------------
*/

function NotificationsPanel({
  summary,
  loading,
  onClose,
}: NotificationsPanelProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  /*
    بستن با کلیک بیرون یا Escape
  */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const lowStockCount = summary?.lowStockProducts.length ?? 0;
  const pendingCount = summary?.ordersByStatus.pending ?? 0;
  const hasNotifications = lowStockCount > 0 || pendingCount > 0;

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute left-0 top-full z-40 mt-2",
        "w-80",
        "overflow-hidden rounded-2xl",
        "border border-primary-300/70",
        "bg-surface",
        "shadow-lg",
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="font-estedad text-sm font-semibold text-text-primary">
          اعلان‌ها
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading && (
          <p className="p-4 text-center font-estedad text-xs text-text-secondary">
            در حال بارگذاری...
          </p>
        )}

        {!loading && !hasNotifications && (
          <p className="p-4 text-center font-estedad text-xs text-text-secondary">
            اعلان جدیدی وجود ندارد.
          </p>
        )}

        {!loading && pendingCount > 0 && (
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/orders");
              onClose();
            }}
            className="flex w-full items-start gap-3 px-4 py-3 text-right transition-colors hover:bg-background"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock3 size={16} />
            </div>
            <div>
              <p className="font-estedad text-xs font-medium text-text-primary">
                {pendingCount} سفارش در انتظار بررسی
              </p>
              <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                برای مشاهده کلیک کنید
              </p>
            </div>
          </button>
        )}

        {!loading && lowStockCount > 0 && (
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/products");
              onClose();
            }}
            className="flex w-full items-start gap-3 px-4 py-3 text-right transition-colors hover:bg-background"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-danger">
              <PackageX size={16} />
            </div>
            <div>
              <p className="font-estedad text-xs font-medium text-text-primary">
                {lowStockCount} محصول موجودی کم دارد
              </p>
              <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                {summary?.lowStockProducts
                  .slice(0, 2)
                  .map((p) => p.name)
                  .join("، ")}
                {lowStockCount > 2 && " و ..."}
              </p>
            </div>
          </button>
        )}
      </div>

      {hasNotifications && (
        <div className="border-t border-border px-4 py-2.5">
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/analytics");
              onClose();
            }}
            className="flex w-full items-center justify-center gap-1.5 font-estedad text-xs font-medium text-primary-900 hover:underline"
          >
            <AlertTriangle size={13} />
            مشاهده گزارش کامل
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;
