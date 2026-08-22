/*
  ==========================================================
  components/ui/ResourceState.tsx
  ----------------------------------------------------------
  الگوی تکراری «Loading / Error (+ تلاش مجدد) / خالی» که تو
  تقریباً همه‌ی صفحات لیستی (محصولات، سفارش‌ها، کاربران،
  مشتریان، تیم) عیناً تکرار شده بود، اینجا یک‌بار پیاده‌سازی
  شده.

  استفاده:

  <Card>
    <SomeFilters ... />

    <ResourceState
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingText="در حال بارگذاری محصولات..."
      isEmpty={!!items && items.length === 0}
      emptyIcon={Package}
      emptyTitle="هنوز محصولی ثبت نشده است"
      emptyDescription="برای شروع، اولین محصول فروشگاه را اضافه کنید."
      emptyAction={<Button onClick={openCreateModal}>افزودن اولین محصول</Button>}
    >
      این children فقط وقتی رندر میشه که loading نباشه،
      error نباشه و isEmpty هم نباشه:
      <ProductTable products={filteredProducts} />
    </ResourceState>
  </Card>

  نکته: حالت «با فیلتر چیزی پیدا نشد» (وقتی داده هست ولی
  فیلتر همه رو حذف کرده) عمداً اینجا مدل نشده، چون بین
  صفحات فرق داره (بعضی پیام جدا دارن، بعضی خودِ جدول
  مدیریتش می‌کنه) — همون‌طور که قبلاً بود، داخل children
  هرکدوم می‌مونه.
  ==========================================================
*/

import type { ComponentType, ReactNode } from "react";

import { AlertCircle } from "lucide-react";

import Button from "./Button";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface ResourceStateProps {
  loading: boolean;
  error: Error | null;
  loadingText: string;

  /** اگه پاس داده بشه، دکمه‌ی «تلاش مجدد» تو حالت خطا نشون داده میشه */
  onRetry?: () => void;

  isEmpty?: boolean;
  emptyIcon?: ComponentType<{ size?: number }>;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;

  children: ReactNode;
}

/*
  ==========================================================
  ResourceState Component
  ==========================================================
*/

function ResourceState({
  loading,
  error,
  loadingText,
  onRetry,
  isEmpty = false,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: ResourceStateProps) {
  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
          <p className="font-estedad text-sm text-text-secondary">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <AlertCircle size={24} />
        </div>

        <p className="font-estedad text-sm font-medium text-text-primary">
          خطا در دریافت اطلاعات
        </p>

        <p className="font-estedad text-xs text-text-secondary">
          {error.message}
        </p>

        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
            تلاش مجدد
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-12 text-center">
        {EmptyIcon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
            <EmptyIcon size={24} />
          </div>
        )}

        {emptyTitle && (
          <p className="font-estedad text-sm font-bold text-text-primary">
            {emptyTitle}
          </p>
        )}

        {emptyDescription && (
          <p className="font-estedad text-xs text-text-secondary">
            {emptyDescription}
          </p>
        )}

        {emptyAction}
      </div>
    );
  }

  return <>{children}</>;
}

export default ResourceState;
