چرا درامد فارسیه هنوز؟
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

/*
  ==========================================================
  Dashboard.tsx
  ----------------------------------------------------------
  صفحه اصلی Admin Dashboard
  ----------------------------------------------------------
  UI refined — logic unchanged
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

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
  Order Status
  ----------------------------------------------------------
*/

const statusMeta = {
  pending: {
    label: "در انتظار",
    color: "#f59e0b",
    badge: "warning" as const,
  },

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

  cancelled: {
    label: "لغو شده",
    color: "#dc2626",
    badge: "danger" as const,
  },
};

/*
  ----------------------------------------------------------
  Dashboard
  ----------------------------------------------------------
*/

function Dashboard() {
  const navigate = useNavigate();

  const {
    data: summary,
    loading,
    error,
  } = useData(() => api.analytics.getSummary(), []);

  /*
    Loading
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

  /*
    Error
  */

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
    --------------------------------------------------------
    Chart Data
    --------------------------------------------------------
  */

  const statusChartData = (
    Object.keys(statusMeta) as Array<keyof typeof statusMeta>
  ).map((key) => ({
    key,
    label: statusMeta[key].label,
    count: summary.ordersByStatus[key],
    color: statusMeta[key].color,
  }));

  /*
    --------------------------------------------------------
    Rates
    --------------------------------------------------------
  */

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

  /*
    --------------------------------------------------------
    Statistics
    --------------------------------------------------------
  */

  const statistics = [
    {
      title: "کل کاربران",
      value: summary.totalUsers.toLocaleString("en-US"),
      subLabel: `${summary.usersByStatus.active.toLocaleString(
        "en-US",
      )} کاربر فعال`,
      icon: Users,
    },

    {
      title: "سفارش‌ها",
      value: summary.totalOrders.toLocaleString("en-US"),
      subLabel: `${summary.ordersByStatus.pending.toLocaleString(
        "en-US",
      )} در انتظار`,
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
      value: summary.totalProducts.toLocaleString("en-US"),
      subLabel: `${summary.lowStockProducts.length.toLocaleString("en-US")} کم‌موجود`,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ==================================================
          HERO
          ================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[26px]
          bg-primary-900
          px-7
          py-9
          shadow-sm
          tablet:px-9
          tablet:py-11
        "
      >
        {/* Decorative background */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            preserveAspectRatio="none"
          >
            <path
              d="M0,75 Q160,30 320,75 Q480,120 640,75 Q800,30 960,75"
              fill="none"
              stroke="#88BDA4"
              strokeWidth="4"
              strokeOpacity="0.35"
            />

            <path
              d="M0,120 Q160,75 320,120 Q480,165 640,120 Q800,75 960,120"
              fill="none"
              stroke="#4B5694"
              strokeWidth="3"
              strokeOpacity="0.35"
            />

            <path
              d="M0,165 Q160,120 320,165 Q480,210 640,165 Q800,120 960,165"
              fill="none"
              stroke="#88BDA4"
              strokeWidth="2"
              strokeOpacity="0.18"
            />
          </svg>

          <div
            className="
              absolute
              -left-16
              -top-20
              h-64
              w-64
              rounded-full
              border-[7px]
              border-primary-700/30
              animate-spin-slow
            "
          />

          <div
            className="
              absolute
              -bottom-24
              -right-20
              h-72
              w-72
              rounded-full
              border-[7px]
              border-primary-700/25
              animate-spin-slow-reverse
            "
          />

          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 via-transparent to-primary-900/40" />
        </div>

        {/* Hero Content */}

        <div className="relative z-10 flex flex-col justify-between gap-8 tablet:flex-row tablet:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-300" />

              <p className="font-vazirmatn text-xs font-medium text-primary-100">
                پنل مدیریت
              </p>
            </div>

            <h1 className="font-vazirmatn text-3xl font-bold tracking-tight text-white tablet:text-4xl">
              خوش آمدید
            </h1>

            <p className="mt-4 max-w-xl font-vazirmatn text-sm leading-7 text-primary-100/90">
              اینجا می‌توانید وضعیت فروشگاه و عملکرد سیستم را در یک نگاه بررسی
              کنید.
            </p>
          </div>

          <div
            className="
              inline-flex
              h-11
              w-fit
              shrink-0
              items-center
              gap-2.5
              rounded-xl
              border
              border-white/10
              bg-white/10
              px-4
              font-vazirmatn
              text-xs
              text-white
              backdrop-blur-sm
            "
          >
            <CalendarDays size={16} />

            <span>{new Date().toLocaleDateString("fa-IR")}</span>
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
              className="
                group
                relative
                overflow-hidden
                border-primary-300
                p-5
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-vazirmatn text-sm text-text-secondary">
                    {stat.title}
                  </p>

                  <p className="mt-3 truncate font-inter text-2xl font-bold tracking-tight text-text-primary">
                    {stat.value}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary-100
                    text-primary-900
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                >
                  <Icon size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="inline-flex h-6 items-center rounded-md bg-primary-50 px-2.5 font-vazirmatn text-[10px] font-medium text-primary-900">
                  این ماه
                </span>

                <span className="truncate font-vazirmatn text-[11px] text-text-secondary">
                  {stat.subLabel}
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
        {/* ==================================================
            ORDERS CHART
            ================================================== */}

        <Card className="overflow-hidden border-primary-300 p-0 desktop:col-span-2">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                  <BarChart3 size={17} strokeWidth={1.8} />
                </div>

                <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                  توزیع وضعیت سفارش‌ها
                </h2>
              </div>

              <p className="mt-2 font-vazirmatn text-xs text-text-secondary">
                تعداد سفارش در هر وضعیت بر اساس داده‌ی فعلی
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/analytics")}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-primary-300
                bg-background
                px-3.5
                py-2
                font-vazirmatn
                text-xs
                text-text-secondary
                transition-all
                hover:border-primary-900
                hover:text-primary-900
              "
            >
              گزارش کامل
              <BarChart3 size={14} />
            </button>
          </div>

          {summary.totalOrders === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-text-secondary">
                <ShoppingCart size={23} />
              </div>

              <p className="font-vazirmatn text-sm text-text-secondary">
                هنوز سفارشی ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="h-80 px-6 py-7 tablet:px-7">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                  barCategoryGap="25%"
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
                    tick={{
                      fontSize: 11,
                      fill: "#111844",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "#111844",
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#E6F2DD",
                      opacity: 0.35,
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 8px 25px rgba(17, 24, 68, 0.08)",
                      fontFamily: "Vazirmatn",
                      fontSize: "12px",
                    }}
                  />

                  <Bar dataKey="count" radius={[8, 8, 2, 2]} maxBarSize={52}>
                    {statusChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* ==================================================
            RECENT ORDERS
            ================================================== */}

        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-5">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                سفارش‌های اخیر
              </h2>

              <p className="mt-1.5 font-vazirmatn text-xs text-text-secondary">
                آخرین فعالیت‌ها
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="
                font-vazirmatn
                text-xs
                font-medium
                text-primary-900
                transition-opacity
                hover:opacity-70
              "
            >
              مشاهده همه
            </button>
          </div>

          <div className="divide-y divide-border">
            {summary.recentOrders.length === 0 && (
              <div className="px-7 py-12 text-center">
                <p className="font-vazirmatn text-xs text-text-secondary">
                  سفارشی ثبت نشده است.
                </p>
              </div>
            )}

            {summary.recentOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => navigate(`/orders/${order.id}`)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  px-7
                  py-4
                  text-right
                  transition-colors
                  hover:bg-primary-50/50
                "
              >
                <div className="min-w-0">
                  <p className="font-inter text-sm font-semibold text-text-primary">
                    #{order.id}
                  </p>

                  <p className="mt-1.5 truncate font-vazirmatn text-xs text-text-secondary">
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

      {/* ==================================================
          BOTTOM CONTENT
          ================================================== */}

      <section className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {/* ==================================================
            TOP PRODUCTS
            ================================================== */}

        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-5">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                محصولات پرفروش
              </h2>

              <p className="mt-1.5 font-vazirmatn text-xs text-text-secondary">
                بیشترین فروش در سیستم
              </p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {summary.topProducts.length === 0 && (
              <p className="px-7 py-12 text-center font-vazirmatn text-xs text-text-secondary">
                هنوز فروشی ثبت نشده است.
              </p>
            )}

            {summary.topProducts.map((product, index) => (
              <div
                key={product.name}
                className="
                  flex
                  items-center
                  justify-between
                  px-7
                  py-4
                  transition-colors
                  hover:bg-primary-50/50
                "
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary-100
                      font-inter
                      text-xs
                      font-semibold
                      text-primary-900
                    "
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-vazirmatn text-sm font-medium text-text-primary">
                      {product.name}
                    </p>

                    <p className="mt-1 font-vazirmatn text-[11px] text-text-secondary numeric">
                      {product.quantity.toLocaleString("en-US")} فروش
                    </p>
                  </div>
                </div>

                <ArrowUpLeft size={17} className="shrink-0 text-primary-900" />
              </div>
            ))}
          </div>
        </Card>

        {/* ==================================================
            PERFORMANCE
            ================================================== */}

        <Card className="border-primary-300 p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-5">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                خلاصه عملکرد
              </h2>

              <p className="mt-1.5 font-vazirmatn text-xs text-text-secondary">
                وضعیت کلی سیستم
              </p>
            </div>

            <span className="rounded-xl bg-primary-100 px-3 py-1.5 font-vazirmatn text-[10px] font-medium text-primary-900">
              این ماه
            </span>
          </div>

          <div className="space-y-7 px-7 py-7">
            {/* Completion */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  نرخ تکمیل سفارش
                </span>

                <span className="font-inter text-xs font-semibold text-text-primary">
                  {completionRate}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
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
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  نرخ کاربران فعال
                </span>

                <span className="font-inter text-xs font-semibold text-text-primary">
                  {activeUserRate}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{
                    width: `${activeUserRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Products */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  نرخ محصولات فعال
                </span>

                <span className="font-inter text-xs font-semibold text-text-primary">
                  {activeProductRate}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-700 transition-all duration-500"
                  style={{
                    width: `${activeProductRate}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ==================================================
            REVENUE
            ================================================== */}

        <Card
          className="
            relative
            overflow-hidden
            border-primary-200
            bg-primary-100
            p-0
            tablet:col-span-2
            desktop:col-span-1
          "
        >
          <div
            className="
              absolute
              -bottom-16
              -left-16
              h-48
              w-48
              rounded-full
              bg-primary-200
              opacity-60
            "
          />

          <div
            className="
              absolute
              -right-16
              -top-16
              h-40
              w-40
              rounded-full
              border-[18px]
              border-white/20
            "
          />

          <div className="relative px-8 py-8">
            <div className="flex items-start justify-between">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-primary-900
                  shadow-sm
                "
              >
                <DollarSign size={26} strokeWidth={1.8} />
              </div>

              <div className="text-left">
                <p className="font-vazirmatn text-xs font-medium text-primary-900 numeric">
                  درآمد کل
                </p>

                <p className="mt-1 font-vazirmatn text-[10px] text-primary-900/70">
                  سفارش‌های تکمیل‌شده
                </p>
              </div>
            </div>

            <p className="mt-8 font-inter text-3xl font-bold tracking-tight text-primary-900">
              {formatPrice(summary.totalRevenue)}
            </p>

            <p className="mt-1 font-vazirmatn text-[11px] text-primary-900/70">
              تومان
            </p>

            <div className="mt-6">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-white/75
                  px-3.5
                  py-2
                  font-vazirmatn
                  text-[10px]
                  font-medium
                  text-primary-900
                  numeric
                "
              >
                <TrendingUp size={12} />
                {summary.ordersByStatus.completed.toLocaleString("en-US")}
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
