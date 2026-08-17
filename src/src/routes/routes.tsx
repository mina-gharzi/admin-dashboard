/*
  ==========================================================
  routes.tsx
  ----------------------------------------------------------
  Application routes
  ----------------------------------------------------------
  تمام مسیرهای اصلی Admin Dashboard در این فایل تعریف می‌شوند.
  ==========================================================
*/

import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import RequireAuth from "./RequireAuth";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import Users from "../pages/Users";

import Products from "../pages/Products";

import ProductDetails from "../pages/ProductDetails";

import Orders from "../pages/Orders";

import OrderDetails from "../pages/OrderDetails";

import Analytics from "../pages/Analytics";

/*
  ----------------------------------------------------------
  Temporary Pages
  ----------------------------------------------------------
  فعلاً فقط تنظیمات placeholder مونده؛ Analytics.tsx واقعی
  شد و از پایین جایگزین شد.
  ----------------------------------------------------------
*/

// eslint-disable-next-line react-refresh/only-export-components -- کامپوننت موقت، بعداً با pages/Settings.tsx جایگزین میشه
function SettingsPage() {
  return (
    <div>
      <h1 className="font-estedad text-2xl font-bold text-text-primary">
        تنظیمات
      </h1>

      <p className="mt-2 font-estedad text-sm text-text-secondary">
        تنظیمات سیستم
      </p>
    </div>
  );
}

/*
  ==========================================================
  Router
  ----------------------------------------------------------
  جریان کاربر:  /  (Welcome)  →  /login  →  /dashboard

  / و /login خارج از DashboardLayout و RequireAuth هستن
  (بدون Sidebar/Header). بقیه‌ی مسیرها زیر /dashboard و
  RequireAuth هستن، پس بدون لاگین بودن مستقیم به /login
  هدایت میشن.
  ==========================================================
*/

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <RequireAuth />,

    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,

        children: [
          {
            index: true,
            element: <Dashboard />,
          },

          {
            path: "users",
            element: <Users />,
          },

          {
            path: "products",
            element: <Products />,
          },
          {
            path: "products/:id",
            element: <ProductDetails />,
          },

          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/:id",
            element: <OrderDetails />,
          },

          {
            path: "analytics",
            element: <Analytics />,
          },

          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
