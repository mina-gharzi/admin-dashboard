/*
  ==========================================================
  Dashboard.tsx
  ----------------------------------------------------------
  صفحه اصلی Admin Dashboard
  ----------------------------------------------------------
  نکته مهم: تمام آمار این صفحه از api.analytics.getSummary()
  محاسبه میشه، یعنی روی داده‌ی واقعی users/products/orders
  کار می‌کنه (نه اعداد ثابت/نمونه). با افزودن یا حذف داده،
  این صفحه هم خودش به‌روز میشه.
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
  Order Status → رنگ و برچسب (هم‌راستا با OrderTable)
  ----------------------------------------------------------
*/

const statusMeta = {
  pending: { label: "در انتظار", color: "#f59e0b", badge: "warning" as const },
  processing: { label: "در حال پردازش", color: "#0284c7", badge: "info" as const },
  completed: { label: "تکمیل شده", color: "#16a34a", badge: "success" as const },
  cancelled: { label: "لغو شده", color: "#dc2626", badge: "danger" as const },
};

/*
  ----------------------------------------------------------
  Dashboard Component
  ----------------------------------------------------------
*/

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: summary, loading, error } = useData(
    () => api.analytics.getSummary(),
    [],
  );

  /*
    Loading State
  */
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
          <p className="font-vazirmatn text-sm text-text-secondary">
            در حال بارگذاری داشبورد...
          </p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-vazirmatn text-sm text-danger">
          خطا در دریافت اطلاعات داشبورد.
        </p>
      </div>
    );
  }

  /*
    داده‌ی نمودار وضعیت سفارش‌ها (از داده‌ی واقعی)
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
    },
    {
      title: "سفارش‌ها",
      value: summary.totalOrders.toLocaleString("fa-IR"),
      subLabel: `${summary.ordersByStatus.pending.toLocaleString("fa-IR")} در انتظار`,
      icon: ShoppingCart,
    },
    {
      title: "درآمد (تکمیل‌شده)",
      value: `${formatPrice(summary.totalRevenue)} تومان`,
      subLabel: `میانگین سفارش: ${formatPrice(summary.averageOrderValue)}`,
      icon: DollarSign,
    },
    {
      title: "محصولات",
      value: summary.totalProducts.toLocaleString("fa-IR"),
      subLabel: `${summary.lowStockProducts.length.toLocaleString("fa-IR")} کم‌موجود`,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section
        className="
          relative overflow-hidden rounded-[28px]
          bg-primary-900
          px-7 py-11
          tablet:px-9 tablet:py-14
        "
      >
        <div className="absolute inset-0 opacity-25">
          <svg width="100%" height="100%" className="absolute">
            <path
              d="M0,70 Q160,30 320,70 Q480,110 640,70 Q800,30 960,70"
              fill="none"
              stroke="#88BDA4"
              strokeWidth="5"
              strokeOpacity="0.45"
            />
            <path
              d="M0,110 Q160,70 320,110 Q480,150 640,110 Q800,70 960,110"
              fill="none"
              stroke="#111844"
              strokeWidth="3.5"
              strokeOpacity="0.4"
            />
          </svg>
          <div className="absolute -left-12 -top-16 h-56 w-56 rounded-full border-8 border-primary-700 border-opacity-30 animate-spin-slow" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full border-8 border-primary-700 border-opacity-30 animate-spin-slow-reverse" />
        </div>

        <div className="relative z-10">
          <p className="font-vazirmatn text-sm text-primary-100">پنل مدیریت</p>
          <h1 className="mt-5 font-vazirmatn text-3xl font-bold text-white tablet:text-4xl">
            خوش آمدید، {user?.name ?? "کاربر"} 👋
          </h1>
          <p className="mt-5 max-w-xl font-vazirmatn text-sm leading-7 text-primary-100">
            اینجا می‌توانید وضعیت فروشگاه و عملکرد سیستم را در یک نگاه بررسی
            کنید.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 font-vazirmatn text-xs text-white backdrop-blur-sm">
            <CalendarDays size={17} />{" "}
            <span>{new Date().toLocaleDateString("fa-IR")}</span>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="
                group relative overflow-hidden border-primary-300
                p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-vazirmatn text-sm text-text-secondary">
                    {stat.title}
                  </p>
                  <p className="mt-3 font-inter text-2xl font-bold tracking-tight text-text-primary">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-900 transition-transform group-hover:scale-110">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="font-vazirmatn text-[11px] text-text-secondary">
                  {stat.subLabel}
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Main Content */}
      <section className="grid gap-6 desktop:grid-cols-3">
        {/* Orders by Status Chart (از داده‌ی واقعی) */}
        <Card className="overflow-hidden p-0 desktop:col-span-2">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-4">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                توزیع وضعیت سفارش‌ها
              </h2>
              <p className="mt-1 font-vazirmatn text-xs text-text-secondary">
                تعداد سفارش در هر وضعیت (بر اساس داده‌ی فعلی)
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-2 rounded-2xl border border-primary-300 bg-background px-4 py-2 font-vazirmatn text-xs text-text-secondary transition-all hover:border-primary-900 hover:text-primary-900"
            >
              گزارش کامل <BarChart3 size={15} />
            </button>
          </div>

          {summary.totalOrders === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center gap-2 text-center">
              <ShoppingCart size={28} className="text-text-secondary" />
              <p className="font-vazirmatn text-sm text-text-secondary">
                هنوز سفارشی ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="h-80 px-7 py-7">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E6F2DD"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#111844" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: "#111844" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontFamily: "Vazirmatn",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Recent Orders (واقعی) */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-4">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                سفارش‌های اخیر
              </h2>
              <p className="mt-1 font-vazirmatn text-xs text-text-secondary">
                آخرین فعالیت‌ها
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="font-vazirmatn text-xs font-medium text-primary-900 hover:underline"
            >
              مشاهده همه
            </button>
          </div>

          <div className="divide-y divide-border">
            {summary.recentOrders.length === 0 && (
              <p className="px-7 py-10 text-center font-vazirmatn text-xs text-text-secondary">
                سفارشی ثبت نشده است.
              </p>
            )}

            {summary.recentOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex w-full items-center justify-between px-7 py-4 text-right transition-colors hover:bg-background"
              >
                <div>
                  <p className="font-inter text-sm font-semibold text-text-primary">
                    #{order.id}
                  </p>
                  <p className="mt-1.5 font-vazirmatn text-xs text-text-secondary">
                    {order.customer}
                  </p>
                </div>
                <Badge variant={statusMeta[order.status].badge}>
                  {statusMeta[order.status].label}
                </Badge>
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Bottom Content */}
      <section className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {/* Top Products (واقعی، از آیتم‌های سفارش‌ها) */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-4">
            <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
              محصولات پرفروش
            </h2>
          </div>
          <div className="divide-y divide-border">
            {summary.topProducts.length === 0 && (
              <p className="px-7 py-10 text-center font-vazirmatn text-xs text-text-secondary">
                هنوز فروشی ثبت نشده است.
              </p>
            )}

            {summary.topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between px-7 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 font-inter text-xs font-semibold text-primary-900">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-vazirmatn text-sm font-medium text-text-primary">
                      {product.name}
                    </p>
                    <p className="mt-0.5 font-vazirmatn text-[12px] text-text-secondary">
                      {product.quantity.toLocaleString("fa-IR")} فروش
                    </p>
                  </div>
                </div>
                <ArrowUpLeft size={17} className="text-primary-900" />
              </div>
            ))}
          </div>
        </Card>

        {/* خلاصه عملکرد (نرخ‌های واقعی) */}
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-4">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                خلاصه عملکرد
              </h2>
              <p className="mt-1 font-vazirmatn text-xs text-text-secondary">
                وضعیت کلی سیستم
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-6 px-7 pb-7">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  نرخ تکمیل سفارش
                </span>
                <span className="font-inter text-xs font-semibold">
                  {completionRate}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-900"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  نرخ کاربران فعال
                </span>
                <span className="font-inter text-xs font-semibold">
                  {activeUserRate}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${activeUserRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  نرخ محصولات فعال
                </span>
                <span className="font-inter text-xs font-semibold">
                  {activeProductRate}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-700"
                  style={{ width: `${activeProductRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Revenue Card */}
        <Card
          className="
            relative overflow-hidden bg-primary-100 tablet:col-span-2 desktop:col-span-1
            p-0
          "
        >
          <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-primary-200 opacity-60" />
          <div className="relative px-10 pt-10 pb-12">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-900">
                <DollarSign size={26} />
              </div>
              <span className="font-vazirmatn text-xs text-primary-900">
                درآمد کل (تکمیل‌شده)
              </span>
            </div>
            <p className="mt-8 font-inter text-3xl font-bold text-primary-900">
              {formatPrice(summary.totalRevenue)}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="rounded-2xl bg-white/70 px-4 py-2 font-inter text-[11px] font-medium text-primary-900">
                <TrendingUp size={11} className="ml-1 inline" />
                {summary.ordersByStatus.completed.toLocaleString("fa-IR")}{" "}
                سفارش موفق
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
