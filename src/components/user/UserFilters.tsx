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

import { Search } from "lucide-react";

import { Input } from "../ui/Input";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface UserFiltersProps {
  search: string;
  role: string;

  onSearchChange: (
    value: string
  ) => void;

  onRoleChange: (
    value: string
  ) => void;

  resultCount: number;
}

/*
  ----------------------------------------------------------
  Roles
  ----------------------------------------------------------
*/

const roles = [
  {
    value: "همه",
    label: "همه",
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
  ----------------------------------------------------------
  User Filters
  ----------------------------------------------------------
*/

function UserFilters({
  search,
  role,
  onSearchChange,
  onRoleChange,
  resultCount,
}: UserFiltersProps) {
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
          placeholder="جستجوی کاربر..."
          className="pr-10"
        />
      </div>

      {/* Role Filter */}

      <div className="flex flex-wrap gap-2">
        {roles.map((item) => {
          const isActive =
            role === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                onRoleChange(
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
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Result Count */}

      <p className="shrink-0 font-vazirmatn text-xs text-text-secondary">
        {resultCount} کاربر
      </p>
    </div>
  );
}

export default UserFilters;