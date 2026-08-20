/*
  ==========================================================
  Welcome.tsx
  ----------------------------------------------------------
  Welcome / Landing Page
  Minimal Admin Dashboard Landing
  طراحی مینیمال و هماهنگ با Global Design System
  ==========================================================
*/

import { Navigate, Link } from "react-router-dom";

import {
  ArrowLeft,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { useAuthStore } from "../store";

function Welcome() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Users,
      title: "مدیریت مشتریان",
      desc: "مشتریان فروشگاه و سفارش‌هایی که ثبت کرده‌اند را مشاهده کنید.",
    },
    {
      icon: Package,
      title: "مدیریت محصولات",
      desc: "محصولات، قیمت، موجودی و اطلاعات فروش را کنترل کنید.",
    },
    {
      icon: BarChart3,
      title: "گزارش و تحلیل",
      desc: "عملکرد فروشگاه را با داده‌ها و گزارش‌های کاربردی بررسی کنید.",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background text-text-primary">
      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 tablet:px-6">
          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-900 text-white shadow-sm">
              <LayoutDashboard size={19} strokeWidth={2.4} />
            </div>

            <div>
              <span className="block font-estedad text-lg font-bold tracking-tight text-text-primary">
                پنل مدیریت
              </span>

              <span className="-mt-0.5 block font-inter text-[9px] font-semibold tracking-wider text-text-secondary">
                ADMIN DASHBOARD
              </span>
            </div>
          </div>

          {/* Login */}

          <Link
            to="/login"
            className="group inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 font-estedad text-xs font-semibold text-text-primary transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900"
          >
            ورود
            <ArrowLeft
              size={15}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12">
        {/* ==================================================
            HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-2xl bg-primary-900 px-6 py-8 text-white shadow-lg tablet:px-8 tablet:py-10 desktop:px-10 desktop:py-11">
          <div className="relative grid items-center gap-8 desktop:grid-cols-[1fr_0.65fr]">
            {/* HERO CONTENT */}

            <div className="max-w-xl">
              {/* Small Label */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-300/30 bg-white/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />

                <span className="font-estedad text-[11px] font-medium text-primary-100">
                  پنل مدیریت فروشگاه
                </span>
              </div>

              {/* Title */}

              <h1 className="font-estedad text-3xl font-black leading-tight tracking-tight text-white tablet:text-4xl desktop:text-[42px]">
                مدیریت فروشگاه،
                <br />
                <span className="text-primary-100">ساده و یکپارچه</span>
              </h1>

              {/* Description */}

              <p className="mt-4 max-w-lg font-estedad text-xs leading-6 text-primary-100/80 tablet:text-sm">
                مشتریان، محصولات و سفارش‌ها را از یک محیط متمرکز مدیریت کنید.
              </p>

              {/* Action */}

              <div className="mt-6">
                <Link
                  to="/login"
                  className="group inline-flex h-10 items-center gap-2.5 rounded-lg bg-white px-5 font-estedad text-xs font-bold text-primary-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  ورود به پنل
                  <ArrowLeft
                    size={16}
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* ==================================================
                MINIMAL DASHBOARD PREVIEW
            ================================================== */}

            <div className="hidden desktop:block">
              <div className="rounded-xl border border-primary-300/30 bg-white/5 p-4">
                {/* Preview Header */}

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-estedad text-[10px] text-primary-100/60">
                      نمای کلی
                    </span>

                    <p className="mt-0.5 font-estedad text-sm font-semibold text-white">
                      وضعیت فروشگاه
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-primary-100">
                    <TrendingUp size={15} />
                  </div>
                </div>

                {/* Simple Stats */}

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-white/6 px-3 py-3">
                    <div className="flex items-center gap-1.5 text-primary-100/60">
                      <Users size={12} />

                      <span className="font-estedad text-[9px]">مشتریان</span>
                    </div>

                    <p className="mt-2 font-inter text-lg font-bold text-white">
                      ۱,۲۸۴
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/6 px-3 py-3">
                    <div className="flex items-center gap-1.5 text-primary-100/60">
                      <ShoppingCart size={12} />

                      <span className="font-estedad text-[9px]">سفارش‌ها</span>
                    </div>

                    <p className="mt-2 font-inter text-lg font-bold text-white">
                      ۱۲۸
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/6 px-3 py-3">
                    <div className="flex items-center gap-1.5 text-primary-100/60">
                      <Package size={12} />

                      <span className="font-estedad text-[9px]">محصولات</span>
                    </div>

                    <p className="mt-2 font-inter text-lg font-bold text-white">
                      ۳۴۶
                    </p>
                  </div>
                </div>

                {/* Small Activity Line */}

                <div className="mt-3 flex items-center justify-between rounded-lg bg-white/4 px-3 py-2">
                  <span className="font-estedad text-[9px] text-primary-100/60">
                    عملکرد فروشگاه
                  </span>

                  <span className="flex items-center gap-1 font-estedad text-[9px] text-success">
                    <TrendingUp size={11} />
                    ۱۲٪ رشد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FEATURES
        ================================================== */}

        <section className="mt-12 tablet:mt-14">
          {/* Section Header */}

          <div className="mb-6">
            <span className="font-estedad text-[11px] font-semibold text-primary-700">
              امکانات سیستم
            </span>

            <h2 className="mt-1 font-estedad text-2xl font-bold text-text-primary">
              مدیریت، بدون پیچیدگی
            </h2>
          </div>

          {/* Feature Cards */}

          <div className="grid gap-4 tablet:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300/70 hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-900 transition-colors duration-200 group-hover:bg-primary-900 group-hover:text-white">
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  <h3 className="font-estedad text-sm font-bold text-text-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-2 font-estedad text-xs leading-6 text-text-secondary">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            SYSTEM HIGHLIGHTS
        ================================================== */}

        <section className="mt-10 grid gap-4 tablet:grid-cols-2">
          {/* Security */}

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-900 shadow-sm">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h3 className="font-estedad text-sm font-bold text-primary-900">
                  محیطی منظم و مطمئن
                </h3>

                <p className="mt-1 font-estedad text-[11px] leading-5 text-primary-900/70">
                  اطلاعات و بخش‌های مختلف فروشگاه در یک محیط متمرکز و کنترل‌شده
                  در دسترس شما قرار دارند.
                </p>
              </div>
            </div>
          </div>

          {/* Analytics */}

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                <BarChart3 size={18} />
              </div>

              <div>
                <h3 className="font-estedad text-sm font-bold text-text-primary">
                  تصمیم‌گیری بر اساس داده
                </h3>

                <p className="mt-1 font-estedad text-[11px] leading-5 text-text-secondary">
                  شاخص‌ها و گزارش‌های کاربردی، تصویر واضح‌تری از عملکرد فروشگاه
                  در اختیار شما قرار می‌دهند.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FINAL CTA
        ================================================== */}

        <section className="mt-10 rounded-xl bg-primary-900 px-6 py-8 text-white shadow-lg tablet:px-8">
          <div className="flex flex-col gap-5 tablet:flex-row tablet:items-center tablet:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary-100" />

                <span className="font-estedad text-[11px] font-medium text-primary-100">
                  آماده شروع هستید؟
                </span>
              </div>

              <h2 className="font-estedad text-xl font-bold tablet:text-2xl">
                مدیریت فروشگاه را شروع کنید.
              </h2>

              <p className="mt-1 font-estedad text-xs text-primary-100/70">
                همه ابزارهای موردنیاز شما در یک داشبورد.
              </p>
            </div>

            <Link
              to="/login"
              className="group inline-flex h-10 shrink-0 items-center justify-center gap-2.5 rounded-lg bg-white px-5 font-estedad text-xs font-bold text-primary-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              ورود به پنل
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="mt-10 border-t border-border bg-surface">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-col justify-center gap-2 px-5 py-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-900 text-white">
              <LayoutDashboard size={14} />
            </div>

            <span className="font-estedad text-xs text-text-secondary">
              پنل مدیریت فروشگاه
            </span>
          </div>

          <span className="font-inter text-[10px] font-medium tracking-wide text-text-secondary">
            ADMIN DASHBOARD · ۲۰۲۶
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;
