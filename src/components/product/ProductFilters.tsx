/*
  ==========================================================
  ProductFilters.tsx
  ----------------------------------------------------------
  Product filtering toolbar.
  ----------------------------------------------------------
  مسئولیت این Component:
  
  - جستجوی محصول
  - فیلتر دسته‌بندی
  - نمایش تعداد نتایج
  ==========================================================
*/

import {
  Search,
} from "lucide-react";

import { Input } from "../ui/Input";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface ProductFiltersProps {
  search: string;
  category: string;

  onSearchChange: (
    value: string
  ) => void;

  onCategoryChange: (
    value: string
  ) => void;

  resultCount: number;
}

/*
  ----------------------------------------------------------
  Categories
  ----------------------------------------------------------
*/

const categories = [
  "همه",
  "موبایل",
  "لپ‌تاپ",
  "هدفون",
  "ساعت هوشمند",
];

/*
  ----------------------------------------------------------
  Product Filters
  ----------------------------------------------------------
*/

function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  resultCount,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-5 desktop:flex-row desktop:items-center desktop:justify-between">
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
          placeholder="جستجوی محصول..."
          className="pr-10"
        />
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => {
          const isActive =
            category === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() =>
                onCategoryChange(item)
              }
              className={[
                "rounded-md px-3 py-2",
                "font-vazirmatn text-xs font-medium",
                "transition-colors",

                isActive
                  ? "bg-primary-900 text-white"
                  : "bg-background text-text-secondary hover:bg-primary-100 hover:text-text-primary",
              ].join(" ")}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Result Count */}

      <p className="shrink-0 font-vazirmatn text-xs text-text-secondary">
        {resultCount} محصول
      </p>
    </div>
  );
}

export default ProductFilters;