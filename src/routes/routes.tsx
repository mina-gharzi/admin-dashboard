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
import RequireRole from "./RequireRole";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import Customers from "../pages/Customers";

import Products from "../pages/Products";

import ProductDetails from "../pages/ProductDetails";

import Orders from "../pages/Orders";

import OrderDetails from "../pages/OrderDetails";

import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";

/*
  ==========================================================
  Router
  ----------------------------------------------------------
  جریان کاربر:  /  (Welcome)  →  /login  →  /dashboard

  / و /login خارج از DashboardLayout و RequireAuth هستن
  (بدون Sidebar/Header). بقیه‌ی مسیرها زیر /dashboard و
  RequireAuth هستن، پس بدون لاگین بودن مستقیم به /login
  هدایت میشن.

  RequireRole (RBAC):
  فقط صفحه‌ی گزارش‌ها (analytics) به نقش خاصی نیاز داره —
  زیر RequireRole قرار گرفته و طبق src/utils/permissions.ts
  چک میشه. کاربر بدون دسترسی به /dashboard/forbidden هدایت
  میشه. بقیه‌ی صفحات (مشتریان، محصولات، سفارش‌ها، تنظیمات)
  برای همه‌ی نقش‌های لاگین‌شده بازن.
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
            path: "customers",
            element: <Customers />,
          },

          {
            element: <RequireRole />,

            children: [
              {
                path: "analytics",
                element: <Analytics />,
              },
            ],
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
            path: "settings",
            element: <Settings />,
          },

          {
            path: "forbidden",
            element: <Forbidden />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
