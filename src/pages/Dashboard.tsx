/*
  ==========================================================
  Dashboard.tsx (Redesigned & UI/UX Enhanced)
  ----------------------------------------------------------
  صفحه اصلی Admin Dashboard با رعایت کامل Design System پروژه
  ==========================================================
*/

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpLeft,
  CalendarDays,
  BarChart3,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  Crown,
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
  ----------------------------------------------------------
  Order Status → رنگ و برچسب
  ----------------------------------------------------------
*/
const statusMeta = {
  pending: { label: "در انتظار", color: "#f59e0b", badge: "warning" as const },
  processing: {
    label: "در حال پردازش",
    color: "#0284c7",
    badge: "info" as const,
  },
  completed: {
    label: "تکمیل شده",
    color: "#16a34a",
    badge: "success" as const,
  },
  cancelled: { label: "لغو شده", color: "#dc2626", badge: "danger" as const },
};

/*
  ----------------------------------------------------------
  Custom Tooltip برای نمودار Recharts (UX بهبود یافته)
  ----------------------------------------------------------
*/
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-primary-300 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-all">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-estedad text-xs font-medium text-text-primary">
            {data.label}
          </span>
        </div>
        <p className="mt-1 font-inter text-sm font-bold text-text-primary">
          {data.count.toLocaleString("fa-IR")}{" "}
          <span className="font-estedad text-xs font-normal text-text-secondary">
            سفارش
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/*
  ----------------------------------------------------------
  Dashboard Component
  ----------------------------------------------------------
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
    Loading Skeleton State (بهبود UX به جای یک Spinner ساده)
  */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Hero */}
        <div className="h-52 w-full rounded-[28px] bg-primary-100/60" />

        {/* Skeleton Stats */}
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-primary-100/40" />
          ))}
        </div>

        {/* Skeleton Main Section */}
        <div className="grid gap-6 desktop:grid-cols-3">
          <div className="h-96 rounded-2xl bg-primary-100/40 desktop:col-span-2" />
          <div className="h-96 rounded-2xl bg-primary-100/40" />
        </div>
      </div>
    );
  }

  /*
    Error State با قابلیت Re-try
  */
  if (error || !summary) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-[28px] border border-danger/20 bg-danger/5 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <AlertCircle size={24} />
        </div>
        <div>
          <h3 className="font-estedad text-base font-bold text-text-primary">
            خطا در دریافت اطلاعات داشبورد
          </h3>
          <p className="mt-1 font-estedad text-xs text-text-secondary">
            اتصال خود به اینترنت یا سرور را بررسی کنید.
          </p>
        </div>
        {refetch && (
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-4 py-2 font-estedad text-xs font-medium text-white transition-all hover:bg-primary-700"
          >
            <RefreshCw size={14} /> تلاش مجدد
          </button>
        )}
      </div>
    );
  }

  /*
    داده‌های محاسباتی
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
      ? Math.round(
          (summary.productsByCategory.reduce((s, c) => s + c.count, 0) /
            summary.totalProducts) *
            100,
        )
      : 0;

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
      badgeText: "سفارشات",
    },
    {
      title: "درآمد کل",
      value: `${formatPrice(summary.totalRevenue)}`,
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

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[28px] bg-primary-900 px-6 py-8 shadow-xl shadow-primary-900/10 tablet:px-10 tablet:py-12">
        {/* Background Decorative Ambient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-primary-700/20 blur-3xl animate-pulse" />
          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl" />
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="hero-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 tablet:flex-row tablet:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-estedad text-xs text-primary-100 backdrop-blur-md border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
              پنل مدیریت فروشگاه
            </div>
            <h1 className="mt-3 font-estedad text-2xl font-extrabold text-white tablet:text-3xl desktop:text-4xl">
              خوش آمدید، {user?.name ?? "مدیر سیستم"}
            </h1>
            <p className="mt-2 max-w-xl font-estedad text-xs leading-6 text-primary-100/90 tablet:text-sm">
              گزارش لحظه‌ای از وضعیت فروش، کاربران و سفارش‌های فروشگاه شما.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl bg-white/10 px-4 py-3 font-estedad text-xs font-medium text-white backdrop-blur-md border border-white/10 tablet:self-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays size={18} className="text-primary-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-primary-100/70">
                تاریخ امروز
              </span>
              <span className="font-inter font-semibold">
                {new Date().toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border border-primary-300/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-700/40 hover:shadow-lg hover:shadow-primary-900/5"
            >
              <div className="flex items-start justify-between">
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

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100/80 text-primary-900 transition-all duration-300 group-hover:bg-primary-900 group-hover:text-white group-hover:shadow-md group-hover:shadow-primary-900/20">
                  <Icon size={20} strokeWidth={2} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-primary-100/60 pt-3">
                <span className="font-estedad text-[11px] font-medium text-text-secondary">
                  {stat.subLabel}
                </span>
                <span className="rounded-md bg-primary-100/50 px-2 py-0.5 font-estedad text-[10px] text-primary-900">
                  {stat.badgeText}
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 desktop:grid-cols-3">
        {/* Chart Card */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 desktop:col-span-2 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-300/60 px-6 py-4">
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
              onClick={() => navigate("/analytics")}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-primary-300 bg-background px-3 py-1.5 font-estedad text-xs font-medium text-text-secondary transition-all hover:border-primary-900 hover:text-primary-900 hover:shadow-sm"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-900">
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
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#E6F2DD"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#64748B",
                      fontFamily: "Vazirmatn",
                    }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "#64748B",
                      fontFamily: "Inter",
                    }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(17, 24, 68, 0.03)" }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={38}>
                    {statusChartData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-85"
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
          <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
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
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-1 font-estedad text-xs font-semibold text-primary-900 transition-colors hover:text-primary-700 hover:underline"
            >
              <span>مشاهده همه</span>
              <ChevronLeft size={14} />
            </button>
          </div>

          <div className="flex-1 divide-y divide-primary-100/60 overflow-y-auto">
            {summary.recentOrders.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center font-estedad text-xs text-text-secondary">
                سفارشی ثبت نشده است.
              </div>
            ) : (
              summary.recentOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="group flex w-full items-center justify-between px-6 py-3.5 text-right transition-colors hover:bg-primary-100/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 font-inter text-xs font-bold text-primary-900 transition-colors group-hover:bg-primary-900 group-hover:text-white">
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

      {/* Bottom Content Grid */}
      <section className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {/* Top Products */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="border-b border-primary-300/60 px-6 py-4">
            <h2 className="font-estedad text-base font-bold text-text-primary">
              محصولات پرفروش
            </h2>
            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              برترین محصولات بر اساس حجم فروش
            </p>
          </div>
          <div className="divide-y divide-primary-100/60">
            {summary.topProducts.length === 0 ? (
              <p className="px-6 py-10 text-center font-estedad text-xs text-text-secondary">
                هنوز فروشی ثبت نشده است.
              </p>
            ) : (
              summary.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="group flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-primary-100/20"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-inter text-xs font-bold ${
                        index === 0
                          ? "bg-amber-100 text-amber-700"
                          : index === 1
                            ? "bg-slate-200 text-slate-700"
                            : "bg-primary-100 text-primary-900"
                      }`}
                    >
                      {index === 0 ? <Crown size={14} /> : index + 1}
                    </span>
                    <div>
                      <p className="font-estedad text-xs font-bold text-text-primary group-hover:text-primary-900 transition-colors">
                        {product.name}
                      </p>
                      <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                        {product.quantity.toLocaleString("fa-IR")} عدد فروخته
                        شده
                      </p>
                    </div>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100/50 text-primary-900 opacity-0 transition-all group-hover:opacity-100">
                    <ArrowUpLeft size={15} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* خلاصه عملکرد */}
        <Card className="border border-primary-300/60 p-0 shadow-sm">
          <div className="border-b border-primary-300/60 px-6 py-4">
            <h2 className="font-estedad text-base font-bold text-text-primary">
              خلاصه عملکرد
            </h2>
            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              نرخ‌های سلامت و فعال بودن سیستم
            </p>
          </div>
          <div className="space-y-5 p-6">
            {/* Completion Rate */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  نرخ تکمیل سفارش‌ها
                </span>
                <span className="font-inter text-xs font-bold text-text-primary">
                  {completionRate}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-900 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Active User Rate */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  نرخ کاربران فعال
                </span>
                <span className="font-inter text-xs font-bold text-text-primary">
                  {activeUserRate}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${activeUserRate}%` }}
                />
              </div>
            </div>

            {/* Active Product Rate */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  نرخ تنوع کالا
                </span>
                <span className="font-inter text-xs font-bold text-text-primary">
                  {activeProductRate}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-700 transition-all duration-500"
                  style={{ width: `${activeProductRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Revenue Highlight Card */}
        <Card className="relative overflow-hidden border-0 bg-linear-to-br from-primary-100 via-primary-100/80 to-primary-200/60 p-6 tablet:col-span-2 desktop:col-span-1 shadow-sm">
          <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-primary-300/40 blur-2xl pointer-events-none" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-900 shadow-sm">
                  <DollarSign size={24} strokeWidth={2.2} />
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 font-estedad text-[11px] font-semibold text-primary-900 shadow-sm">
                  تکمیل‌شده
                </span>
              </div>

              <span className="mt-6 block font-estedad text-xs text-primary-900/80 font-medium">
                مجموع درآمد حاصله
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <p className="font-inter text-3xl font-black text-primary-900 tracking-tight">
                  {formatPrice(summary.totalRevenue)}
                </p>
                <span className="font-estedad text-xs font-bold text-primary-900">
                  تومان
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-primary-900/10 pt-4">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-1.5 font-estedad text-xs font-semibold text-primary-900 shadow-sm">
                <TrendingUp size={14} className="text-success" />
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
