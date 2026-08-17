/*
  ==========================================================
  Login.tsx
  ----------------------------------------------------------
  صفحه ورود
  ----------------------------------------------------------
  نکته: چون این پروژه بک‌اند واقعی نداره، این یه ورود Demo
  هست — هر ایمیل/رمزی که وارد بشه پذیرفته میشه. نام واردشده
  همون چیزیه که تو کل پنل (Header, Dashboard و ...) نمایش
  داده میشه.
  ==========================================================
*/

import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store";

interface FormState {
  name: string;
  email: string;
  password: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();

  const [form, setForm] = useState<FormState>(emptyForm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "نام را وارد کنید";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      nextErrors.email = "ایمیل معتبر نیست";
    }

    if (form.password.length < 4) {
      nextErrors.password = "رمز عبور حداقل ۴ کاراکتر باشد";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    login({
      name: form.name.trim(),
      email: form.email.trim(),
      role: "admin",
    });

    toast.success(`خوش آمدید، ${form.name.trim()}!`);

    setSubmitting(false);

    navigate("/", { replace: true });
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
              Login To Dashboard
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block font-estedad text-sm font-medium text-text-primary">
                نام
              </label>

              <div className="relative">
                <User
                  size={17}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                    }))
                  }
                  placeholder="نام خود را وارد کنید"
                  className="h-11 border-border bg-background pr-10 text-text-primary placeholder:text-text-secondary/60 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                  error={Boolean(errors.name)}
                  autoFocus
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 font-estedad text-xs text-danger">
                  {errors.name}
                </p>
              )}
            </div>

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
                  placeholder="you@example.com"
                  className="h-11 border-border bg-background pr-10 text-text-primary placeholder:text-text-secondary/60 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                  error={Boolean(errors.email)}
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

        {/* Demo */}
        <p className="mt-5 text-center font-estedad text-xs text-text-secondary">
          نسخه نمایشی پنل مدیریت
        </p>
      </div>
    </div>
  );
}

export default Login;
