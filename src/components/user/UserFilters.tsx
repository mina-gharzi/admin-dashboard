/*
  ==========================================================
  UserFilters.tsx
  ----------------------------------------------------------
  Users filtering toolbar.
  ----------------------------------------------------------
  مسئولیت این Component:

  - جستجوی کاربر
  - فیلتر نقش کاربر
  - نمایش تعداد نتایج
  ==========================================================
*/

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "../ui/Input";

/*
  ==========================================================
  UserFilters
  ----------------------------------------------------------
  Search + Role Filter
  ==========================================================
*/

interface UserFiltersProps {
  search: string;
  role: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;

  resultCount: number;
}

/*
  ==========================================================
  Roles
  ==========================================================
*/

const roles = [
  {
    value: "همه",
    label: "همه نقش‌ها",
  },
  {
    value: "admin",
    label: "مدیر",
  },
  {
    value: "manager",
    label: "مدیر فروش",
  },
  {
    value: "customer",
    label: "مشتری",
  },
];

/*
  ==========================================================
  Component
  ==========================================================
*/

function UserFilters({
  search,
  role,
  onSearchChange,
  onRoleChange,
  resultCount,
}: UserFiltersProps) {
  const hasFilters =
    search.length > 0 || role !== "همه";

  const clearFilters = () => {
    onSearchChange("");
    onRoleChange("همه");
  };

  return (
    <div className="border-b border-border p-5">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
        {/* Search */}

        <div className="relative w-full desktop:max-w-md">
          <Search
            size={17}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="جستجوی نام، ایمیل یا شناسه..."
            className="h-10 pr-10"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
              aria-label="پاک کردن جستجو"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filter */}

        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3">
            <SlidersHorizontal
              size={16}
              className="text-text-secondary"
            />

            <select
              value={role}
              onChange={(event) =>
                onRoleChange(event.target.value)
              }
              className="h-full cursor-pointer bg-transparent font-vazirmatn text-sm text-text-primary outline-none"
            >
              {roles.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear */}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 rounded-md px-3 font-vazirmatn text-xs font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Result Count */}

        <div className="desktop:mr-auto">
          <span className="font-vazirmatn text-xs text-text-secondary">
            {resultCount} نتیجه
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserFilters;