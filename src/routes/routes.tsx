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

import Dashboard from "../pages/Dashboard";

import Users from "../pages/Users";

import Products from "../pages/Products";

import ProductDetails from "../pages/ProductDetails";

import Orders from "../pages/Orders";

import OrderDetails from "../pages/OrderDetails";
/*
  ----------------------------------------------------------
  Temporary Pages
  ----------------------------------------------------------
  فعلاً برای تست Router از کامپوننت‌های ساده استفاده می‌کنیم.
  بعداً این‌ها را با Pageهای واقعی جایگزین می‌کنیم.
  ----------------------------------------------------------
*/

function AnalyticsPage() {
  return (
    <div>
      <h1 className="font-vazirmatn text-2xl font-bold text-text-primary">
        گزارش‌ها
      </h1>

      <p className="mt-2 font-vazirmatn text-sm text-text-secondary">
        گزارش‌ها و تحلیل‌های سیستم
      </p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <h1 className="font-vazirmatn text-2xl font-bold text-text-primary">
        تنظیمات
      </h1>

      <p className="mt-2 font-vazirmatn text-sm text-text-secondary">
        تنظیمات سیستم
      </p>
    </div>
  );
}

/*
  ==========================================================
  Router
  ==========================================================
*/

const router = createBrowserRouter([
  {
    path: "/",
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
        element: <AnalyticsPage />,
      },

      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
