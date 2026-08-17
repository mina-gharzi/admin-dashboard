/*
  ==========================================================
  Breadcrumb.tsx
  ----------------------------------------------------------
  Reusable breadcrumb component.

  مسئولیت‌ها:
  - نمایش مسیر فعلی کاربر
  - نمایش لینک صفحات قبلی
  - نمایش صفحه فعلی
  ==========================================================
*/

import { ChevronLeft, Home } from "lucide-react";

import { Link } from "react-router-dom";

import { cn } from "../../utils/cn";

/*
  ----------------------------------------------------------
  Breadcrumb Item Type
  ----------------------------------------------------------
*/

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/*
  ----------------------------------------------------------
  Breadcrumb Props
  ----------------------------------------------------------
*/

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/*
  ----------------------------------------------------------
  Breadcrumb Component
  ----------------------------------------------------------
*/

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="font-estedad">
      <ol className={cn("flex items-center gap-1.5", "text-xs tablet:text-sm")}>
        {/* ==================================================
            Home
            ================================================== */}

        <li className="flex items-center">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-1.5",
              "text-text-secondary",
              "transition-colors",
              "hover:text-primary-900",
            )}
          >
            <Home size={15} />

            <span className="hidden tablet:inline">داشبورد</span>
          </Link>
        </li>

        {/* ==================================================
            Items
            ================================================== */}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
            >
              {/* Separator */}

              <ChevronLeft size={14} className="text-text-secondary" />

              {/* Item */}

              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    "text-text-secondary",
                    "transition-colors",
                    "hover:text-primary-900",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn("font-medium", "text-text-primary")}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
