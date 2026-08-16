import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpLeft,
  CalendarDays,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const salesData = [
  { month: "فروردین", sales: 42, forecast: 35 },
  { month: "اردیبهشت", sales: 58, forecast: 48 },
  { month: "خرداد", sales: 45, forecast: 62 },
  { month: "تیر", sales: 72, forecast: 55 },
  { month: "مرداد", sales: 64, forecast: 78 },
  { month: "شهریور", sales: 86, forecast: 72 },
];

const statistics = [
  {
    title: "کل کاربران",
    value: "12,540",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "سفارش‌ها",
    value: "1,284",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "درآمد",
    value: "245.8M",
    change: "+15.4%",
    icon: DollarSign,
  },
  {
    title: "محصولات",
    value: "856",
    change: "+4.6%",
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "#ORD-101",
    customer: "سفارش جدید",
    status: "موفق",
  },
  {
    id: "#ORD-102",
    customer: "سفارش جدید",
    status: "موفق",
  },
  {
    id: "#ORD-103",
    customer: "در حال پردازش",
    status: "پردازش",
  },
  {
    id: "#ORD-104",
    customer: "سفارش جدید",
    status: "موفق",
  },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", sales: "324 فروش" },
  { name: "MacBook Pro", sales: "218 فروش" },
  { name: "AirPods Pro", sales: "184 فروش" },
  { name: "Apple Watch", sales: "142 فروش" },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="
          relative overflow-hidden rounded-[24px]
          bg-primary-900
          px-7 py-7
          tablet:px-9 tablet:py-8
        "
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 220"
            preserveAspectRatio="none"
            className="absolute inset-0"
          >
            <path
              d="M0,80 Q180,35 360,80 Q540,125 720,80 Q850,45 1000,75"
              fill="none"
              stroke="#88BDA4"
              strokeWidth="4"
            />

            <path
              d="M0,125 Q180,80 360,125 Q540,170 720,125 Q850,90 1000,120"
              fill="none"
              stroke="#659287"
              strokeWidth="3"
            />
          </svg>

          <div className="absolute -left-16 -top-24 h-52 w-52 rounded-full border-8 border-primary-700" />

          <div className="absolute -bottom-28 -right-20 h-64 w-64 rounded-full border-8 border-primary-700" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col justify-between gap-6 tablet:flex-row tablet:items-center">
            <div>
              <p className="font-vazirmatn text-xs text-primary-100">
                پنل مدیریت
              </p>

              <h1
                className="
                  mt-2
                  font-vazirmatn
                  text-2xl
                  font-bold
                  text-white
                  tablet:text-3xl
                "
              >
                خوش آمدید،
              </h1>

              <p
                className="
                  mt-2
                  max-w-lg
                  font-vazirmatn
                  text-xs
                  leading-6
                  text-primary-100
                "
              >
                وضعیت فروشگاه و عملکرد کلی سیستم را در یک نگاه بررسی کنید.
              </p>
            </div>

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                bg-white/10
                px-4
                py-2.5
                font-vazirmatn
                text-xs
                text-white
                backdrop-blur-sm
              "
            >
              <CalendarDays size={15} />
              <span>گزارش شهریور ۱۴۰۵</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ====================================================== */}
      <section
        className="
          grid
          gap-4
          tablet:grid-cols-2
          desktop:grid-cols-4
        "
      >
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="
                group
                relative
                overflow-hidden
                border-primary-200
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-sm
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-vazirmatn text-xs text-text-secondary">
                    {stat.title}
                  </p>

                  <p
                    className="
                      mt-2
                      font-inter
                      text-2xl
                      font-bold
                      tracking-tight
                      text-text-primary
                    "
                  >
                    {stat.value}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary-100
                    text-primary-900
                    transition-transform
                    group-hover:scale-105
                  "
                >
                  <Icon size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-md
                    bg-primary-50
                    px-2
                    py-1
                    font-inter
                    text-[11px]
                    font-medium
                    text-primary-900
                  "
                >
                  <TrendingUp size={11} />
                  {stat.change}
                </span>

                <span
                  className="
                    font-vazirmatn
                    text-[10px]
                    text-text-secondary
                  "
                >
                  نسبت به ماه گذشته
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* =====================================================
          SALES + RECENT ORDERS
      ====================================================== */}
      <section className="grid gap-6 desktop:grid-cols-3">
        {/* Sales */}
        <Card className="overflow-hidden p-0 desktop:col-span-2">
          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-primary-200
              px-6
              py-4
              tablet:flex-row
              tablet:items-center
              tablet:justify-between
            "
          >
            <div>
              <h2
                className="
                  font-vazirmatn
                  text-base
                  font-semibold
                  text-text-primary
                "
              >
                روند فروش
              </h2>

              <p
                className="
                  mt-1
                  font-vazirmatn
                  text-[11px]
                  text-text-secondary
                "
              >
                مقایسه فروش واقعی و پیش‌بینی‌شده
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-primary-300
                bg-background
                px-3
                py-2
                font-vazirmatn
                text-xs
                text-text-secondary
                transition-colors
                hover:border-primary-900
                hover:text-primary-900
              "
            >
              <CalendarDays size={14} />
              ۶ ماه اخیر
            </button>
          </div>

          <div className="h-85 px-5 py-6 tablet:px-7">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E6F2DD"
                />

                <XAxis
                  dataKey="month"
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
                  tick={{
                    fontSize: 10,
                    fill: "#111844",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    fontFamily: "Vazirmatn",
                    fontSize: "12px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="sales"
                  name="فروش واقعی"
                  stroke="#111844"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="پیش‌بینی"
                  stroke="#4B5694"
                  strokeWidth={2.5}
                  dot={false}
                  strokeDasharray="5 5"
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            className="
              flex
              items-center
              gap-6
              border-t
              border-primary-200
              px-6
              py-3
            "
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-900" />

              <span className="font-vazirmatn text-[11px] text-text-secondary">
                فروش واقعی
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-700" />

              <span className="font-vazirmatn text-[11px] text-text-secondary">
                پیش‌بینی
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="overflow-hidden p-0">
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-primary-200
              px-6
              py-4
            "
          >
            <div>
              <h2
                className="
                  font-vazirmatn
                  text-base
                  font-semibold
                  text-text-primary
                "
              >
                سفارش‌های اخیر
              </h2>

              <p
                className="
                  mt-1
                  font-vazirmatn
                  text-[11px]
                  text-text-secondary
                "
              >
                آخرین سفارش‌های ثبت‌شده
              </p>
            </div>

            <button
              type="button"
              className="
                inline-flex
                items-center
                gap-1
                font-vazirmatn
                text-xs
                font-medium
                text-primary-900
                transition-opacity
                hover:opacity-70
              "
            >
              مشاهده همه
              <ArrowLeft size={13} />
            </button>
          </div>

          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-6
                  py-4
                "
              >
                <div>
                  <p
                    className="
                      font-inter
                      text-sm
                      font-semibold
                      text-text-primary
                    "
                  >
                    {order.id}
                  </p>

                  <p
                    className="
                      mt-1
                      font-vazirmatn
                      text-[11px]
                      text-text-secondary
                    "
                  >
                    {order.customer}
                  </p>
                </div>

                <Badge
                  variant={
                    order.status === "موفق" ? "success" : "primary"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* =====================================================
          SECONDARY INFORMATION
      ====================================================== */}
      <section className="grid gap-6 desktop:grid-cols-2">
        {/* Top Products */}
        <Card className="overflow-hidden p-0">
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-primary-200
              px-6
              py-4
            "
          >
            <div>
              <h2
                className="
                  font-vazirmatn
                  text-base
                  font-semibold
                  text-text-primary
                "
              >
                محصولات پرفروش
              </h2>

              <p
                className="
                  mt-1
                  font-vazirmatn
                  text-[11px]
                  text-text-secondary
                "
              >
                محصولات با بیشترین فروش
              </p>
            </div>

            <button
              type="button"
              aria-label="گزینه‌های بیشتر"
              className="
                rounded-lg
                p-1
                text-text-secondary
                transition-colors
                hover:bg-primary-50
                hover:text-primary-900
              "
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="divide-y divide-border">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-6
                  py-4
                "
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
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
                    <p
                      className="
                        truncate
                        font-vazirmatn
                        text-sm
                        font-medium
                        text-text-primary
                      "
                    >
                      {product.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        font-vazirmatn
                        text-[11px]
                        text-text-secondary
                      "
                    >
                      {product.sales}
                    </p>
                  </div>
                </div>

                <ArrowUpLeft
                  size={16}
                  className="shrink-0 text-primary-900"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Performance */}
        <Card className="overflow-hidden p-0">
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-primary-200
              px-6
              py-4
            "
          >
            <div>
              <h2
                className="
                  font-vazirmatn
                  text-base
                  font-semibold
                  text-text-primary
                "
              >
                خلاصه عملکرد
              </h2>

              <p
                className="
                  mt-1
                  font-vazirmatn
                  text-[11px]
                  text-text-secondary
                "
              >
                وضعیت کلی عملکرد این ماه
              </p>
            </div>

            <span
              className="
                rounded-xl
                bg-primary-100
                px-3
                py-1.5
                font-vazirmatn
                text-[10px]
                text-primary-900
              "
            >
              این ماه
            </span>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  فروش
                </span>

                <span className="font-inter text-xs font-semibold text-text-primary">
                  82%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full w-[82%] rounded-full bg-primary-900" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  رضایت مشتری
                </span>

                <span className="font-inter text-xs font-semibold text-text-primary">
                  94%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full w-[94%] rounded-full bg-primary-700" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  تکمیل سفارش
                </span>

                <span className="font-inter text-xs font-semibold text-text-primary">
                  76%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full w-[76%] rounded-full bg-primary-900" />
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;