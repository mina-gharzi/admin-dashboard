/*
  ==========================================================
  Forbidden.tsx
  ----------------------------------------------------------
  صفحه ۴۰۳ — دسترسی غیرمجاز
  ----------------------------------------------------------
  وقتی کاربر لاگین‌شده تلاش می‌کنه به صفحه‌ای بره که نقشش
  اجازه‌ی دیدنش رو نداره (RequireRole)، این صفحه نمایش داده
  میشه؛ برخلاف ۴۰۴، اینجا مسیر معتبره ولی کاربر مجاز نیست.
  ==========================================================
*/


import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

import Button from "../components/ui/Button";
import { useAuthStore } from "../store";
import { roleLabels } from "../utils/permissions";

function Forbidden() {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.user?.role);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-900 px-5">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-white">
          <ShieldAlert size={34} strokeWidth={1.8} />
        </div>

        <h1 className="mt-5 font-estedad text-2xl font-bold text-white">
          دسترسی غیرمجاز
        </h1>

        <p className="mt-3 font-estedad text-sm leading-6 text-primary-100/70">
          {role
            ? `نقش «${roleLabels[role]}» اجازه‌ی دسترسی به این بخش رو نداره.`
            : "شما اجازه‌ی دسترسی به این بخش رو ندارید."}
        </p>

        <div className="mt-8 flex items-center justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-primary-900 hover:bg-primary-50"
          >
            <Home size={17} />
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Forbidden;
