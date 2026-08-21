/*
  ==========================================================
  ProductFilters.tsx
  ----------------------------------------------------------
  نوار فیلتر صفحه‌ی محصولات — جستجو، دسته‌بندی، وضعیت.
  ==========================================================
*/

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "../ui/Input";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";

interface ProductFiltersProps {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  resultCount: number;
}

const categories = ["همه", ...PRODUCT_CATEGORIES];

const statuses = [
  { value: "همه", label: "همه وضعیت‌ها" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
];

function ProductFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  resultCount,
}: ProductFiltersProps) {
  const hasFilters =
    search.length > 0 || category !== "همه" || status !== "همه";

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("همه");
    onStatusChange("همه");
  };

  return (
    <div className="border-b border-primary-300/60 bg-surface px-5 py-4">
      <div className="flex flex-col gap-4">
        {/* Search + Status + Result Count */}
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
          <div className="relative w-full desktop:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label="جستجوی محصول"
              placeholder="جستجوی محصول..."
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

          <div className="flex h-10 items-center gap-2 rounded-xl border border-primary-300/70 bg-background/60 px-3 transition-colors focus-within:border-primary-900">
            <SlidersHorizontal size={15} className="text-text-secondary" />
            <select
              aria-label="فیلتر وضعیت محصول"
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
              پاک کردن فیلترها
            </button>
          )}

          <span className="shrink-0 font-estedad text-xs text-text-secondary desktop:mr-auto">
            {resultCount.toLocaleString("fa-IR")} محصول
          </span>
        </div>

        {/* Category Chips */}
        <div role="group" aria-label="فیلتر دسته‌بندی محصولات" className="flex flex-wrap items-center gap-1.5">
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                aria-label={`دسته‌بندی ${item}`}
                onClick={() => onCategoryChange(item)}
                className={`rounded-xl px-3 py-2 font-estedad text-[11px] font-medium transition-all active:scale-[.98] ${
                  active
                    ? "bg-primary-900 text-white shadow-sm"
                    : "text-text-secondary hover:bg-primary-50 hover:text-primary-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
