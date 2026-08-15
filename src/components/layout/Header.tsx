/*
  ==========================================================
  Header.tsx
  ----------------------------------------------------------
  Main header of the Admin Dashboard.

  مسئولیت‌ها:
  - کنترل Sidebar در Desktop
  - کنترل Sidebar در Mobile
  - جستجو
  - اعلان‌ها
  - اطلاعات کاربر
  ==========================================================
*/

import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  X,
} from "lucide-react";

import { useState } from "react";

import { Dropdown } from "../ui/Dropdown";

import { cn } from "../../utils/cn";

import { useUIStore } from "../../store";

/*
  ----------------------------------------------------------
  Header Component
  ----------------------------------------------------------
*/

function Header() {
  const [search, setSearch] = useState("");

  /*
    --------------------------------------------------------
    UI Store
    --------------------------------------------------------
  */
const {
  isMobileSidebarOpen,
  toggleMobileSidebar,
} = useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "h-16",
        "border-b border-border",
        "bg-surface/95",
        "backdrop-blur",
      )}
    >
      <div
        className={cn(
          "relative flex h-full items-center",
          "justify-between",
          "px-4 tablet:px-6",
        )}
      >
        
        {/* ==================================================
            Left Section
            --------------------------------------------------
            Search
            ================================================== */}

        <div
          className={cn(
            "flex items-center gap-3",

            /*
              در دسکتاپ کمی فضا از سمت راست می‌گیریم
              تا با دکمه Sidebar برخورد نکند.
            */

            "desktop:mr-14",
          )}
        >
          {/* Mobile Menu */}

          <button
            type="button"
            onClick={toggleMobileSidebar}
            className={cn(
              "flex desktop:hidden",
              "h-9 w-9",
              "items-center justify-center",
              "rounded-md",
              "text-text-secondary",
              "transition-colors",
              "hover:bg-primary-100",
              "hover:text-primary-900",
            )}
            aria-label={
              isMobileSidebarOpen
                ? "بستن منو"
                : "باز کردن منو"
            }
          >
            {isMobileSidebarOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          {/* Search */}

          <div
            className={cn(
              "relative",
              "hidden tablet:block",
              "w-64",
            )}
          >
            <Search
              size={18}
              className={cn(
                "absolute right-3 top-1/2",
                "-translate-y-1/2",
                "text-text-secondary",
              )}
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              type="search"
              placeholder="جستجو..."
              className={cn(
                "h-10 w-full",
                "rounded-md",
                "border border-border",
                "bg-background",
                "pr-10 pl-3",
                "font-vazirmatn text-sm",
                "text-text-primary",
                "outline-none",

                "placeholder:text-text-secondary",

                "focus:border-primary-900",
                "focus:ring-2",
                "focus:ring-primary-100",
              )}
            />
          </div>
        </div>

        {/* ==================================================
            User Section
            ================================================== */}

        <div
          className={cn(
            "flex items-center gap-2",

            /*
              فضای سمت راست برای دکمه Sidebar
            */

            "desktop:ml-14",
          )}
        >
          {/* Notifications */}

          <button
            type="button"
            className={cn(
              "relative",
              "rounded-md p-2",
              "text-text-secondary",
              "transition-colors",
              "hover:bg-primary-100",
              "hover:text-primary-900",
            )}
            aria-label="Notifications"
          >
            <Bell size={20} />

            {/* Notification Badge */}

            <span
              className={cn(
                "absolute right-1 top-1",
                "h-2 w-2",
                "rounded-full",
                "bg-danger",
              )}
            />
          </button>

          {/* Divider */}

          <div
            className={cn(
              "mx-1 hidden tablet:block",
              "h-7 w-px",
              "bg-border",
            )}
          />

          {/* User Dropdown */}

          <Dropdown
            trigger={
              <div
                className={cn(
                  "flex items-center gap-2",
                  "cursor-pointer",
                )}
              >
                {/* Avatar */}

                <div
                  className={cn(
                    "flex h-8 w-8",
                    "items-center justify-center",
                    "rounded-full",
                    "bg-primary-100",
                    "text-primary-900",
                  )}
                >
                  <User size={17} />
                </div>

                {/* User Info */}

                <div
                  className={cn(
                    "hidden tablet:block",
                    "text-right",
                  )}
                >
                  <p
                    className={cn(
                      "font-vazirmatn",
                      "text-xs font-semibold",
                      "text-text-primary",
                    )}
                  >
                    مینا
                  </p>

                  <p
                    className={cn(
                      "font-vazirmatn",
                      "text-[10px]",
                      "text-text-secondary",
                    )}
                  >
                    مدیر سیستم
                  </p>
                </div>

                {/* Chevron */}

                <ChevronDown
                  size={15}
                  className="hidden text-text-secondary tablet:block"
                />
              </div>
            }
            items={[
              {
                label: "پروفایل",
                onClick: () => {},
              },
              {
                label: "تنظیمات",
                onClick: () => {},
              },
              {
                label: "خروج",
                onClick: () => {},
                danger: true,
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;