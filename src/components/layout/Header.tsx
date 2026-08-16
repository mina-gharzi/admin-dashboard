/*
  ==========================================================
  Header.tsx
  ----------------------------------------------------------
  Main header of the Admin Dashboard.

  مسئولیت‌ها:
  - کنترل Sidebar در Mobile
  - جستجو
  - اعلان‌ها
  - اطلاعات کاربر
  ==========================================================
*/

import { Menu, Search, Bell, User, X } from "lucide-react";

import { useState } from "react";

import { Dropdown } from "../ui/Dropdown";
import { cn } from "../../utils/cn";
import { useUIStore } from "../../store";

function Header() {
  const [search, setSearch] = useState("");

  const { isMobileSidebarOpen, toggleMobileSidebar } = useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "h-16",
        "border-b border-border",
        "bg-surface/95",
        "backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "flex h-full items-center justify-between",
          "gap-4",
          "px-4 tablet:px-6 desktop:px-7",
        )}
      >
        {/* ==================================================
            Right / Main Section
            Mobile Menu + Search
            ================================================== */}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            aria-label={isMobileSidebarOpen ? "بستن منو" : "باز کردن منو"}
            className={cn(
              "flex shrink-0 desktop:hidden",
              "h-10 w-10 items-center justify-center",
              "rounded-xl",
              "text-text-secondary",
              "transition-colors duration-200",
              "hover:bg-primary-50 hover:text-primary-900",
              "focus:outline-none",
              "focus:ring-2 focus:ring-primary-200",
              "active:scale-95",
            )}
          >
            {isMobileSidebarOpen ? (
              <X size={20} strokeWidth={1.8} />
            ) : (
              <Menu size={20} strokeWidth={1.8} />
            )}
          </button>

          {/* Search */}
          <div
            className="
              relative
              hidden
              w-full
              max-w-md
              tablet:block
            "
          >
            <Search
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-3.5
                top-1/2
                -translate-y-1/2
                text-text-secondary
              "
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجو..."
              aria-label="جستجو در پنل مدیریت"
              className={cn(
                "h-10 w-full",
                "rounded-xl",
                "border border-border",
                "bg-background",
                "pr-11 pl-10",
                "font-vazirmatn text-xs text-text-primary",
                "placeholder:text-text-secondary/70",
                "outline-none",
                "transition-all duration-200",

                // Focus
                "focus:border-primary-700",
                "focus:bg-surface",
                "focus:ring-2 focus:ring-primary-100",
              )}
            />

            {/* Clear Search */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="پاک کردن جستجو"
                className="
                  absolute
                  left-3
                  top-1/2
                  flex
                  h-6
                  w-6
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-md
                  text-text-secondary
                  transition-colors
                  hover:bg-primary-50
                  hover:text-text-primary
                "
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            Left Section
            Notifications + User
            ================================================== */}

        <div className="flex shrink-0 items-center gap-2">
          {/* Notifications */}
          <button
            type="button"
            aria-label="اعلان‌ها"
            title="اعلان‌ها"
            className={cn(
              "relative",
              "flex h-10 w-10 items-center justify-center",
              "rounded-xl",
              "text-text-secondary",
              "transition-colors duration-200",
              "hover:bg-primary-50 hover:text-primary-900",
              "focus:outline-none",
              "focus:ring-2 focus:ring-primary-200",
              "active:scale-95",
            )}
          >
            <Bell size={19} strokeWidth={1.8} aria-hidden="true" />

            {/* Unread indicator */}
            <span
              aria-label="اعلان خوانده‌نشده"
              className="
                absolute
                right-2.5
                top-2
                h-2
                w-2
                rounded-full
                bg-danger
                ring-2
                ring-surface
              "
            />
          </button>

          {/* Divider */}
          <div
            aria-hidden="true"
            className="
              mx-1
              hidden
              h-7
              w-px
              bg-border
              tablet:block
            "
          />

          {/* User Dropdown */}
          <Dropdown
            trigger={
              <div
                className={cn(
                  "flex items-center gap-2",
                  "rounded-xl",
                  "py-1.5 pl-1.5 pr-2",
                  "transition-colors duration-200",
                  "hover:bg-primary-50",
                  "focus-within:ring-2 focus-within:ring-primary-100",
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex shrink-0",
                    "h-9 w-9 items-center justify-center",
                    "rounded-xl",
                    "bg-primary-100",
                    "text-primary-900",
                  )}
                >
                  <User size={17} strokeWidth={1.8} aria-hidden="true" />
                </div>

                {/* User Info */}
                <div className="hidden text-right tablet:block">
                  <p
                    className="
                      font-vazirmatn
                      text-xs
                      font-semibold
                      leading-5
                      text-text-primary
                    "
                  >
                    مینا
                  </p>

                  <p
                    className="
                      font-vazirmatn
                      text-[10px]
                      leading-4
                      text-text-secondary
                    "
                  >
                    مدیر سیستم
                  </p>
                </div>
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
