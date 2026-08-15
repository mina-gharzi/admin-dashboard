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

/*
  ==========================================================
  Header.tsx
  ----------------------------------------------------------
  Main header — matched to Dashboard design language
  ==========================================================
*/

import { Menu, Search, Bell, User, ChevronDown, X } from "lucide-react";

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
        "h-[68px]",
        "border-b border-primary-300/70",
        "bg-surface/90",
        "backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "relative flex h-full items-center justify-between",
          "px-4 tablet:px-6 desktop:px-7",
        )}
      >
        {/* ==================================================
            Left Section — Menu + Search
            ================================================== */}
        <div className="flex items-center gap-3 desktop:mr-14">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className={cn(
              "flex desktop:hidden",
              "h-10 w-10",
              "items-center justify-center",
              "rounded-2xl",
              "text-text-secondary",
              "transition-all duration-200",
              "hover:bg-primary-100 hover:text-primary-900",
              "active:scale-95",
            )}
            aria-label={isMobileSidebarOpen ? "بستن منو" : "باز کردن منو"}
          >
            {isMobileSidebarOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Search */}
          <div className="relative hidden w-72 tablet:block">
            <Search
              size={17}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="جستجو ..."
              className={cn(
                "h-10 w-full",
                "rounded-2xl",
                "border border-primary-300/80",
                "bg-background/80",
                "pr-11 pl-4",
                "font-vazirmatn text-sm text-text-primary",
                "placeholder:text-text-secondary/80",
                "outline-none",
                "transition-all duration-200",
                "focus:border-primary-900",
                "focus:bg-surface",
                "focus:ring-[3px] focus:ring-primary-100",
              )}
            />
          </div>
        </div>

        {/* ==================================================
            Right Section — Notifications + User
            ================================================== */}
        <div className="flex items-center gap-1.5 desktop:ml-14">
          {/* Notifications */}
          <button
            type="button"
            className={cn(
              "relative",
              "flex h-10 w-10 items-center justify-center",
              "rounded-2xl",
              "text-text-secondary",
              "transition-all duration-200",
              "hover:bg-primary-100 hover:text-primary-900",
              "active:scale-95",
            )}
            aria-label="اعلان‌ها"
          >
            <Bell size={19} strokeWidth={1.8} />

            {/* Notification Dot */}
            <span
              className={cn(
                "absolute right-2.5 top-2.5",
                "h-2 w-2",
                "rounded-full",
                "bg-danger",
                "ring-2 ring-surface",
              )}
            />
          </button>

          {/* Divider */}
          <div className="mx-1.5 hidden h-8 w-px bg-primary-300/60 tablet:block" />

          {/* User Dropdown */}
          <Dropdown
            trigger={
              <div
                className={cn(
                  "flex items-center gap-2.5",
                  "cursor-pointer",
                  "rounded-2xl py-1.5 pl-1.5 pr-2",
                  "transition-all duration-200",
                  "hover:bg-primary-50",
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-2xl",
                    "bg-primary-100",
                    "text-primary-900",
                    "shadow-sm",
                  )}
                >
                  <User size={17} strokeWidth={1.8} />
                </div>

                {/* User Info */}
                <div className="hidden text-right tablet:block">
                  <p className="font-vazirmatn text-[13px] font-semibold leading-tight text-text-primary">
                    مینا
                  </p>
                  <p className="mt-0.5 font-vazirmatn text-[11px] text-text-secondary">
                    مدیر سیستم
                  </p>
                </div>

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
