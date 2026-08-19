/*
  ==========================================================
  Dashboard.tsx
  ----------------------------------------------------------
  Admin Dashboard
  ----------------------------------------------------------
  طراحی هماهنگ با Global Design System
  رنگ اصلی: Primary Palette
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store";

import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpLeft,
  CalendarDays,
  BarChart3,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  Crown,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

import { useData } from "../hooks/useData";
import { api } from "../services/api";
import { formatPrice } from "../utils/format";

/*
  ==========================================================
  Order Status
  ==========================================================
*/

const statusMeta = {
  pending: {
    label: "در انتظار",
    color: "#a8cdee",
    badge: "warning" as const,
  },

  processing: {
    label: "در حال پردازش",
    color: "#7288ae",
    badge: "info" as const,
  },

  completed: {
    label: "تکمیل شده",
    color: "#4b5694",
    badge: "success" as const,
  },

  cancelled: {
    label: "لغو شده",
    color: "#111844",
    badge: "danger" as const,
  },
};

/*
  ==========================================================
  Custom Tooltip
  ==========================================================
*/

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-2xl border border-primary-300/30 bg-primary-900 px-4 py-2.5 text-white shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.color }}
        />

        <span className="font-estedad text-xs font-medium text-primary-50">
          {data.label}
        </span>
      </div>

      <div className="mt-1 font-inter text-lg font-bold tracking-tight">
        {data.count.toLocaleString("fa-IR")}
      </div>

      <span className="font-estedad text-[10px] text-primary-100">سفارش</span>
    </div>
  );
};

/*
  ==========================================================
  Dashboard Component
  ==========================================================
*/

