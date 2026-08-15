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

import { Search } from "lucide-react";

import { Input } from "../ui/Input";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface OrderFiltersProps {
  search: string;
  status: string;

  onSearchChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: string
  ) => void;

  resultCount: number;
}

/*
  ----------------------------------------------------------
  Status Filters
  ----------------------------------------------------------
*/

const statuses = [
  {
    value: "همه",
    label: "همه",
  },
  {
    value: "pending",
    label: "در انتظار",
  },
  {
    value: "processing",
    label: "در حال پردازش",
  },
  {
    value: "completed",
    label: "تکمیل شده",
  },
  {
    value: "cancelled",
    label: "لغو شده",
  },
];

/*
  ----------------------------------------------------------
  Order Filters
  ----------------------------------------------------------
*/

function OrderFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  resultCount,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-5">
      {/* Search */}

      <div className="relative w-full desktop:max-w-sm">
        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder="جستجوی سفارش یا مشتری..."
          className="pr-10"
        />
      </div>

      {/* Status Filters */}

      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((item) => {
          const isActive =
            status === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                onStatusChange(
                  item.value
                )
              }
              className={[
                "rounded-md px-3 py-2",
                "font-vazirmatn text-xs font-medium",
                "transition-colors",

                isActive
                  ? "bg-primary-900 text-white"
                  : "bg-background text-text-secondary hover:bg-primary-100 hover:text-text-primary",
              ].join(
                " "
              )}
            >
              {item.label}
            </button>
          );
        })}

        <span className="mr-auto font-vazirmatn text-xs text-text-secondary">
          {resultCount} سفارش
        </span>
      </div>
    </div>
  );
}

export default OrderFilters;