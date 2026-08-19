/*
  ==========================================================
  Analytics.tsx (Redesigned & UI/UX Enhanced)
  ----------------------------------------------------------
  صفحه گزارشات و تحلیل‌های پیشرفته فروشگاه
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowUpLeft,
  Crown,
  BarChart3,
  PieChart as PieIcon,
  ShoppingBag,
  Users,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";

import { useData } from "../hooks/useData";
import { api } from "../services/api";
import { formatPrice } from "../utils/format";

/*
  ----------------------------------------------------------
  Meta / Labels
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

const roleMeta = {
  admin: { label: "مدیر سیستم", color: "#111844" },
  manager: { label: "مدیر فروش", color: "#0284c7" },
  customer: { label: "مشتری", color: "#16a34a" },
};

/*
  ----------------------------------------------------------
  Custom Chart Tooltips (UX بهبود یافته)
  ----------------------------------------------------------
*/
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-primary-300/70 bg-white/95 p-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-estedad text-xs font-bold text-text-primary">
            {data.name}
          </span>
        </div>
        <p className="mt-1 font-inter text-sm font-black text-text-primary">
          {data.value.toLocaleString("fa-IR")}{" "}
          <span className="font-estedad text-xs font-normal text-text-secondary">
            مورد
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-primary-300/70 bg-white/95 p-3 shadow-xl backdrop-blur-md">
        <span className="font-estedad text-xs font-bold text-text-primary">
          {data.payload.category}
        </span>
        <p className="mt-1 font-inter text-sm font-black text-primary-900">
          {data.value.toLocaleString("fa-IR")}{" "}
          <span className="font-estedad text-xs font-normal text-text-secondary">
            محصول
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/*
  ----------------------------------------------------------
  Analytics Component
  ----------------------------------------------------------
*/
function Analytics() {
  const navigate = useNavigate();

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
        <div className="grid gap-6 desktop:grid-cols-2">
          <div className="h-80 rounded-2xl bg-primary-100/40" />
          <div className="h-80 rounded-2xl bg-primary-100/40" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-[28px] border border-danger/20 bg-danger/5 p-8 text-center">
        <p className="font-estedad text-sm font-bold text-danger">
          خطا در دریافت گزارشات سیستم. لطفا دوباره تلاش کنید.
        </p>
      </div>
    );
  }

  const ordersPieData = (
    Object.keys(statusMeta) as Array<keyof typeof statusMeta>
  )
    .map((key) => ({
      key,
      name: statusMeta[key].label,
      value: summary.ordersByStatus[key],
      color: statusMeta[key].color,
    }))
    .filter((d) => d.value > 0);

  const usersPieData = (Object.keys(roleMeta) as Array<keyof typeof roleMeta>)
    .map((key) => ({
      key,
      name: roleMeta[key].label,
      value: summary.usersByRole[key],
      color: roleMeta[key].color,
    }))
    .filter((d) => d.value > 0);

  const categoryBarData = summary.productsByCategory;

  const completionRate =
    summary.totalOrders > 0
      ? Math.round(
          (summary.ordersByStatus.completed / summary.totalOrders) * 100,
        )
      : 0;

  const summaryCards = [
    {
      title: "درآمد کل (تکمیل‌شده)",
      value: formatPrice(summary.totalRevenue),
      unit: "تومان",
      subTitle: `مجموع ${summary.ordersByStatus.completed.toLocaleString("fa-IR")} سفارش موفق`,
      icon: DollarSign,
      accent: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "میانگین ارزش سفارش",
      value: formatPrice(summary.averageOrderValue),
      unit: "تومان",
      subTitle: "ارزش هر سبد خرید",
      icon: TrendingUp,
      accent: "from-blue-500 to-indigo-600",
      bg: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "نرخ تکمیل سفارش‌ها",
      value: `${completionRate}%`,
      unit: "موفقیت",
      subTitle: `${summary.ordersByStatus.completed} از ${summary.totalOrders} سفارش`,
      icon: ShoppingCart,
      accent: "from-purple-500 to-pink-600",
      bg: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "محصولات کم‌موجود",
      value: summary.lowStockProducts.length.toLocaleString("fa-IR"),
      unit: "محصول",
      subTitle: "نیازمند تامین موجودی انبار",
      icon: AlertTriangle,
      accent: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="گزارش‌ها و تحلیل‌ها"
        description="تحلیل جامع و لحظه‌ای عملکرد فروشگاه بر اساس داده‌های زنده سیستم"
        breadcrumbs={[{ label: "گزارش‌ها" }]}
      />

      {/* Summary Cards Grid */}
      <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="group relative overflow-hidden border border-primary-300/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-700/40 hover:shadow-xl hover:shadow-primary-900/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-estedad text-xs font-medium text-text-secondary">
                    {card.title}
                  </span>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-inter text-2xl font-black tracking-tight text-text-primary">
                      {card.value}
                    </span>
                    <span className="font-estedad text-xs font-semibold text-text-secondary">
                      {card.unit}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                >
                  <Icon size={21} strokeWidth={2.2} />
                </div>
              </div>

              <div className="mt-4 border-t border-primary-100/60 pt-3">
                <span className="font-estedad text-[11px] font-semibold text-text-secondary">
                  {card.subTitle}
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Charts Row: Orders Status + Users Role */}
      <section className="grid gap-6 desktop:grid-cols-2">
        {/* Orders by Status */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
            <div>
              <h2 className="font-estedad text-base font-bold text-text-primary">
                توزیع وضعیت سفارش‌ها
              </h2>
              <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                مجموع {summary.totalOrders.toLocaleString("fa-IR")} سفارش
                ثبت‌شده
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
              <PieIcon size={18} />
            </div>
          </div>

          {ordersPieData.length === 0 ? (
            <div className="flex h-72 items-center justify-center font-estedad text-xs text-text-secondary">
              هنوز سفارشی ثبت نشده است.
            </div>
          ) : (
            <div className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersPieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {ordersPieData.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={entry.color}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-primary-100/60 pt-4">
                {ordersPieData.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-estedad text-xs font-semibold text-text-primary">
                      {item.name}
                    </span>
                    <span className="font-inter text-xs text-text-secondary">
                      ({item.value.toLocaleString("fa-IR")})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Users by Role */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
            <div>
              <h2 className="font-estedad text-base font-bold text-text-primary">
                توزیع نقش کاربران
              </h2>
              <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                مجموع {summary.totalUsers.toLocaleString("fa-IR")} کاربر فعال
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
              <Users size={18} />
            </div>
          </div>

          {usersPieData.length === 0 ? (
            <div className="flex h-72 items-center justify-center font-estedad text-xs text-text-secondary">
              هنوز کاربری ثبت نشده است.
            </div>
          ) : (
            <div className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usersPieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {usersPieData.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={entry.color}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-primary-100/60 pt-4">
                {usersPieData.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-estedad text-xs font-semibold text-text-primary">
                      {item.name}
                    </span>
                    <span className="font-inter text-xs text-text-secondary">
                      ({item.value.toLocaleString("fa-IR")})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Products by Category Bar Chart */}
      <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
          <div>
            <h2 className="font-estedad text-base font-bold text-text-primary">
              تنوع محصولات به تفکیک دسته‌بندی
            </h2>
            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              مجموع {summary.totalProducts.toLocaleString("fa-IR")} محصول در
              انبار
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
            <BarChart3 size={18} />
          </div>
        </div>

        {categoryBarData.length === 0 ? (
          <div className="flex h-64 items-center justify-center font-estedad text-xs text-text-secondary">
            هنوز محصولی ثبت نشده است.
          </div>
        ) : (
          <div className="h-80 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryBarData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#E6F2DD"
                />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                    fontFamily: "Estedad",
                  }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#64748B", fontFamily: "Inter" }}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(17, 24, 68, 0.03)" }}
                />
                <Bar
                  dataKey="count"
                  fill="#111844"
                  radius={[10, 10, 0, 0]}
                  barSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Two Column: Top Products + Low Stock */}
      <section className="grid gap-6 desktop:grid-cols-2">
        {/* Top Products */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
            <div>
              <h2 className="font-estedad text-base font-bold text-text-primary">
                محصولات پرفروش
              </h2>
              <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                برترین‌ها بر اساس حجم فروش موفق
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
              <Crown size={18} />
            </div>
          </div>

          <div className="divide-y divide-primary-100/60">
            {summary.topProducts.length === 0 ? (
              <p className="p-8 text-center font-estedad text-xs text-text-secondary">
                هنوز فروشی ثبت نشده است.
              </p>
            ) : (
              summary.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-primary-100/20"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl font-inter text-xs font-bold ${
                        index === 0
                          ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                          : index === 1
                            ? "bg-slate-200 text-slate-700 ring-2 ring-slate-300"
                            : index === 2
                              ? "bg-orange-100 text-orange-800 ring-2 ring-orange-200"
                              : "bg-primary-100 text-primary-900"
                      }`}
                    >
                      {index === 0 ? <Crown size={15} /> : index + 1}
                    </span>
                    <div>
                      <p className="font-estedad text-xs font-bold text-text-primary group-hover:text-primary-900 transition-colors">
                        {product.name}
                      </p>
                      <p className="mt-0.5 font-inter text-[11px] text-text-secondary">
                        {product.quantity.toLocaleString("fa-IR")} فروش موفق
                      </p>
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="font-inter text-xs font-bold text-text-primary">
                      {formatPrice(product.revenue)}
                    </p>
                    <p className="font-estedad text-[10px] text-text-secondary">
                      تومان
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
            <div>
              <h2 className="font-estedad text-base font-bold text-text-primary">
                محصولات کم‌موجود انبار
              </h2>
              <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                موجودی ۵ عدد یا کمتر
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="divide-y divide-primary-100/60">
            {summary.lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-10 text-center font-estedad text-xs text-text-secondary">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Package size={20} />
                </div>
                <p className="mt-2 font-bold text-text-primary">
                  موجودی انبار ایده‌آل است!
                </p>
                <p>هیچ محصولی با کمبود موجودی مواجه نیست.</p>
              </div>
            ) : (
              summary.lowStockProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => navigate(`/dashboard/products/${product.id}`)}
                  className="group flex w-full items-center justify-between px-6 py-4 text-right transition-colors hover:bg-primary-100/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="font-estedad text-xs font-bold text-text-primary group-hover:text-primary-900 transition-colors">
                        {product.name}
                      </p>
                      <p className="mt-0.5 font-inter text-[11px] text-text-secondary">
                        شناسه: #{product.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={product.stock === 0 ? "danger" : "warning"}>
                      {product.stock === 0 ? "ناموجود" : `${product.stock} عدد`}
                    </Badge>
                    <ArrowUpLeft
                      size={15}
                      className="text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* Recent Orders List */}
      <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
          <div>
            <h2 className="font-estedad text-base font-bold text-text-primary">
              آخرین سفارش‌های ثبت‌شده
            </h2>
            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              فعالیت‌های اخیر سیستم
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            className="inline-flex items-center gap-1 font-estedad text-xs font-bold text-primary-900 transition-colors hover:text-primary-700 hover:underline"
          >
            <span>مشاهده همه</span>
            <ArrowUpLeft size={15} />
          </button>
        </div>

        <div className="divide-y divide-primary-100/60">
          {summary.recentOrders.length === 0 ? (
            <p className="p-8 text-center font-estedad text-xs text-text-secondary">
              سفارشی ثبت نشده است.
            </p>
          ) : (
            summary.recentOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                className="group flex w-full items-center justify-between px-6 py-4 text-right transition-colors hover:bg-primary-100/30"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100/80 font-inter text-xs font-bold text-primary-900 transition-colors group-hover:bg-primary-900 group-hover:text-white">
                    <ShoppingBag size={17} />
                  </div>
                  <div>
                    <p className="font-inter text-xs font-bold text-text-primary">
                      #{order.id}
                    </p>
                    <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                      {order.customer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="font-inter text-xs font-bold text-text-primary">
                      {formatPrice(order.amount)}
                    </p>
                    <p className="font-estedad text-[10px] text-text-secondary">
                      تومان
                    </p>
                  </div>
                  <Badge variant={statusMeta[order.status].badge}>
                    {statusMeta[order.status].label}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default Analytics;
