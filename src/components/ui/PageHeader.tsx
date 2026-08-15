/*
  ==========================================================
  PageHeader.tsx
  ----------------------------------------------------------
  Header مشترک صفحات Admin Dashboard.

  مسئولیت‌ها:

  - نمایش Breadcrumb
  - نمایش عنوان صفحه
  - نمایش توضیحات صفحه
  - نمایش Actionهای اختیاری مثل دکمه افزودن
  ==========================================================
*/

import type { ReactNode } from "react";

import Breadcrumb from "./Breadcrumb";

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
  PageHeader Props
  ----------------------------------------------------------
*/

interface PageHeaderProps {
  title: string;

  description?: string;

  breadcrumbs?: BreadcrumbItem[];

  actions?: ReactNode;

  className?: string;
}

/*
  ----------------------------------------------------------
  PageHeader Component
  ----------------------------------------------------------
*/

function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6",
        className,
      )}
    >
      {/* ==================================================
          Breadcrumb
          ================================================== */}

      {breadcrumbs.length > 0 && (
        <div className="mb-3">
          <Breadcrumb
            items={breadcrumbs}
          />
        </div>
      )}

      {/* ==================================================
          Header Content
          ================================================== */}

      <div
        className={cn(
          "flex flex-col gap-4",
          "tablet:flex-row",
          "tablet:items-end",
          "tablet:justify-between",
        )}
      >
        {/* ==================================================
            Title & Description
            ================================================== */}

        <div>
          <h1
            className={cn(
              "font-vazirmatn",
              "text-2xl font-bold",
              "text-text-primary",
              "tablet:text-3xl",
            )}
          >
            {title}
          </h1>

          {description && (
            <p
              className={cn(
                "mt-1.5",
                "font-vazirmatn",
                "text-sm",
                "text-text-secondary",
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* ==================================================
            Actions
            ================================================== */}

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;