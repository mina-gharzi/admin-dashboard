/*
  ==========================================================
  Welcome.tsx
  ----------------------------------------------------------
  صفحه‌ی خوش‌آمدگویی (Landing Page)
  ----------------------------------------------------------
  اولین صفحه‌ای که کاربر می‌بینه، قبل از ورود. مسیر جریان
  کاربر به این شکله:

      Welcome  →  Login  →  Dashboard

  اگه کاربر از قبل لاگین کرده باشه (isAuthenticated)، مستقیم
  به داشبورد هدایت میشه و این صفحه رو نمی‌بینه.
  ==========================================================
*/

import { Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  LayoutGrid,
  Clock,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

import { useAuthStore } from "../store";

/*
  ----------------------------------------------------------
  Feature List
  ----------------------------------------------------------
*/

const features = [
  {
    icon: LayoutGrid,
    title: "آمار ساده",
    description:
      "تعداد کاربران، محصولات و سفارش‌ها، همیشه در دسترس.",
  },
  {
    icon: Clock,
    title: "مدیریت وضعیت",
    description:
      "وضعیت هر سفارش را با یک کلیک تغییر بده و همه چیز به‌روز بماند.",
  },
  {
    icon: ClipboardList,
    title: "پیگیری لحظه‌ای",
    description:
      "وضعیت هر سفارش از ثبت تا تحویل، در یک نمای واحد و خوانا.",
  },
];

/*
  ----------------------------------------------------------
  Mock Preview Data
  ----------------------------------------------------------
  فقط برای نمایش بصری تو خود صفحه‌ی Welcome؛ داده‌ی واقعی از
  services/api.ts میاد و اینجا استفاده نمیشه.
*/

const previewOrders = [
  { id: "ORD-4821", name: "تیشرت سفید", status: "در انتظار", color: "bg-warning" },
  { id: "ORD-4819", name: "ماگ سرامیکی", status: "در حال پردازش", color: "bg-info" },
  { id: "ORD-4815", name: "دفتر یادداشت", status: "تحویل شده", color: "bg-success" },
];

/*
  ----------------------------------------------------------
  Welcome Component
  ----------------------------------------------------------
*/

function Welcome() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      {/* ==================================================
          Header
          ================================================== */}

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 tablet:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900 text-white">
              <LayoutDashboard size={18} strokeWidth={2} />
            </div>

            <span className="font-estedad text-lg font-bold text-text-primary">
              پنل مدیریت
            </span>
          </div>

          <Link
            to="/login"
            className="font-estedad text-sm font-medium text-text-secondary transition-colors hover:text-primary-900"
          >
            ورود
          </Link>
        </div>
      </header>

      {/* ==================================================
          Hero
          ================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 tablet:px-8 tablet:pt-24">
        <div className="grid items-center gap-12 desktop:grid-cols-2 desktop:gap-16">
          {/* Text */}

          <div>
            <span className="font-estedad text-sm font-medium text-primary-700">
              چرا پنل مدیریت
            </span>

            <h1 className="mt-3 font-estedad text-3xl font-bold leading-tight text-text-primary tablet:text-4xl">
              همه‌چیز برای مدیریت کسب‌وکارتان،
              <br />
              در یک داشبورد ساده و بی‌صدا
            </h1>

            <p className="mt-4 font-estedad leading-7 text-text-secondary">
              کاربران، محصولات و سفارش‌ها را در یک نمای واحد ببینید،
              وضعیت‌شان را تغییر دهید و همه چیز را در جریان نگه دارید.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary-900 px-5 font-estedad text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <ArrowLeft size={16} />
                شروع کنید
              </Link>

              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 font-estedad text-sm font-medium text-text-primary transition-colors hover:bg-primary-100"
              >
                ورود به داشبورد
              </Link>
            </div>
          </div>

          {/* Preview Card */}

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-estedad text-sm font-semibold text-text-primary">
                مرور سفارش‌ها
              </span>

              <span className="font-estedad text-xs text-text-secondary">
                امروز
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="font-estedad text-lg font-bold text-text-primary">
                  ۱۲۸
                </p>
                <p className="mt-1 font-estedad text-xs text-text-secondary">
                  کل سفارش‌ها
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="font-estedad text-lg font-bold text-text-primary">
                  ۹
                </p>
                <p className="mt-1 font-estedad text-xs text-text-secondary">
                  در انتظار
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="font-estedad text-lg font-bold text-text-primary">
                  ۴٫۲م
                </p>
                <p className="mt-1 font-estedad text-xs text-text-secondary">
                  درآمد
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {previewOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-t border-border pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-estedad text-xs text-text-secondary">
                      {order.id}
                    </span>
                    <span className="font-estedad text-sm text-text-primary">
                      {order.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${order.color}`}
                    />
                    <span className="font-estedad text-xs text-text-secondary">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================
            Feature Grid
            ================================================== */}

        <div className="mt-20 grid gap-8 border-t border-border pt-12 tablet:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title}>
                <Icon size={20} strokeWidth={1.8} className="text-text-secondary" />

                <h3 className="mt-4 font-estedad text-base font-semibold text-text-primary">
                  {feature.title}
                </h3>

                <p className="mt-2 font-estedad text-sm leading-6 text-text-secondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Welcome;
