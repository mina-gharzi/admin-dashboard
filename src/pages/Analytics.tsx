/*
  ==========================================================
  Analytics.tsx
  ----------------------------------------------------------
  صفحه گزارشات و تحلیل‌های پیشرفته فروشگاه

  این صفحه به کامپوننت‌های src/components/analytics تقسیم
  شده (AnalyticsStats، OrdersStatusChart، CategoryChart،
  TopProducts، LowStockProducts، RecentOrdersList)؛ هر
  بخش دقیقاً همون منطق و JSX قبلی رو داره، فقط جابه‌جا شده.

  نمودار «توزیع نقش اعضای تیم» که کنار نمودار وضعیت
  سفارش‌ها بود حذف شده تا صفحه شلوغ نباشه.
  ==========================================================
*/

import PageHeader from "../components/ui/PageHeader";

import { useData } from "../hooks/useData";
import { api } from "../services/api";

import AnalyticsStats from "../components/analytics/AnalyticsStats";
import OrdersStatusChart from "../components/analytics/OrdersStatusChart";
import CategoryChart from "../components/analytics/CategoryChart";
import TopProducts from "../components/analytics/TopProducts";
import LowStockProducts from "../components/analytics/LowStockProducts";
import RecentOrdersList from "../components/analytics/RecentOrdersList";

/*
  ----------------------------------------------------------
  Analytics Component
  ----------------------------------------------------------
*/
function Analytics() {
  const {
    data: summary,
    loading,
    error,
  } = useData(() => api.analytics.getSummary(), []);

  /*
    Loading Skeleton State
  */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 w-full rounded-2xl bg-primary-100/60" />
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-primary-100/40" />
          ))}
        </div>
        <div className="h-80 w-full rounded-2xl bg-primary-100/40" />
        <div className="h-80 w-full rounded-2xl bg-primary-100/40" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-[var(--radius-panel)] border border-danger/20 bg-danger/5 p-8 text-center">
        <p className="font-estedad text-sm font-bold text-danger">
          خطا در دریافت گزارشات سیستم. لطفا دوباره تلاش کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="گزارش‌ها و تحلیل‌ها"
        description="تحلیل جامع و لحظه‌ای عملکرد فروشگاه بر اساس داده‌های زنده سیستم"
        breadcrumbs={[{ label: "گزارش‌ها" }]}
      />

      {/* Summary Cards Grid */}
      <AnalyticsStats summary={summary} />

      {/* Orders by Status */}
      <OrdersStatusChart summary={summary} />

      {/* Products by Category Bar Chart */}
      <CategoryChart summary={summary} />

      {/* Two Column: Top Products + Low Stock */}
      <section className="grid gap-6 desktop:grid-cols-2">
        <TopProducts summary={summary} />
        <LowStockProducts summary={summary} />
      </section>

      {/* Recent Orders List */}
      <RecentOrdersList summary={summary} />
    </div>
  );
}

export default Analytics;
