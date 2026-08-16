/*
  ==========================================================
  OrderFilters.tsx
  ----------------------------------------------------------
  Orders filtering toolbar.
  ----------------------------------------------------------
  مسئولیت:

  - جستجوی سفارش
  - فیلتر وضعیت سفارش
  - نمایش تعداد سفارش‌های پیدا شده
  ==========================================================
*/

/*
  ==========================================================
  OrderFilters.tsx
  ----------------------------------------------------------
  Orders filtering toolbar — Dashboard design language
  ==========================================================
*/

import { Search } from "lucide-react";
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
  return (
    <div className="border-b border-primary-300/80 bg-surface/40 px-6 py-5">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full desktop:max-w-85">
          <Search
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جستجوی سفارش یا مشتری..."
            className="h-10 pr-10"
          />
        </div>

        {/* Status Pills + Count */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((item) => {
            const isActive = status === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onStatusChange(item.value)}
                className={[
                  "rounded-2xl px-3.5 py-2",
                  "font-vazirmatn text-xs font-medium",
                  "transition-all duration-200",
                  "active:scale-[0.97]",
                  isActive
                    ? "bg-primary-900 text-white shadow-sm"
                    : "bg-background text-text-secondary hover:bg-primary-100 hover:text-primary-900",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}

          <span className="mr-auto inline-flex items-center rounded-2xl bg-primary-50 px-3 py-1.5 font-vazirmatn text-xs font-medium text-primary-900">
            {resultCount} سفارش
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderFilters;
