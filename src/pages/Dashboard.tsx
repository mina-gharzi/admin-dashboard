import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpLeft,
  CalendarDays,
  MoreHorizontal,
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
  { title: "کل کاربران", value: "12,540", change: "+12.5%", icon: Users },
  { title: "سفارش‌ها", value: "1,284", change: "+8.2%", icon: ShoppingCart },
  { title: "درآمد", value: "245.8M", change: "+15.4%", icon: DollarSign },
  { title: "محصولات", value: "856", change: "+4.6%", icon: Package },
];

const recentOrders = [
  { id: "#ORD-101", customer: "سفارش جدید", status: "موفق" },
  { id: "#ORD-102", customer: "سفارش جدید", status: "موفق" },
  { id: "#ORD-103", customer: "در حال پردازش", status: "پردازش" },
  { id: "#ORD-104", customer: "سفارش جدید", status: "موفق" },
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
            خوش آمدید،{" "}
          </h1>
          <p className="mt-5 max-w-xl font-vazirmatn text-sm leading-7 text-primary-100">
            اینجا می‌توانید وضعیت فروشگاه و عملکرد سیستم را در یک نگاه بررسی
            کنید.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 font-vazirmatn text-xs text-white backdrop-blur-sm">
            <CalendarDays size={17} /> <span>گزارش شهریور ۱۴۰۵</span>
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
                <span className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-900">
                  <TrendingUp size={12} /> {stat.change}
                </span>
                <span className="font-vazirmatn text-[11px] text-text-secondary">
                  نسبت به ماه گذشته
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Main Content */}
      <section className="grid gap-6 desktop:grid-cols-3">
        <Card className="overflow-hidden p-0 desktop:col-span-2">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-4">
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                فروش
              </h2>
              <p className="mt-1 font-vazirmatn text-xs text-text-secondary">
                گزارش فروش شش ماه اخیر
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-2xl border border-primary-300 bg-background px-4 py-2 font-vazirmatn text-xs text-text-secondary transition-all hover:border-primary-900 hover:text-primary-900">
              ۶ ماه اخیر <CalendarDays size={15} />
            </button>
          </div>

          <div className="h-90 px-7 py-7">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                  tick={{ fontSize: 11, fill: "#111844" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
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
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#111844"
                  strokeWidth={3.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#4B5694"
                  strokeWidth={2.8}
                  dot={false}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-8 border-t border-primary-300 px-7 py-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-900" />
              <span className="font-vazirmatn text-xs text-text-secondary">
                فروش واقعی
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-700" />
              <span className="font-vazirmatn text-xs text-text-secondary">
                پیش‌بینی
              </span>
            </div>
          </div>
        </Card>

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
            <button className="font-vazirmatn text-xs font-medium text-primary-900 hover:underline">
              مشاهده همه
            </button>
          </div>

          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-7 py-4"
              >
                <div>
                  <p className="font-inter text-sm font-semibold text-text-primary">
                    {order.id}
                  </p>
                  <p className="mt-1.5 font-vazirmatn text-xs text-text-secondary">
                    {order.customer}
                  </p>
                </div>
                <Badge
                  variant={order.status === "موفق" ? "success" : "primary"}
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Bottom Content */}
      <section className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-primary-300 px-7 py-4">
            <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
              محصولات پرفروش
            </h2>
            <MoreHorizontal size={20} className="text-text-secondary" />
          </div>
          <div className="divide-y divide-border">
            {topProducts.map((product, index) => (
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
                      {product.sales}
                    </p>
                  </div>
                </div>
                <ArrowUpLeft size={17} className="text-primary-900" />
              </div>
            ))}
          </div>
        </Card>

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
            <span className="rounded-2xl bg-primary-100 px-3 py-1 font-vazirmatn text-[10px] text-primary-900">
              این ماه
            </span>
          </div>
          <div className="mt-8 space-y-6 px-7">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  فروش
                </span>
                <span className="font-inter text-xs font-semibold">82%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full w-[82%] rounded-full bg-primary-900" />
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  رضیت مشتری
                </span>
                <span className="font-inter text-xs font-semibold">94%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full w-[94%] rounded-full bg-primary-700" />
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-vazirmatn text-xs text-text-secondary">
                  تکمیل سفارش
                </span>
                <span className="font-inter text-xs font-semibold">76%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-100">
                <div className="h-full w-[76%] rounded-full bg-primary-900" />
              </div>
            </div>
          </div>
        </Card>

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
                درآمد این ماه
              </span>
            </div>
            <p className="mt-8 font-inter text-4xl font-bold text-primary-900">
              245.8M
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="rounded-2xl bg-white/70 px-4 py-2 font-inter text-[11px] font-medium text-success">
                +15.4%
              </span>
              <span className="font-vazirmatn text-[11px] text-primary-900">
                نسبه به ماه گذشته
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;
