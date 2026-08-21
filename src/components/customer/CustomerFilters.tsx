/*
  ==========================================================
  CustomerFilters.tsx
  ----------------------------------------------------------
  فیلتر صفحه‌ی مشتریان — جستجو (نام/ایمیل) + وضعیت.
  برخلاف UserFilters قدیمی، اینجا فیلتر «نقش» معنی نداره
  چون مشتری‌ها نقش سیستمی ندارن.
  ==========================================================
*/

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../ui/Input";

interface CustomerFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  resultCount: number;
}

const statuses = [
  { value: "همه", label: "همه وضعیت‌ها" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
];

function CustomerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  resultCount,
}: CustomerFiltersProps) {
  const hasFilters = search.length > 0 || status !== "همه";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("همه");
  };

  return (
    <div className="border-b border-primary-300/60 p-4 tablet:p-5">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
        {/* Search */}
        <div className="relative w-full desktop:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="جستجوی نام یا ایمیل مشتری"
            placeholder="جستجوی نام یا ایمیل مشتری..."
            className="h-10 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-secondary transition-colors hover:bg-primary-100 hover:text-primary-900"
              aria-label="پاک کردن جستجو"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-primary-300/70 bg-background/60 px-3 transition-colors focus-within:border-primary-900">
            <SlidersHorizontal size={15} className="text-text-secondary" />
            <select
              aria-label="فیلتر وضعیت مشتری"
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              className="h-full cursor-pointer bg-transparent font-estedad text-xs text-text-primary outline-none"
            >
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center gap-1 rounded-xl px-3 font-estedad text-xs font-medium text-text-secondary transition-colors hover:bg-primary-100 hover:text-primary-900"
            >
              <X size={13} />
              پاک کردن
            </button>
          )}
        </div>

        {/* Result Count */}
        <div className="desktop:mr-auto">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-100/50 px-3 py-1.5 font-estedad text-xs font-medium text-primary-900">
            <span className="font-inter font-bold">
              {resultCount.toLocaleString("fa-IR")}
            </span>
            نتیجه
          </span>
        </div>
      </div>
    </div>
  );
}

export default CustomerFilters;
