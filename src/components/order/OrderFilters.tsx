/*
  ==========================================================
  OrderFilters.tsx
  ----------------------------------------------------------
  نوار فیلتر صفحه‌ی سفارش‌ها — جستجو (شماره/مشتری/ایمیل) +
  وضعیت.
  ==========================================================
*/

import { Search, X } from "lucide-react";
import { Input } from "../ui/Input";

interface OrderFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  resultCount: number;
}

const statuses = [
  { value: "همه", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال پردازش" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
];

function OrderFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  resultCount,
}: OrderFiltersProps) {
  const hasFilters = search.length > 0 || status !== "همه";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("همه");
  };

  return (
    <div className="border-b border-primary-300/60 bg-surface px-5 py-4">
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
        <div className="relative w-full desktop:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جستجوی شماره سفارش یا مشتری..."
            className="h-10 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="پاک کردن جستجو"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-secondary transition-colors hover:bg-primary-100 hover:text-primary-900"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {statuses.map((item) => {
            const active = status === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onStatusChange(item.value)}
                className={`rounded-xl px-3 py-2 font-estedad text-[11px] font-medium transition-all active:scale-[.98] ${
                  active
                    ? "bg-primary-900 text-white shadow-sm"
                    : "text-text-secondary hover:bg-primary-50 hover:text-primary-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-8 items-center gap-1 rounded-xl px-2.5 font-estedad text-[11px] font-medium text-text-secondary transition-colors hover:bg-primary-100 hover:text-primary-900"
            >
              <X size={12} />
              پاک کردن
            </button>
          )}
        </div>

        <span className="shrink-0 font-estedad text-xs text-text-secondary">
          {resultCount.toLocaleString("fa-IR")} سفارش
        </span>
      </div>
    </div>
  );
}

export default OrderFilters;
