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

import { dashboardPath, DASHBOARD_SEGMENTS } from "./paths";

import DashboardLayout from "../components/layout/DashboardLayout";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import Customers from "../pages/Customers";
import CustomerDetails from "../pages/CustomerDetails";

import Products from "../pages/Products";

import ProductDetails from "../pages/ProductDetails";

import Orders from "../pages/Orders";

import OrderDetails from "../pages/OrderDetails";

import Analytics from "../pages/Analytics";
import Team from "../pages/Team";
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
  صفحه‌ی گزارش‌ها (analytics) و تیم (team) به نقش خاصی نیاز
  دارن — زیر RequireRole قرار گرفتن و طبق
  src/utils/permissions.ts چک میشن. کاربر بدون دسترسی به
  /dashboard/forbidden هدایت میشه. بقیه‌ی صفحات (مشتریان،
  محصولات، سفارش‌ها، تنظیمات) برای همه‌ی نقش‌های لاگین‌شده
  بازن.
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
        path: dashboardPath.root,
        element: <DashboardLayout />,

        children: [
          {
            index: true,
            element: <Dashboard />,
          },

          {
            path: DASHBOARD_SEGMENTS.customers,
            element: <Customers />,
          },
          {
            path: DASHBOARD_SEGMENTS.customerDetails,
            element: <CustomerDetails />,
          },

          {
            element: <RequireRole />,

            children: [
              {
                path: DASHBOARD_SEGMENTS.analytics,
                element: <Analytics />,
              },
              {
                path: DASHBOARD_SEGMENTS.team,
                element: <Team />,
              },
            ],
          },

          {
            path: DASHBOARD_SEGMENTS.products,
            element: <Products />,
          },
          {
            path: DASHBOARD_SEGMENTS.productDetails,
            element: <ProductDetails />,
          },

          {
            path: DASHBOARD_SEGMENTS.orders,
            element: <Orders />,
          },
          {
            path: DASHBOARD_SEGMENTS.orderDetails,
            element: <OrderDetails />,
          },

          {
            path: DASHBOARD_SEGMENTS.settings,
            element: <Settings />,
          },

          {
            path: DASHBOARD_SEGMENTS.forbidden,
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
