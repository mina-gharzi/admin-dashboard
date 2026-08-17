/*
  ==========================================================
  Analytics.tsx
  ----------------------------------------------------------
  صفحه گزارشات و تحلیل‌ها
  ----------------------------------------------------------
  تمام نمودارها و اعداد این صفحه از api.analytics.getSummary()
  میان که خودش از روی mockUsers/mockProducts/mockOrders زنده
  محاسبه میشه — یعنی هر داده‌ای که کاربر اضافه/ویرایش/حذف کنه
  همینجا هم منعکس میشه.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
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
  Legend,
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
  pending: { label: "در انتظار", color: "#f59e0b" },
  processing: { label: "در حال پردازش", color: "#0284c7" },
  completed: { label: "تکمیل شده", color: "#16a34a" },
  cancelled: { label: "لغو شده", color: "#dc2626" },
};

const roleMeta = {
  admin: { label: "مدیر", color: "#111844" },
  manager: { label: "مدیر فروش", color: "#4B5694" },
  customer: { label: "مشتری", color: "#90CAF9" },
};

const statusBadgeVariant = {
  pending: "warning" as const,
  processing: "info" as const,
  completed: "success" as const,
  cancelled: "danger" as const,
};

/*
  ----------------------------------------------------------
  Analytics Page
  ----------------------------------------------------------
*/

