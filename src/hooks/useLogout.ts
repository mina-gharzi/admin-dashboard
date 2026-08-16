/*
  ==========================================================
  useLogout.ts
  ----------------------------------------------------------
  هوک مشترک خروج از حساب.
  ----------------------------------------------------------
  session رو تو authStore پاک می‌کنه (که خودش localStorage
  رو هم پاک می‌کنه چون authStore با persist ساخته شده) و
  کاربر رو به صفحه‌ی /login برمی‌گردونه.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuthStore } from "../store";

export function useLogout() {
  const navigate = useNavigate();
  const authLogout = useAuthStore((state) => state.logout);

  const logout = () => {
    authLogout();
    toast.info("با موفقیت از حساب خارج شدید.");
    navigate("/login", { replace: true });
  };

  return { logout };
}
