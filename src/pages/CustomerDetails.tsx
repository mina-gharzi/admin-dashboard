/*
  ==========================================================
  CustomerDetails.tsx
  ----------------------------------------------------------
  صفحه‌ی جزئیات مشتری — نمای کامل پروفایل مشتری، خلاصه‌ی
  خرید و تاریخچه‌ی سفارش‌ها.

  مشتری‌ها رکورد مستقل قابل ویرایش نیستند و از سفارش‌ها
  محاسبه می‌شوند؛ بنابراین این صفحه روی مشاهده، تحلیل و
  دسترسی سریع به سفارش‌ها تمرکز دارد.
  ==========================================================
*/

import { useMemo, type ReactNode } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  UserRound,
  WalletCards,
} from "lucide-react";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { DetailLoadingState, DetailMissingState } from "../components/ui/DetailState";

import { useData } from "../hooks/useData";
import { api, type Order } from "../services/api";
import { formatDate, formatPhone, formatPrice } from "../utils/format";

const orderStatusLabels: Record<
  Order["status"],
  { label: string; variant: "success" | "info" | "warning" | "danger" }
> = {
  pending: { label: "در انتظار", variant: "warning" },
  processing: { label: "در حال پردازش", variant: "info" },
  completed: { label: "تکمیل شده", variant: "success" },
  cancelled: { label: "لغو شده", variant: "danger" },
};