function Dashboard() {
  const navigate = useNavigate();

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
    Calculated Data
    ========================================================
  */

  const statusChartData = (
    Object.keys(statusMeta) as Array<keyof typeof statusMeta>
  ).map((key) => ({
    key,
    label: statusMeta[key].label,
    count: summary.ordersByStatus[key],
    color: statusMeta[key].color,
  }));

  const completionRate =
    summary.totalOrders > 0
      ? Math.round(
          (summary.ordersByStatus.completed / summary.totalOrders) * 100,
        )
      : 0;

  const activeUserRate =
    summary.totalUsers > 0
      ? Math.round((summary.usersByStatus.active / summary.totalUsers) * 100)
      : 0;

  const activeProductRate =
    summary.totalProducts > 0
      ? Math.round((summary.activeProducts / summary.totalProducts) * 100)
      : 0;

  /*
    ========================================================
    Statistics
    ========================================================
  */

  const statistics = [
    {
      title: "کل کاربران",
      value: summary.totalUsers.toLocaleString("fa-IR"),
      subLabel: `${summary.usersByStatus.active.toLocaleString("fa-IR")} کاربر فعال`,
      icon: Users,
      badgeText: "کاربران",
    },

    {
      title: "سفارش‌ها",
      value: summary.totalOrders.toLocaleString("fa-IR"),
      subLabel: `${summary.ordersByStatus.pending.toLocaleString("fa-IR")} در انتظار پردازش`,
      icon: ShoppingCart,
      badgeText: "سفارش‌ها",
    },

    {
      title: "درآمد کل",
      value: formatPrice(summary.totalRevenue),
      unit: "تومان",
      subLabel: `میانگین سفارش: ${formatPrice(summary.averageOrderValue)}`,
      icon: DollarSign,
      badgeText: "مالی",
    },

    {
      title: "تنوع محصولات",
      value: summary.totalProducts.toLocaleString("fa-IR"),
      subLabel: `${summary.lowStockProducts.length.toLocaleString("fa-IR")} محصول کم‌موجود`,
      icon: Package,
      badgeText: "انبار",
    },
  ];

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
              گزارش لحظه‌ای از وضعیت فروش، کاربران و سفارش‌های فروشگاه شما. همه
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

      <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border border-primary-300/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-700/50 hover:shadow-md"
            >
              <div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-primary-100/30 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between">
                <div>
                  <span className="font-estedad text-xs text-text-secondary">
                    {stat.title}
                  </span>

                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-inter text-2xl font-black tracking-tight text-text-primary">
                      {stat.value}
                    </span>

                    {stat.unit && (
                      <span className="font-estedad text-xs text-text-secondary">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-900 transition-all duration-300 group-hover:bg-primary-900 group-hover:text-white">
                  <Icon size={20} strokeWidth={2} />
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between border-t border-primary-100/60 pt-3">
                <span className="font-estedad text-[11px] font-medium text-text-secondary">
                  {stat.subLabel}
                </span>

                <span className="rounded-md bg-primary-50 px-2 py-0.5 font-estedad text-[10px] text-primary-900">
                  {stat.badgeText}
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <section className="grid gap-6 desktop:grid-cols-3">
        {/* Chart */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm desktop:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 px-6 py-4">
            <div>
              <h2 className="font-estedad text-base font-bold text-text-primary">
                توزیع وضعیت سفارش‌ها
              </h2>

              <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                تحلیل آماری سفارش‌ها بر اساس آخرین داده‌ها
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/analytics")}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-primary-300 bg-primary-50 px-3 py-1.5 font-estedad text-xs font-medium text-primary-900 transition-all hover:border-primary-700 hover:bg-primary-100"
            >
              <span>گزارش کامل</span>

              <BarChart3
                size={14}
                className="transition-transform group-hover:scale-110"
              />
            </button>
          </div>

          {summary.totalOrders === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-900">
                <ShoppingCart size={22} />
              </div>

              <p className="font-estedad text-xs text-text-secondary">
                هنوز هیچ سفارشی ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="h-80 px-4 py-6 tablet:px-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusChartData}
                  margin={{
                    top: 20,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e3f0fd"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                      fontFamily: "Estedad",
                    }}
                    dy={8}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "#64748b",
                      fontFamily: "Inter",
                    }}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: "rgba(17, 24, 68, 0.03)",
                    }}
                  />

                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={38}>
                    {statusChartData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={entry.color}
                        className="transition-opacity duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card className="flex flex-col overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-primary-100 px-6 py-4">
            <div>
              <h2 className="font-estedad text-base font-bold text-text-primary">
                سفارش‌های اخیر
              </h2>

              <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                آخرین تراکنش‌ها
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/orders")}
              className="inline-flex items-center gap-1 font-estedad text-xs font-semibold text-primary-900 transition-colors hover:text-primary-700 hover:underline"
            >
              <span>مشاهده همه</span>
              <ChevronLeft size={14} />
            </button>
          </div>

          <div className="flex-1 divide-y divide-primary-50 overflow-y-auto">
            {summary.recentOrders.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center font-estedad text-xs text-text-secondary">
                سفارشی ثبت نشده است.
              </div>
            ) : (
              summary.recentOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="group flex w-full items-center justify-between px-6 py-3.5 text-right transition-colors hover:bg-primary-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 font-inter text-xs font-bold text-primary-900 transition-colors group-hover:bg-primary-900 group-hover:text-white">
                      #{order.id.toString().slice(-2)}
                    </div>

                    <div>
                      <p className="font-inter text-xs font-semibold text-text-primary">
                        #{order.id}
                      </p>

                      <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                        {order.customer}
                      </p>
                    </div>
                  </div>

                  <Badge variant={statusMeta[order.status].badge}>
                    {statusMeta[order.status].label}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* ==================================================
          BOTTOM CONTENT
          ================================================== */}

      <section className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {/* Top Products */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="border-b border-primary-100 px-6 py-4">
            <h2 className="font-estedad text-base font-bold text-text-primary">
              محصولات پرفروش
            </h2>

            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              برترین محصولات بر اساس حجم فروش
            </p>
          </div>

          <div className="divide-y divide-primary-50">
            {summary.topProducts.length === 0 ? (
              <p className="px-6 py-10 text-center font-estedad text-xs text-text-secondary">
                هنوز فروشی ثبت نشده است.
              </p>
            ) : (
              summary.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="group flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-primary-50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-inter text-xs font-bold ${
                        index === 0
                          ? "bg-primary-200 text-primary-900"
                          : index === 1
                            ? "bg-primary-100 text-primary-900"
                            : "bg-primary-50 text-primary-900"
                      }`}
                    >
                      {index === 0 ? <Crown size={14} /> : index + 1}
                    </span>

                    <div>
                      <p className="font-estedad text-xs font-bold text-text-primary transition-colors group-hover:text-primary-900">
                        {product.name}
                      </p>

                      <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                        {product.quantity.toLocaleString("fa-IR")} عدد فروخته
                        شده
                      </p>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-900 opacity-0 transition-all group-hover:opacity-100">
                    <ArrowUpLeft size={15} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Performance */}
        <Card className="border border-primary-300/60 p-0 shadow-sm">
          <div className="border-b border-primary-100 px-6 py-4">
            <h2 className="font-estedad text-base font-bold text-text-primary">
              خلاصه عملکرد
            </h2>

            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              نرخ سلامت و فعال بودن سیستم
            </p>
          </div>

          <div className="space-y-5 p-6">
            {/* Completion */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  نرخ تکمیل سفارش‌ها
                </span>

                <span className="font-inter text-xs font-bold text-text-primary">
                  {completionRate}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-50">
                <div
                  className="h-full rounded-full bg-primary-900 transition-all duration-500"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Users */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  نرخ کاربران فعال
                </span>

                <span className="font-inter text-xs font-bold text-text-primary">
                  {activeUserRate}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-50">
                <div
                  className="h-full rounded-full bg-primary-700 transition-all duration-500"
                  style={{
                    width: `${activeUserRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Products */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  نرخ محصولات فعال
                </span>

                <span className="font-inter text-xs font-bold text-text-primary">
                  {activeProductRate}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-50">
                <div
                  className="h-full rounded-full bg-primary-300 transition-all duration-500"
                  style={{
                    width: `${activeProductRate}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Revenue Highlight */}
        <Card className="relative overflow-hidden border border-primary-200/60 bg-linear-to-br from-primary-50 via-primary-100/70 to-primary-200/50 p-6 shadow-sm tablet:col-span-2 desktop:col-span-1">
          <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-primary-300/30 blur-2xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary-900 shadow-sm">
                  <DollarSign size={24} strokeWidth={2.2} />
                </div>

                <span className="rounded-full bg-surface/80 px-3 py-1 font-estedad text-[11px] font-semibold text-primary-900 shadow-sm">
                  تکمیل‌شده
                </span>
              </div>

              <span className="mt-6 block font-estedad text-xs font-medium text-primary-900/80">
                مجموع درآمد حاصله
              </span>

              <div className="mt-1 flex items-baseline gap-1">
                <p className="font-inter text-3xl font-black tracking-tight text-primary-900">
                  {formatPrice(summary.totalRevenue)}
                </p>

                <span className="font-estedad text-xs font-bold text-primary-900">
                  تومان
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-primary-900/10 pt-4">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-surface/80 px-3 py-1.5 font-estedad text-xs font-semibold text-primary-900 shadow-sm">
                <CheckCircle2 size={14} className="text-primary-700" />

                <span>
                  {summary.ordersByStatus.completed.toLocaleString("fa-IR")}{" "}
                  سفارش موفق
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
