/*
  ==========================================================
  RequireAuth.tsx
  ----------------------------------------------------------
  اگه کاربر لاگین نکرده باشه، به /login هدایت میشه.
  مسیر فعلی رو تو state نگه می‌داره تا بعد از ورود بشه
  بهش برگشت (redirect back).
  ==========================================================
*/

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../store";

function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
