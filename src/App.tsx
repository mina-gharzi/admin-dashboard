/*
  ==========================================================
  App.tsx
  ----------------------------------------------------------
  کامپوننت ریشه‌ی برنامه. قبلاً داخل main.tsx تعریف می‌شد،
  ولی چون main.tsx نقطه‌ی ورودیه (createRoot().render(...) رو
  صدا می‌زنه) و کنارش یه Component هم export می‌کرد، Fast
  Refresh نمی‌تونست مرز درستی برای این فایل تشخیص بده. برای
  همین Component به این فایل جدا منتقل شد.
  ==========================================================
*/

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import router from "./routes/routes";
import { useUIStore } from "./store";

export default function App() {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-left"
        rtl
        autoClose={3000}
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="font-estedad text-sm"
      />
    </>
  );
}
