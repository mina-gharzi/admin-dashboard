/*
  ==========================================================
  components/ui/DetailState.tsx
  ----------------------------------------------------------
  الگوی تکراری «Loading / یافت نشد یا خطا (+ تلاش مجدد +
  بازگشت)» که تو صفحات جزئیات (OrderDetails، ProductDetails،
  CustomerDetails) عیناً تکرار شده بود، اینجا یک‌بار
  پیاده‌سازی شده.

  عمداً به‌جای یک کامپوننت "wrapper" که children رو قورت
  بده، دو کامپوننت جدا export شدن (DetailLoadingState و
  DetailMissingState) تا صفحات همون الگوی early-return قبلی
  رو حفظ کنن:

    if (loading) {
      return <DetailLoadingState text="در حال بارگذاری..." />;
    }

    if (error || !product) {
      return (
        <DetailMissingState
          icon={Package}
          title="محصول مورد نظر پیدا نشد"
          description="ممکن است محصول حذف شده یا شناسه واردشده اشتباه باشد."
          error={error}
          onRetry={refetch}
          backLabel="بازگشت به محصولات"
          onBack={() => navigate("/dashboard/products")}
        />
      );
    }

    // از این‌جا به بعد TypeScript خودش product رو non-null
    // narrow می‌کنه — دقیقاً مثل قبل، چون شرط if هنوز مستقیماً
    // روی همون متغیره.
  ==========================================================
*/

import type { ComponentType, ReactNode } from "react";

import { ArrowRight, RefreshCw } from "lucide-react";

import Button from "./Button";

/*
  ==========================================================
  DetailLoadingState
  ==========================================================
*/

interface DetailLoadingStateProps {
  text: string;
}

export function DetailLoadingState({ text }: DetailLoadingStateProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
        <p className="font-estedad text-sm text-text-secondary">{text}</p>
      </div>
    </div>
  );
}

/*
  ==========================================================
  DetailMissingState
  ==========================================================
*/

interface DetailMissingStateProps {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  iconStrokeWidth?: number;
  title: string;
  description: ReactNode;

  /** فقط وقتی error پر باشه دکمه‌ی «تلاش مجدد» نشون داده میشه */
  error: Error | null;
  onRetry: () => void;

  backLabel: string;
  onBack: () => void;
}

export function DetailMissingState({
  icon: Icon,
  iconStrokeWidth,
  title,
  description,
  error,
  onRetry,
  backLabel,
  onBack,
}: DetailMissingStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
        <Icon size={25} strokeWidth={iconStrokeWidth} />
      </div>

      <p className="font-estedad text-sm font-semibold text-text-primary">
        {title}
      </p>

      <p className="max-w-md font-estedad text-xs leading-6 text-text-secondary">
        {description}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {error && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw size={16} />
            تلاش مجدد
          </Button>
        )}
        <Button onClick={onBack}>
          <ArrowRight size={17} />
          {backLabel}
        </Button>
      </div>
    </div>
  );
}