function CustomerDetails() {
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();
  const customerEmail = email ? decodeURIComponent(email) : "";

  const {
    data: customer,
    loading: customerLoading,
    error: customerError,
    refetch: refetchCustomer,
  } = useData(() => api.customers.getByEmail(customerEmail), [customerEmail]);

  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useData(
    () => api.customers.getOrdersByEmail(customerEmail),
    [customerEmail],
  );

  const completedOrders = useMemo(
    () => orders?.filter((order) => order.status === "completed").length ?? 0,
    [orders],
  );

  const cancelledOrders = useMemo(
    () => orders?.filter((order) => order.status === "cancelled").length ?? 0,
    [orders],
  );

  const paidOrActiveOrders =
    orders?.filter((order) => order.status !== "cancelled").length ?? 0;

  const averageOrderValue =
    customer && paidOrActiveOrders > 0
      ? Math.round(customer.totalSpent / paidOrActiveOrders)
      : 0;

  if (customerLoading) {
    return <DetailLoadingState text="در حال بارگذاری اطلاعات مشتری..." />;
  }

  if (customerError || !customer) {
    return (
      <DetailMissingState
        icon={UserRound}
        iconStrokeWidth={1.5}
        title="مشتری مورد نظر پیدا نشد"
        description="ممکن است سفارش‌های این مشتری حذف شده باشند یا ایمیل واردشده معتبر نباشد."
        error={customerError}
        onRetry={refetchCustomer}
        backLabel="بازگشت به مشتریان"
        onBack={() => navigate("/dashboard/customers")}
      />
    );
  }

  const initials = customer.name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        title="جزئیات مشتری"
        description={`نمای کلی فعالیت و سفارش‌های ${customer.name}`}
        breadcrumbs={[
          { label: "مشتریان", href: "/dashboard/customers" },
          { label: "جزئیات مشتری" },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/customers")}
          >
            <ArrowRight size={17} />
            بازگشت به مشتریان
          </Button>
        }
      />

      {/* Profile */}
      <Card className="overflow-hidden border border-primary-300/60 p-0">
        <div className="flex flex-col gap-5 border-b border-primary-100/70 bg-primary-50/30 px-6 py-6 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr from-primary-900 to-primary-700 font-inter text-base font-bold text-white shadow-sm ring-4 ring-primary-100/60">
              {initials || <UserRound size={26} />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-estedad text-xl font-bold text-text-primary">
                  {customer.name}
                </h2>
                <Badge
                  variant={customer.status === "active" ? "success" : "danger"}
                >
                  {customer.status === "active" ? "مشتری فعال" : "غیرفعال"}
                </Badge>
              </div>
              <p
                dir="ltr"
                className="mt-1 text-right font-inter text-xs text-text-secondary"
              >
                {customer.email}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-primary-100/70 bg-surface px-4 py-3">
            <p className="font-estedad text-[11px] text-text-secondary">
              آخرین سفارش
            </p>
            <p className="mt-1 font-inter text-sm font-bold text-text-primary">
              {formatDate(customer.lastOrderDate)}
            </p>
          </div>
        </div>

        <div className="grid gap-3 p-6 tablet:grid-cols-2 desktop:grid-cols-4">
          <StatCard
            icon={<ShoppingBag size={18} />}
            label="تعداد سفارش"
            value={customer.ordersCount.toLocaleString("fa-IR")}
          />
          <StatCard
            icon={<WalletCards size={18} />}
            label="مجموع خرید"
            value={`${formatPrice(customer.totalSpent)} تومان`}
          />
          <StatCard
            icon={<Package size={18} />}
            label="میانگین هر سفارش"
            value={`${formatPrice(averageOrderValue)} تومان`}
          />
          <StatCard
            icon={<CalendarDays size={18} />}
            label="آخرین سفارش"
            value={formatDate(customer.lastOrderDate)}
          />
        </div>

        <div className="grid gap-3 border-t border-primary-100/70 px-6 py-5 tablet:grid-cols-3">
          <ContactItem
            icon={<Mail size={16} />}
            label="ایمیل"
            value={customer.email}
            dir="ltr"
          />
          <ContactItem
            icon={<Phone size={16} />}
            label="تلفن"
            value={customer.phone ? formatPhone(customer.phone) : "ثبت نشده"}
            dir="ltr"
          />
          <ContactItem
            icon={<MapPin size={16} />}
            label="آدرس"
            value={customer.address || "ثبت نشده"}
          />
        </div>
      </Card>

      {/* Order history */}
      <Card className="overflow-hidden border border-primary-300/60 p-0">
        <div className="flex flex-col gap-2 border-b border-primary-100/70 px-6 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="font-estedad text-sm font-bold text-text-primary">
              تاریخچه سفارش‌ها
            </h2>
            <p className="mt-1 font-estedad text-xs text-text-secondary">
              سفارش‌های ثبت‌شده توسط این مشتری، از جدیدترین به قدیمی‌ترین
            </p>
          </div>
          {orders && orders.length > 0 && (
            <div className="flex items-center gap-2 font-estedad text-[11px] text-text-secondary">
              <span>{orders.length.toLocaleString("fa-IR")} سفارش</span>
              <span className="text-border">•</span>
              <span>{completedOrders.toLocaleString("fa-IR")} تکمیل‌شده</span>
            </div>
          )}
        </div>

        {ordersLoading && (
          <div className="flex flex-col items-center justify-center gap-3 p-14">
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
            <p className="font-estedad text-xs text-text-secondary">
              در حال بارگذاری سفارش‌ها...
            </p>
          </div>
        )}

        {!ordersLoading && ordersError && (
          <div className="flex flex-col items-center justify-center gap-3 p-14 text-center">
            <p className="font-estedad text-sm font-medium text-text-primary">
              دریافت سفارش‌ها با مشکل مواجه شد.
            </p>
            <Button variant="outline" onClick={() => refetchOrders()}>
              <RefreshCw size={15} />
              تلاش مجدد
            </Button>
          </div>
        )}

        {!ordersLoading && !ordersError && orders && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Package size={22} />
            </div>
            <p className="font-estedad text-sm font-bold text-text-primary">
              هنوز سفارشی ثبت نشده است
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              با ثبت اولین سفارش، تاریخچه‌ی خرید این مشتری در اینجا نمایش داده
              می‌شود.
            </p>
          </div>
        )}

        {!ordersLoading && !ordersError && orders && orders.length > 0 && (
          <div className="divide-y divide-primary-100/70">
            {orders.map((order) => {
              const status = orderStatusLabels[order.status];
              return (
                <Link
                  key={order.id}
                  to={`/dashboard/orders/${order.id}`}
                  className="group flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-primary-100/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-inset tablet:flex-row tablet:items-center tablet:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900 transition-transform group-hover:scale-105">
                      <Package size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-inter text-xs font-bold text-text-primary">
                        #{order.id}
                      </p>
                      <p className="mt-1 font-estedad text-[11px] text-text-secondary">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 tablet:justify-end">
                    <span className="whitespace-nowrap font-estedad text-xs font-semibold text-text-primary">
                      {formatPrice(order.amount)} تومان
                    </span>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="border-t border-primary-100/70 px-6 py-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-estedad text-[11px] text-text-secondary">
              <span>
                تکمیل‌شده:{" "}
                <strong className="text-success">
                  {completedOrders.toLocaleString("fa-IR")}
                </strong>
              </span>
              <span>
                لغوشده:{" "}
                <strong className="text-danger">
                  {cancelledOrders.toLocaleString("fa-IR")}
                </strong>
              </span>
              <span>
                ارزش خرید:{" "}
                <strong className="text-primary-900">
                  {formatPrice(customer.totalSpent)} تومان
                </strong>
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-primary-100/70 bg-background/40 p-4">
      <div className="flex items-center gap-2 text-primary-900">
        {icon}
        <p className="font-estedad text-[11px] text-text-secondary">{label}</p>
      </div>
      <p className="mt-2 font-estedad text-sm font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  dir,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-primary-100/70 p-3.5">
      <span className="mt-0.5 shrink-0 text-text-secondary">{icon}</span>
      <div className="min-w-0">
        <p className="font-estedad text-[10px] text-text-secondary">{label}</p>
        <p
          dir={dir}
          className="mt-1 truncate font-estedad text-xs font-medium text-text-primary"
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default CustomerDetails;
