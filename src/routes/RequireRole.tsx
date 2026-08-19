/*
  ==========================================================
  RequireRole.tsx
  ----------------------------------------------------------
  مشابه RequireAuth، ولی به‌جای چک کردن لاگین بودن، چک می‌کنه
  که نقش کاربر لاگین‌شده اجازه‌ی دیدن این بخش از مسیرها رو
  داره یا نه (بر اساس src/utils/permissions.ts).

  اگه دسترسی نداشت، به /dashboard/forbidden هدایت میشه؛
  این باید همیشه *داخل* RequireAuth استفاده بشه (یعنی بعد از
  اینکه مطمئن شدیم کاربر اصلاً لاگین کرده).
  ==========================================================
*/

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../store";
import { canAccessPath } from "../utils/permissions";

function RequireRole() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!canAccessPath(user?.role, location.pathname)) {
    return <Navigate to="/dashboard/forbidden" replace />;
  }

  return <Outlet />;
}

export default RequireRole;
