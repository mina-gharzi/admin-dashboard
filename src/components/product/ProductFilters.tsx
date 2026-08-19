import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/Input";

interface ProductFiltersProps {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  resultCount: number;
}

const categories = ["همه", "موبایل", "لپ‌تاپ", "هدفون", "ساعت هوشمند"];

function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  resultCount,
}: ProductFiltersProps) {
  return (
    <div className="border-b border-primary-300/60 bg-surface px-5 py-4">
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative w-full desktop:max-w-sm">
            <Search size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="جستجوی محصول..."
              className="h-10 pr-10"
            />
          </div>
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-900 tablet:flex">
            <SlidersHorizontal size={16} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
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

        <span className="shrink-0 font-estedad text-xs text-text-secondary">
          {resultCount.toLocaleString("fa-IR")} محصول
        </span>
      </div>
    </div>
  );
}

export default ProductFilters;
