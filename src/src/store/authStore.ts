/*
  ==========================================================
  authStore.ts
  ----------------------------------------------------------
  Auth State (احراز هویت)
  ----------------------------------------------------------
  نکته مهم: این پروژه بک‌اند واقعی نداره، پس این یه سیستم
  احراز هویت Demo/Mock هست — یعنی هر ایمیل/رمزی که وارد بشه
  «موفق» در نظر گرفته میشه (شبیه‌سازی شده، نه واقعی امن).
  وقتی بک‌اند واقعی اضافه شد، تابع login باید یه درخواست
  واقعی به سرور بزنه و JWT/Session واقعی برگردونه.

  با persist middleware، اطلاعات ورود تو localStorage همین
  مرورگر ذخیره میشه، پس با رفرش صفحه لاگین‌اوت نمیشه.
  ==========================================================
*/

import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  ----------------------------------------------------------
  Auth User Type
  ----------------------------------------------------------
*/

export interface AuthUser {
  name: string;
  email: string;
  role: "admin" | "manager" | "customer";
}

/*
  ----------------------------------------------------------
  Auth Store Type
  ----------------------------------------------------------
*/

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (user: AuthUser) => void;
  logout: () => void;
}

/*
  ----------------------------------------------------------
  Auth Store
  ----------------------------------------------------------
*/

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
