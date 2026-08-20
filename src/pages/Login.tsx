/*
  ==========================================================
  Login.tsx
  ----------------------------------------------------------
  صفحه ورود
  ----------------------------------------------------------
  نکته: چون این پروژه بک‌اند واقعی نداره، این یه ورود Demo
  هست، ولی برخلاف قبل، کاربر دیگه نقش خودش رو انتخاب نمی‌کنه.
  فقط ایمیل‌های از پیش ثبت‌شده (src/data/demoAccounts.ts)
  اجازه‌ی ورود دارن؛ سیستم با پیدا کردن ایمیل تو همون لیست،
  خودش تشخیص می‌ده کاربر کیه و چه نقشی داره — دقیقاً مثل یه
  سیستم واقعی که نقش از رکورد کاربر تو دیتابیس میاد، نه از
  انتخاب خود کاربر. رمز عبور بررسی نمیشه (چون بک‌اند واقعی
  نیست)، فقط باید خالی نباشه.

  مشتری‌ها اصلاً جزو حساب‌های این پنل نیستن و نمی‌تونن وارد
  بشن — این پنل فقط مخصوص کارکنانه.
  ==========================================================
*/

import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store";
import { roleLabels } from "../utils/permissions";
import { demoAccounts, findDemoAccountByEmail } from "../data/demoAccounts";

interface FormState {
  email: string;
  password: string;
}

const emptyForm: FormState = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const { isAuthenticated, login } = useAuthStore();

  const [form, setForm] = useState<FormState>(emptyForm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const validate = (): {
    valid: boolean;
    account?: (typeof demoAccounts)[number];
  } => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let account: (typeof demoAccounts)[number] | undefined;

    if (!emailPattern.test(form.email)) {
      nextErrors.email = "ایمیل معتبر نیست";
    } else {
      account = findDemoAccountByEmail(form.email);

      if (!account) {
        nextErrors.email = "این ایمیل در سیستم ثبت نشده است";
      }
    }

    if (form.password.length < 4) {
      nextErrors.password = "رمز عبور حداقل ۴ کاراکتر باشد";
    }

    setErrors(nextErrors);

    return { valid: Object.keys(nextErrors).length === 0, account };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { valid, account } = validate();

    if (!valid || !account) return;

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    login({
      name: account.name,
      email: account.email,
      role: account.role,
    });

    toast.success(`خوش آمدید، ${account.name}!`);

    setSubmitting(false);

    navigate(from, { replace: true });
  };

  const fillDemoAccount = (email: string) => {
    setForm({ email, password: "demo1234" });
    setErrors({});
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-primary-900 px-5 py-10"
    >
      <div className="w-full max-w-100">
        {/* Login Card */}

        <div className="rounded-2xl border border-border bg-surface px-6 py-7 shadow-[0_12px_40px_rgba(17,24,68,0.08)] tablet:px-8 tablet:py-8">
          {/* Title */}
          <div className="mb-7 text-center">
            <h1 className="font-inter text-xl font-bold tracking-tight text-text-primary">
              ورود به پنل مدیریت
            </h1>

            <p className="mt-2 font-estedad text-xs text-text-secondary">
              این پنل فقط مخصوص کارکنان فروشگاهه
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block font-estedad text-sm font-medium text-text-primary">
                ایمیل
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <Input
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      email: e.target.value,
                    }))
                  }
                  placeholder="you@shopino.ir"
                  className="h-11 border-border bg-background pr-10 text-text-primary placeholder:text-text-secondary/60 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                  error={Boolean(errors.email)}
                  autoFocus
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 font-estedad text-xs text-danger">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-estedad text-sm font-medium text-text-primary">
                رمز عبور
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <Input
                  type="password"
                  dir="ltr"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="h-11 border-border bg-background pr-10 text-text-primary placeholder:text-text-secondary/60 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                  error={Boolean(errors.password)}
                />
              </div>

              {errors.password && (
                <p className="mt-1.5 font-estedad text-xs text-danger">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              loading={submitting}
              className="mt-2 h-11 w-full bg-primary-700 font-estedad text-sm hover:bg-primary-900"
            >
              ورود
            </Button>
          </form>
        </div>

        {/* Demo Accounts — چون بک‌اند واقعی نیست، این حساب‌های
            از پیش ثبت‌شده رو برای تست هر نقش نشون می‌دیم */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="mb-3 text-center font-estedad text-xs font-medium text-primary-100/80">
            حساب‌های نمونه (برای تست هر نقش کلیک کنید)
          </p>

          <div className="space-y-1.5">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => fillDemoAccount(account.email)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-right transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <span className="min-w-0">
                  <span className="block truncate font-estedad text-xs font-medium text-white">
                    {account.name}
                  </span>
                  <span dir="ltr" className="block truncate font-inter text-[11px] text-primary-100/60">
                    {account.email}
                  </span>
                </span>

                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 font-estedad text-[11px] text-primary-100">
                  {roleLabels[account.role]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo */}
        <p className="mt-5 text-center font-estedad text-xs text-text-secondary">
          نسخه نمایشی پنل مدیریت
        </p>
      </div>
    </div>
  );
}

export default Login;
