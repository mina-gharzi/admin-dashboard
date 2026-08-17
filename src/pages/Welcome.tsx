/*
  ==========================================================
  Welcome.tsx
  ----------------------------------------------------------
  صفحه‌ی خوش‌آمدگویی (Landing Page)
  ----------------------------------------------------------
  اولین صفحه‌ای که کاربر قبل از ورود به پنل می‌بیند.

  Flow:
      Welcome → Login → Dashboard
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
  TrendingUp,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Boxes,
  Activity,
  ChevronLeft,
  CircleDollarSign,
} from "lucide-react";

import { useAuthStore } from "../store";

/*
  ==========================================================
  Feature Data
  ==========================================================
*/

/*
  ==========================================================
  Preview Orders
  ----------------------------------------------------------
  داده‌های نمایشی فقط برای Preview صفحه Welcome هستند.
  ==========================================================
*/

/*
  ==========================================================
  Welcome Component
  ==========================================================
*/

function Welcome() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /*
    اگر کاربر قبلاً وارد شده باشد، مستقیماً وارد داشبورد شود.
  */
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      {/* ==================================================
          Header
          ================================================== */}

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 tablet:px-8">
          {/* Logo */}

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-900 text-white shadow-sm">
              <LayoutDashboard size={18} strokeWidth={2} />
            </div>

            <div>
              <span className="block font-estedad text-sm font-bold text-text-primary">
                پنل مدیریت
              </span>

              <span className="block font-inter text-[9px] font-medium tracking-wide text-text-secondary">
                ADMIN DASHBOARD
              </span>
            </div>
          </div>

          {/* Login */}

          <Link
            to="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-primary-300 bg-background px-4 font-estedad text-xs font-medium text-primary-900 transition-all hover:border-primary-700 hover:bg-primary-100"
          >
            ورود
            <ArrowLeft size={14} />
          </Link>
        </div>
      </header>

      {/* ==================================================
          Main
          ================================================== */}

      <main className="mx-auto max-w-7xl px-5 pb-16 tablet:px-8">
        {/* ==================================================
            Hero
            ================================================== */}

        <section className="relative mt-6 overflow-hidden rounded-[28px] bg-primary-900 px-6 py-8 shadow-xl shadow-primary-900/10 tablet:px-10 tablet:py-10 desktop:px-12 desktop:py-12">
          {/* Decorative Background */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-primary-700/30 blur-3xl" />

            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl" />

            <div className="absolute right-1/2 top-0 h-full w-px bg-white/5" />
          </div>

          <div className="relative z-10 grid items-center gap-10 desktop:grid-cols-[1fr_0.9fr]">
            {/* Hero Content */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />

                <span className="font-estedad text-[11px] font-medium text-primary-100">
                  پنل مدیریت فروشگاه
                </span>
              </div>

              <h1 className="mt-5 max-w-2xl font-estedad text-2xl font-extrabold leading-[1.8] text-white tablet:text-3xl desktop:text-4xl">
                مدیریت فروشگاه،
                <br />
                ساده‌تر و دقیق‌تر از همیشه
              </h1>

              <p className="mt-3 max-w-xl font-estedad text-xs leading-7 text-primary-100/85 tablet:text-sm">
                کاربران، محصولات، سفارش‌ها و عملکرد فروشگاه را از یک داشبورد
                یکپارچه مدیریت کنید و در هر لحظه دید کاملی از وضعیت کسب‌وکار
                داشته باشید.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 font-estedad text-sm font-semibold text-primary-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-md"
                >
                  ورود به پنل
                  <ArrowLeft size={16} />
                </Link>

                <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 font-estedad text-xs text-primary-100 backdrop-blur-md">
                  <ShieldCheck size={15} />
                  دسترسی سریع و یکپارچه
                </div>
              </div>
            </div>

            {/* Hero Mini Stats */}

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-estedad text-sm font-bold text-white">
                    نمای کلی فروشگاه
                  </p>

                  <p className="mt-0.5 font-estedad text-[10px] text-primary-100/70">
                    اطلاعات نمونه داشبورد
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-primary-100">
                  <Activity size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-estedad text-[10px] text-primary-100/70">
                      کاربران
                    </span>

                    <Users size={14} className="text-primary-100" />
                  </div>

                  <p className="mt-2 font-inter text-xl font-black text-white">
                    ۱,۲۸۴
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp size={11} className="text-success" />

                    <span className="font-estedad text-[9px] text-success">
                      ۱۲٪ رشد
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-estedad text-[10px] text-primary-100/70">
                      سفارش‌ها
                    </span>

                    <ShoppingCart size={14} className="text-primary-100" />
                  </div>

                  <p className="mt-2 font-inter text-xl font-black text-white">
                    ۱۲۸
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-success" />

                    <span className="font-estedad text-[9px] text-success">
                      ۸۴٪ تکمیل
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-estedad text-[10px] text-primary-100/70">
                      درآمد
                    </span>

                    <CircleDollarSign size={14} className="text-primary-100" />
                  </div>

                  <p className="mt-2 font-inter text-lg font-black text-white">
                    ۴.۲م
                  </p>

                  <span className="font-estedad text-[9px] text-primary-100/70">
                    تومان
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-estedad text-[10px] text-primary-100/70">
                      محصولات
                    </span>

                    <Boxes size={14} className="text-primary-100" />
                  </div>

                  <p className="mt-2 font-inter text-xl font-black text-white">
                    ۳۴۶
                  </p>

                  <span className="font-estedad text-[9px] text-primary-100/70">
                    محصول فعال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            Dashboard Areas
            ================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <p className="font-estedad text-xs font-semibold text-primary-700">
              نمای کلی پنل
            </p>

            <h2 className="mt-1 font-estedad text-xl font-bold text-text-primary">
              چه چیزهایی را می‌توانید مدیریت کنید؟
            </h2>
          </div>

          <div className="grid gap-4 tablet:grid-cols-3">
            {/* Users */}

            <div className="rounded-2xl border border-primary-300/60 bg-surface p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                <Users size={18} />
              </div>

              <h3 className="mt-4 font-estedad text-sm font-bold text-text-primary">
                کاربران
              </h3>

              <p className="mt-1.5 font-estedad text-[11px] leading-6 text-text-secondary">
                مشاهده اطلاعات کاربران و بررسی وضعیت فعال بودن حساب‌ها در یک
                جدول مرتب و خوانا.
              </p>
            </div>

            {/* Products */}

            <div className="rounded-2xl border border-primary-300/60 bg-surface p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                <Package size={18} />
              </div>

              <h3 className="mt-4 font-estedad text-sm font-bold text-text-primary">
                محصولات
              </h3>

              <p className="mt-1.5 font-estedad text-[11px] leading-6 text-text-secondary">
                مدیریت محصولات، قیمت، دسته‌بندی و موجودی در یک محیط ساده و منظم.
              </p>
            </div>

            {/* Analytics */}

            <div className="rounded-2xl border border-primary-300/60 bg-surface p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                <BarChart3 size={18} />
              </div>

              <h3 className="mt-4 font-estedad text-sm font-bold text-text-primary">
                تحلیل و گزارش
              </h3>

              <p className="mt-1.5 font-estedad text-[11px] leading-6 text-text-secondary">
                بررسی وضعیت سفارش‌ها و شاخص‌های مهم برای داشتن دید بهتر نسبت به
                عملکرد فروشگاه.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            Final CTA
            ================================================== */}

        <section className="relative mt-10 overflow-hidden rounded-[28px] bg-primary-900 px-6 py-8 shadow-xl shadow-primary-900/10 tablet:px-10">
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary-700/30 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-5 tablet:flex-row tablet:items-center">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary-100" />

                <span className="font-estedad text-xs font-medium text-primary-100">
                  آماده شروع هستید؟
                </span>
              </div>

              <h2 className="mt-2 font-estedad text-xl font-bold text-white">
                مدیریت فروشگاه را از یکجا شروع کنید.
              </h2>

              <p className="mt-1 font-estedad text-[11px] text-primary-100/75">
                وارد پنل شوید و تمام بخش‌های مدیریت را در اختیار داشته باشید.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-5 font-estedad text-sm font-semibold text-primary-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-50"
            >
              ورود به پنل
              <ArrowLeft size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* ==================================================
          Footer
          ================================================== */}

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 tablet:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-900 text-white">
              <LayoutDashboard size={13} />
            </div>

            <span className="font-estedad text-[10px] font-medium text-text-secondary">
              پنل مدیریت فروشگاه
            </span>
          </div>

          <span className="font-inter text-[9px] text-text-secondary">
            ADMIN DASHBOARD
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;