function Analytics() {
  const navigate = useNavigate();

  const {
    data: summary,
    loading,
    error,
  } = useData(() => api.analytics.getSummary(), []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
          <p className="font-estedad text-sm text-text-secondary">
            در حال محاسبه گزارشات...
          </p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-estedad text-sm text-danger">
          خطا در دریافت گزارشات.
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
      value: `${formatPrice(summary.totalRevenue)} تومان`,
      icon: DollarSign,
    },
    {
      title: "میانگین ارزش سفارش",
      value: `${formatPrice(summary.averageOrderValue)} تومان`,
      icon: TrendingUp,
    },
    {
      title: "نرخ تکمیل سفارش‌ها",
      value: `${completionRate}%`,
      icon: ShoppingCart,
    },
    {
      title: "محصولات کم‌موجود",
      value: summary.lowStockProducts.length.toLocaleString("fa-IR"),
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="گزارش‌ها"
        description="تحلیل و آمار زنده‌ی سیستم بر اساس داده‌های فعلی"
        breadcrumbs={[{ label: "گزارش‌ها" }]}
      />

      {/* Summary Cards */}
      <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="border-primary-300 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-estedad text-sm text-text-secondary">
                    {card.title}
                  </p>
                  <p className="mt-3 font-inter text-xl font-bold tracking-tight text-text-primary">
                    {card.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Charts Row */}
      <section className="grid gap-6 desktop:grid-cols-2">
        {/* Orders by Status */}
        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="border-b border-primary-300 px-6 py-4">
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              توزیع وضعیت سفارش‌ها
            </h2>
            <p className="mt-1 font-estedad text-xs text-text-secondary">
              {summary.totalOrders.toLocaleString("fa-IR")} سفارش ثبت‌شده
            </p>
          </div>

          {ordersPieData.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="font-estedad text-sm text-text-secondary">
                هنوز سفارشی ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="h-72 px-4 py-5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {ordersPieData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontFamily: "Vazirmatn",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="font-estedad text-xs">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Users by Role */}
        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="border-b border-primary-300 px-6 py-4">
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              توزیع نقش کاربران
            </h2>
            <p className="mt-1 font-estedad text-xs text-text-secondary">
              {summary.totalUsers.toLocaleString("fa-IR")} کاربر ثبت‌شده
            </p>
          </div>

          {usersPieData.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="font-estedad text-sm text-text-secondary">
                هنوز کاربری ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="h-72 px-4 py-5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {usersPieData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontFamily: "Vazirmatn",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="font-estedad text-xs">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </section>

      {/* Products by Category */}
      <Card className="overflow-hidden border-primary-300 p-0">
        <div className="border-b border-primary-300 px-6 py-4">
          <h2 className="font-estedad text-base font-semibold text-text-primary">
            محصولات به تفکیک دسته‌بندی
          </h2>
          <p className="mt-1 font-estedad text-xs text-text-secondary">
            {summary.totalProducts.toLocaleString("fa-IR")} محصول ثبت‌شده
          </p>
        </div>

        {categoryBarData.length === 0 ? (
          <div className="flex h-56 items-center justify-center">
            <p className="font-estedad text-sm text-text-secondary">
              هنوز محصولی ثبت نشده است.
            </p>
          </div>
        ) : (
          <div className="h-72 px-6 py-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E6F2DD"
                />
                <XAxis
                  dataKey="category"
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
                <Bar dataKey="count" fill="#4B5694" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Two Column: Top Products + Low Stock */}
      <section className="grid gap-6 desktop:grid-cols-2">
        {/* Top Products Table */}
        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="border-b border-primary-300 px-6 py-4">
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              پرفروش‌ترین محصولات
            </h2>
            <p className="mt-1 font-estedad text-xs text-text-secondary">
              بر اساس تعداد فروخته‌شده در سفارش‌ها
            </p>
          </div>

          {summary.topProducts.length === 0 ? (
            <p className="p-6 text-center font-estedad text-sm text-text-secondary">
              هنوز فروشی ثبت نشده است.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {summary.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between px-6 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 font-inter text-xs font-semibold text-primary-900">
                      {index + 1}
                    </span>
                    <p className="font-estedad text-sm font-medium text-text-primary">
                      {product.name}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-estedad text-xs font-medium text-text-primary">
                      {product.quantity.toLocaleString("fa-IR")} عدد
                    </p>
                    <p className="font-estedad text-[11px] text-text-secondary">
                      {formatPrice(product.revenue)} تومان
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Low Stock Products */}
        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="border-b border-primary-300 px-6 py-4">
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              محصولات کم‌موجود
            </h2>
            <p className="mt-1 font-estedad text-xs text-text-secondary">
              موجودی ۵ یا کمتر — نیاز به سفارش مجدد
            </p>
          </div>

          {summary.lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <Package size={24} className="text-text-secondary" />
              <p className="font-estedad text-sm text-text-secondary">
                همه محصولات موجودی کافی دارند.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {summary.lowStockProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="flex w-full items-center justify-between px-6 py-3.5 text-right transition-colors hover:bg-background"
                >
                  <p className="font-estedad text-sm font-medium text-text-primary">
                    {product.name}
                  </p>
                  <Badge variant={product.stock === 0 ? "danger" : "warning"}>
                    {product.stock === 0
                      ? "ناموجود"
                      : `${product.stock} عدد باقی‌مانده`}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* Recent Orders Table */}
      <Card className="overflow-hidden border-primary-300 p-0">
        <div className="flex items-center justify-between border-b border-primary-300 px-6 py-4">
          <div>
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              آخرین سفارش‌ها
            </h2>
            <p className="mt-1 font-estedad text-xs text-text-secondary">
              ۵ سفارش آخر ثبت‌شده
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="font-estedad text-xs font-medium text-primary-900 hover:underline"
          >
            مشاهده همه
          </button>
        </div>

        {summary.recentOrders.length === 0 ? (
          <p className="p-6 text-center font-estedad text-sm text-text-secondary">
            سفارشی ثبت نشده است.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {summary.recentOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex w-full items-center justify-between px-6 py-3.5 text-right transition-colors hover:bg-background"
              >
                <div>
                  <p className="font-inter text-sm font-medium text-text-primary">
                    #{order.id}
                  </p>
                  <p className="mt-0.5 font-estedad text-xs text-text-secondary">
                    {order.customer}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-estedad text-xs text-text-secondary">
                    {formatPrice(order.amount)} تومان
                  </span>
                  <Badge variant={statusBadgeVariant[order.status]}>
                    {statusMeta[order.status].label}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Analytics;
