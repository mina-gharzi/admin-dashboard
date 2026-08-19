/*
  ==========================================================
  Sidebar.tsx
  ----------------------------------------------------------
  Main navigation sidebar of the Admin Dashboard.

  مسئولیت‌های این کامپوننت:

  - نمایش منوی اصلی
  - نمایش لینک‌های صفحات
  - مدیریت Sidebar در Desktop
  - مدیریت Sidebar در Mobile
  - نمایش Overlay در Mobile
  - بستن Sidebar بعد از انتخاب یک صفحه
  - جمع و باز کردن Sidebar در Desktop
  ==========================================================
*/

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { cn } from "../../utils/cn";

import { useUIStore, useAuthStore } from "../../store";
import { canAccessPath } from "../../utils/permissions";

import { useMobileSidebar } from "../../hooks/useMobileSidebar";
import { useLogout } from "../../hooks/useLogout";

/*
  ----------------------------------------------------------
  Navigation Items
  ----------------------------------------------------------
*/

const navigationItems = [
  {
    label: "داشبورد",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "کاربران",
    path: "/dashboard/users",
    icon: Users,
  },
  {
    label: "سفارش‌ها",
    path: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "محصولات",
    path: "/dashboard/products",
    icon: Package,
  },
  {
    label: "گزارش‌ها",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
];

/*
  ----------------------------------------------------------
  Sidebar Component
  ----------------------------------------------------------
*/

function Sidebar() {
  /*
    --------------------------------------------------------
    Mobile Sidebar Behavior
    --------------------------------------------------------
  */

  useMobileSidebar();

  /*
    --------------------------------------------------------
    UI Store
    --------------------------------------------------------

    isSidebarCollapsed:
    وضعیت جمع یا باز بودن Sidebar در Desktop

    isMobileSidebarOpen:
    وضعیت باز بودن Sidebar در Mobile

    closeMobileSidebar:
    بستن Sidebar در Mobile

    toggleSidebar:
    جمع یا باز کردن Sidebar در Desktop
    --------------------------------------------------------
  */

  const {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    closeMobileSidebar,
    toggleSidebar,
  } = useUIStore();

  const { logout } = useLogout();
  const role = useAuthStore((state) => state.user?.role);

  // فقط آیتم‌هایی که نقش کاربر فعلی اجازه‌ی دیدنشون رو داره
  const visibleNavigationItems = navigationItems.filter((item) =>
    canAccessPath(role, item.path),
  );

  return (
    <>
      {/* ==================================================
          Mobile Overlay
          ==================================================
          نکته: DashboardLayout سایدبار را داخل یک کارت گرد
          با position: relative قرار داده است، پس این Overlay
          هم باید absolute باشد تا داخل همان کارت بماند و از
          گوشه‌های گرد بیرون نزند.
          ================================================== */}

      {isMobileSidebarOpen && (
        <div
          onClick={closeMobileSidebar}
          className={cn(
            "absolute inset-0 z-30",
            "bg-black/20",
            "desktop:hidden",
          )}
          aria-hidden="true"
        />
      )}

      {/* ==================================================
          Sidebar
          ==================================================
          نکته: قبلاً "fixed" بود که نسبت به کل viewport
          موقعیت می‌گرفت و باعث می‌شد از کارت گرد و padding
          بیرونی DashboardLayout بیرون بزند. حالا "absolute"
          است تا نسبت به همان کارت گرد (که relative است)
          موقعیت بگیرد و ارتفاعش هم با محتوا هماهنگ بماند.
          ================================================== */}

      <aside
        className={cn(
          /*
            ------------------------------------------------
            Base
            ------------------------------------------------
          */

          "absolute inset-y-0 right-0 z-40",
          "flex flex-col",
          "border-l border-border",
          "bg-surface",
          "transition-all duration-300",

          /*
            ------------------------------------------------
            Desktop Position
            ------------------------------------------------
          */

          "desktop:translate-x-0",

          /*
            ------------------------------------------------
            Desktop Width
            ------------------------------------------------
          */

          isSidebarCollapsed ? "desktop:w-20" : "desktop:w-64",

          /*
            ------------------------------------------------
            Mobile Position
            ------------------------------------------------
          */

          isMobileSidebarOpen ? "translate-x-0" : "translate-x-full",

          /*
            ------------------------------------------------
            Mobile Width
            ------------------------------------------------
          */

          "w-64",
        )}
      >
        {/* ==================================================
            Desktop Collapse Button
            ==================================================

            این دکمه مستقیماً به Sidebar متصل است
            و روی لبه‌ی سمت چپ Sidebar قرار می‌گیرد.

            Mobile:
            hidden

            Desktop:
            flex
            ================================================== */}

        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "absolute",
            "-left-4 top-5",

            "hidden desktop:flex",

            "h-8 w-8",
            "items-center justify-center",

            "rounded-full",
            "border border-border",
            "bg-surface",

            "text-text-secondary",

            "shadow-sm",

            "transition-all duration-200",

            "hover:bg-primary-100",
            "hover:text-primary-900",
          )}
          aria-label={
            isSidebarCollapsed ? "باز کردن سایدبار" : "جمع کردن سایدبار"
          }
        >
          {isSidebarCollapsed ? (
            <PanelRightOpen size={16} strokeWidth={1.8} />
          ) : (
            <PanelRightClose size={16} strokeWidth={1.8} />
          )}
        </button>

        {/* ==================================================
            Logo
            ================================================== */}

        <div
          className={cn(
            "flex h-16 items-center",
            "border-b border-border",

            isSidebarCollapsed ? "justify-center px-3" : "px-6",
          )}
        >
          {isSidebarCollapsed ? (
            /*
              ------------------------------------------------
              Collapsed Logo
              ------------------------------------------------
            */

            <span className="font-inter text-xl font-bold text-primary-900">
              A
            </span>
          ) : (
            /*
              ------------------------------------------------
              Full Logo
              ------------------------------------------------
            */

            <div>
              <h1 className="font-inter text-xl font-bold text-primary-900">
                Admin
                <span className="text-text-primary">Panel</span>
              </h1>

              <p className="mt-0.5 font-estedad text-[10px] text-text-secondary">
                مدیریت سیستم
              </p>
            </div>
          )}
        </div>

        {/* ==================================================
            Navigation
            ================================================== */}

        <nav className="flex-1 overflow-y-auto p-4">
          {/* Navigation Title */}

          {!isSidebarCollapsed && (
            <p className="mb-3 px-3 font-estedad text-xs font-medium text-text-secondary">
              منوی اصلی
            </p>
          )}

          {/* Navigation Items */}

          <div className="space-y-1">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    cn(
                      /*
                        ------------------------------------------------
                        Base
                        ------------------------------------------------
                      */

                      "flex items-center rounded-md py-2.5",
                      "font-estedad text-sm",
                      "transition-colors",

                      /*
                        ------------------------------------------------
                        Collapsed / Expanded
                        ------------------------------------------------
                      */

                      isSidebarCollapsed ? "justify-center" : "gap-3 px-3",

                      /*
                        ------------------------------------------------
                        Active / Inactive
                        ------------------------------------------------
                      */

                      isActive
                        ? ["bg-primary-100", "font-medium", "text-primary-900"]
                        : [
                            "text-text-secondary",
                            "hover:bg-primary-100",
                            "hover:text-primary-900",
                          ],
                    )
                  }
                >
                  {/* Icon */}

                  <Icon size={19} strokeWidth={1.8} />

                  {/* Label */}

                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ==================================================
            Bottom Actions
            ================================================== */}

        <div className="border-t border-border p-4">
          {/* ==================================================
              Settings
              ================================================== */}

          <NavLink
            to="/dashboard/settings"
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              cn(
                "mb-1 flex items-center",
                "rounded-md py-2.5",
                "font-estedad text-sm",
                "transition-colors",

                isSidebarCollapsed ? "justify-center" : "gap-3 px-3",

                isActive
                  ? "bg-primary-100 text-primary-900"
                  : [
                      "text-text-secondary",
                      "hover:bg-primary-100",
                      "hover:text-primary-900",
                    ],
              )
            }
          >
            <Settings size={19} strokeWidth={1.8} />

            {!isSidebarCollapsed && <span>تنظیمات</span>}
          </NavLink>

          {/* ==================================================
              Logout
              ================================================== */}

          <button
            type="button"
            onClick={logout}
            className={cn(
              "flex w-full items-center",
              "rounded-md py-2.5",
              "font-estedad text-sm",
              "text-danger",
              "transition-colors",
              "hover:bg-red-50",

              isSidebarCollapsed ? "justify-center" : "gap-3 px-3",
            )}
          >
            <LogOut size={19} strokeWidth={1.8} />

            {!isSidebarCollapsed && <span>خروج</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
