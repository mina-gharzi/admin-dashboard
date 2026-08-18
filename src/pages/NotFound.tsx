/*
  ==========================================================
  NotFound.tsx
  ----------------------------------------------------------
  صفحه 404 — مسیر پیدا نشد
  ----------------------------------------------------------
  وقتی کاربر آدرس اشتباهی وارد کنه، این صفحه نمایش داده
  میشه و امکان بازگشت به داشبورد رو فراهم می‌کنه.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";

import Button from "../components/ui/Button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-900 px-5">
      <div className="w-full max-w-md text-center">
        <p className="font-inter text-8xl font-black text-white/10">404</p>

        <h1 className="mt-4 font-estedad text-2xl font-bold text-white">
          صفحه مورد نظر پیدا نشد
        </h1>

        <p className="mt-3 font-estedad text-sm leading-6 text-primary-100/70">
          آدرس واردشده نامعتبر است یا صفحه مورد نظر منتقل شده است.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-primary-300/30 bg-transparent text-primary-100 hover:bg-primary-100/10 hover:text-white"
          >
            <ArrowRight size={17} />
            بازگشت
          </Button>

          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-primary-900 hover:bg-primary-50"
          >
            <Home size={17} />
            داشبورد
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
