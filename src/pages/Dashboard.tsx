/*
  ==========================================================
  Dashboard.tsx
  ----------------------------------------------------------
  Admin Dashboard
  ----------------------------------------------------------
  طراحی هماهنگ با Global Design System
  رنگ اصلی: Primary Palette

  این صفحه به کامپوننت‌های src/components/dashboard تقسیم
  شده (DashboardStats، OrdersOverview، RecentOrders،
  TopProducts، DashboardActivity، RevenueChart)؛ هر بخش
  دقیقاً همون منطق و JSX قبلی رو داره، فقط جابه‌جا شده.
  ==========================================================
*/

import { useAuthStore } from "../store";

import { CalendarDays, RefreshCw, AlertCircle } from "lucide-react";

import { useData } from "../hooks/useData";
import { api } from "../services/api";

import DashboardStats from "../components/dashboard/DashboardStats";
import OrdersOverview from "../components/dashboard/OrdersOverview";
import RecentOrders from "../components/dashboard/RecentOrders";
import TopProducts from "../components/dashboard/TopProducts";
import DashboardActivity from "../components/dashboard/DashboardActivity";
import RevenueChart from "../components/dashboard/RevenueChart";

/*
  ==========================================================
  Dashboard Component
  ==========================================================
*/

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const {
    data: summary,
    loading,
    error,
    refetch,
  } = useData(() => api.analytics.getSummary(), []);

  /*
    ========================================================
    Loading State
    ========================================================
  */

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Hero Skeleton */}
        <section className="relative overflow-hidden rounded-2xl border border-primary-300/40 bg-primary-900 p-6 shadow-lg tablet:p-7">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary-700/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-primary-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 desktop:flex-row desktop:items-center desktop:justify-between">
            <div className="space-y-4">
              <div className="h-6 w-36 rounded-full bg-primary-100/20" />

              <div className="h-10 w-64 rounded-xl bg-primary-100/20" />

              <div className="h-4 w-80 max-w-full rounded bg-primary-100/10" />
            </div>

            <div className="h-20 w-full rounded-2xl border border-primary-100/10 bg-primary-100/10 desktop:w-56" />
          </div>
        </section>

        {/* Statistics Skeleton */}
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-primary-300/30 bg-surface"
            />
          ))}
        </div>

        {/* Main Skeleton */}
        <div className="grid gap-6 desktop:grid-cols-3">
          <div className="h-96 animate-pulse rounded-2xl border border-primary-300/30 bg-surface desktop:col-span-2" />

          <div className="h-96 animate-pulse rounded-2xl border border-primary-300/30 bg-surface" />
        </div>
      </div>
    );
  }

  /*
    ========================================================
    Error State
    ========================================================
  */

  if (error || !summary) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
          <AlertCircle className="h-8 w-8 text-danger" />
        </div>

        <h3 className="mt-5 font-estedad text-xl font-bold text-text-primary">
          خطا در دریافت اطلاعات داشبورد
        </h3>

        <p className="mt-2 max-w-md font-estedad text-sm leading-6 text-text-secondary">
          در دریافت اطلاعات مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
        </p>

        {refetch && (
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-900 px-5 py-2.5 font-estedad text-xs font-medium text-white transition-all hover:bg-primary-700"
          >
            <RefreshCw size={16} />
            تلاش مجدد
          </button>
        )}
      </div>
    );
  }

  /*
    ========================================================
    Render
    ========================================================
  */

  return (
    <div className="space-y-6">
      {/* ==================================================
          HERO BANNER
          ================================================== */}

      <section className="relative isolate overflow-hidden rounded-2xl border border-primary-900 bg-primary-900 p-6 text-white shadow-lg tablet:p-7 desktop:p-8">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-primary-100/10 blur-3xl" />

        <div className="pointer-events-none absolute right-1/3 top-0 h-full w-px bg-primary-100/5" />

        <div className="relative grid gap-8 desktop:grid-cols-[1fr_auto] desktop:items-center">
          {/* Hero Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100/15 bg-primary-100/10 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-100" />

              <span className="font-estedad text-[11px] font-medium text-primary-50">
                پنل مدیریت فروشگاه
              </span>
            </div>

            <h1 className="mt-4 font-estedad text-2xl font-bold leading-tight tracking-tight text-white tablet:text-3xl desktop:text-4xl">
              خوش آمدید، {user?.name ?? "مدیر سیستم"}
            </h1>

            <p className="mt-3 max-w-2xl font-estedad text-xs leading-6 text-primary-50/80 tablet:text-sm">
              گزارش لحظه‌ای از وضعیت فروش، کاربران و سفارش‌های فروشگاه شما.
            </p>
          </div>

          {/* Date Card */}
          <div className="w-full desktop:w-64">
            <div className="rounded-2xl border border-primary-100/15 bg-primary-100/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100/10 text-primary-50">
                  <CalendarDays size={20} />
                </div>

                <div className="min-w-0">
                  <span className="block font-estedad text-[10px] text-primary-100/60">
                    تاریخ امروز
                  </span>

                  <span className="mt-1 block font-inter text-sm font-semibold text-white">
                    {new Date().toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-primary-100/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-estedad text-[10px] text-primary-100/60">
                    وضعیت سیستم
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100/10 px-2.5 py-1 font-estedad text-[10px] font-medium text-primary-50">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-100" />
                    فعال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          STATISTICS
          ================================================== */}

      <DashboardStats summary={summary} />

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <section className="grid gap-6 desktop:grid-cols-3">
        <OrdersOverview summary={summary} />
        <RecentOrders summary={summary} />
      </section>

      {/* ==================================================
          BOTTOM CONTENT
          ================================================== */}

      <section className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        <TopProducts summary={summary} />
        <DashboardActivity summary={summary} />
        <RevenueChart summary={summary} />
      </section>
    </div>
  );
}

export default Dashboard;
