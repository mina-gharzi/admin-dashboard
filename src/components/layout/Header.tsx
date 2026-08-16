/*
  ==========================================================
  Header.tsx
  ----------------------------------------------------------
  Main header — matched to Dashboard design language
  ----------------------------------------------------------
  مسئولیت‌ها:

  - کنترل Sidebar در Desktop/Mobile
  - جستجوی زنده بین کاربران/محصولات/سفارش‌ها
  - اعلان‌ها (NotificationsPanel، از داده‌ی واقعی)
  - منوی کاربر (پروفایل/تنظیمات/خروج)
  ==========================================================
*/

/*
  ==========================================================
  Header.tsx
  ----------------------------------------------------------
  Main header — polished Admin Dashboard design
  ----------------------------------------------------------
  نکته:
  فقط UI/UX این فایل بازطراحی شده.
  منطق Search / Notifications / Sidebar / Logout / Navigation
  بدون تغییر باقی مانده است.
  ==========================================================
*/

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Menu, Search, Bell, User, X, Loader2 } from "lucide-react";

import { Dropdown } from "../ui/Dropdown";
import NotificationsPanel from "./NotificationsPanel";

import { cn } from "../../utils/cn";
import { useUIStore } from "../../store";
import { useLogout } from "../../hooks/useLogout";

import {
  api,
  type Order,
  type Product,
  type User as UserType,
} from "../../services/api";

/*
  ==========================================================
  Search Results
  ==========================================================
*/

interface SearchResults {
  users: UserType[];
  products: Product[];
  orders: Order[];
}

const emptyResults: SearchResults = {
  users: [],
  products: [],
  orders: [],
};

/*
  ==========================================================
  Header
  ==========================================================
*/

function Header() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const { isMobileSidebarOpen, toggleMobileSidebar } = useUIStore();

  /*
    ========================================================
    Search
    ========================================================
  */

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);

  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  /*
    --------------------------------------------------------
    Search Effect
    --------------------------------------------------------
  */

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults(emptyResults);
      setSearching(false);
      return;
    }

    setSearching(true);

    const timeoutId = setTimeout(async () => {
      const [users, products, orders] = await Promise.all([
        api.users.search(query),
        api.products.search(query),
        api.orders.search(query),
      ]);

      setResults({
        users: users.slice(0, 3),
        products: products.slice(0, 3),
        orders: orders.slice(0, 3),
      });

      setSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  /*
    --------------------------------------------------------
    Close Search Result On Outside Click
    --------------------------------------------------------
  */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
    --------------------------------------------------------
    Search Helpers
    --------------------------------------------------------
  */

  const hasResults =
    results.users.length > 0 ||
    results.products.length > 0 ||
    results.orders.length > 0;

  const goTo = (path: string) => {
    navigate(path);
    setShowResults(false);
    setSearch("");
  };

  /*
    ========================================================
    Notifications
    ========================================================
  */

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  /*
    ========================================================
    Render
    ========================================================
  */

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "h-[68px]",
        "border-b border-border/80",
        "bg-surface/95",
        "backdrop-blur-xl",
      )}
    >
      <div
        className={cn(
          "flex h-full items-center justify-between",
          "px-4 tablet:px-6 desktop:px-8",
        )}
      >
        {/* ==================================================
            LEFT
            ================================================== */}

        <div className="flex items-center gap-3">
          {/* Mobile Sidebar */}

          <button
            type="button"
            onClick={toggleMobileSidebar}
            className={cn(
              "flex desktop:hidden",
              "h-10 w-10 items-center justify-center",
              "rounded-xl",
              "text-text-secondary",
              "transition-colors duration-200",
              "hover:bg-primary-50 hover:text-primary-900",
              "active:scale-95",
            )}
            aria-label={isMobileSidebarOpen ? "بستن منو" : "باز کردن منو"}
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* =================================================
              Search
              ================================================= */}

          <div ref={searchBoxRef} className="relative hidden tablet:block">
            <div className="relative w-64 desktop:w-80">
              <Search
                size={16}
                strokeWidth={1.8}
                className={cn(
                  "pointer-events-none absolute right-3.5",
                  "top-1/2 -translate-y-1/2",
                  "text-text-secondary",
                )}
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                type="search"
                placeholder="جستجو..."
                className={cn(
                  "h-10 w-full",
                  "rounded-xl",
                  "border border-border",
                  "bg-background",
                  "pr-10 pl-10",
                  "font-vazirmatn text-xs",
                  "text-text-primary",
                  "placeholder:text-text-secondary/70",
                  "outline-none",
                  "transition-all duration-200",
                  "focus:border-primary-700",
                  "focus:bg-surface",
                  "focus:ring-2 focus:ring-primary-100",
                )}
              />

              {searching && (
                <Loader2
                  size={15}
                  className={cn(
                    "absolute left-3.5 top-1/2",
                    "-translate-y-1/2",
                    "animate-spin",
                    "text-text-secondary",
                  )}
                />
              )}
            </div>

            {/* =================================================
                Search Results
                ================================================= */}

            {showResults && search.trim().length >= 2 && (
              <div
                className={cn(
                  "absolute right-0 top-full z-50 mt-2",
                  "w-80",
                  "overflow-hidden",
                  "rounded-2xl",
                  "border border-border",
                  "bg-surface",
                  "shadow-xl",
                )}
              >
                {/* No Result */}

                {!searching && !hasResults && (
                  <div className="px-5 py-8 text-center">
                    <Search
                      size={20}
                      className="mx-auto text-text-secondary/60"
                    />

                    <p className="mt-3 font-vazirmatn text-xs text-text-secondary">
                      نتیجه‌ای پیدا نشد.
                    </p>
                  </div>
                )}

                {/* Users */}

                {results.users.length > 0 && (
                  <div className="border-b border-border p-2">
                    <p className="px-3 py-2 font-vazirmatn text-[10px] font-semibold text-text-secondary">
                      کاربران
                    </p>

                    {results.users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => goTo("/users")}
                        className={cn(
                          "flex w-full items-center",
                          "rounded-xl px-3 py-2.5",
                          "text-right",
                          "transition-colors",
                          "hover:bg-primary-50",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-vazirmatn text-xs font-medium text-text-primary">
                            {u.name}
                          </p>

                          <span className="mt-0.5 block truncate font-vazirmatn text-[10px] text-text-secondary">
                            {u.email}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Products */}

                {results.products.length > 0 && (
                  <div className="border-b border-border p-2">
                    <p className="px-3 py-2 font-vazirmatn text-[10px] font-semibold text-text-secondary">
                      محصولات
                    </p>

                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(`/products/${p.id}`)}
                        className={cn(
                          "block w-full rounded-xl",
                          "px-3 py-2.5",
                          "text-right",
                          "font-vazirmatn text-xs",
                          "text-text-primary",
                          "transition-colors",
                          "hover:bg-primary-50",
                        )}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Orders */}

                {results.orders.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-2 font-vazirmatn text-[10px] font-semibold text-text-secondary">
                      سفارش‌ها
                    </p>

                    {results.orders.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => goTo(`/orders/${o.id}`)}
                        className={cn(
                          "flex w-full items-center",
                          "rounded-xl px-3 py-2.5",
                          "text-right",
                          "transition-colors",
                          "hover:bg-primary-50",
                        )}
                      >
                        <span className="font-inter text-xs font-semibold text-text-primary">
                          #{o.id}
                        </span>

                        <span className="mr-2 truncate font-vazirmatn text-[10px] text-text-secondary">
                          {o.customer}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            RIGHT
            ================================================== */}

        <div className="flex items-center gap-1">
          {/* =================================================
              Notifications
              ================================================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              className={cn(
                "relative flex h-10 w-10",
                "items-center justify-center",
                "rounded-xl",
                "text-text-secondary",
                "transition-colors duration-200",
                "hover:bg-primary-50",
                "hover:text-primary-900",
                "active:scale-95",
              )}
              aria-label="اعلان‌ها"
            >
              <Bell size={19} strokeWidth={1.8} />

              {/* Notification Dot */}

              <span
                className={cn(
                  "absolute right-2.5 top-2.5",
                  "h-1.5 w-1.5",
                  "rounded-full",
                  "bg-danger",
                  "ring-2 ring-surface",
                )}
              />
            </button>

            {notificationsOpen && (
              <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
            )}
          </div>

          {/* Divider */}

          <div
            className={cn("mx-2 hidden tablet:block", "h-7 w-px", "bg-border")}
          />

          {/* =================================================
              User
              ================================================= */}

          <Dropdown
            trigger={
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2",
                  "rounded-xl",
                  "px-2 py-1.5",
                  "transition-colors duration-200",
                  "hover:bg-primary-50",
                )}
              >
                {/* Avatar */}

                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0",
                    "items-center justify-center",
                    "rounded-xl",
                    "bg-primary-100",
                    "text-primary-900",
                  )}
                >
                  <User size={17} strokeWidth={1.8} />
                </div>

                {/* User Info */}

                <div className="hidden text-right tablet:block">
                  <p className="font-vazirmatn text-[12px] font-semibold leading-tight text-text-primary">
                    مینا
                  </p>

                  <p className="mt-0.5 font-vazirmatn text-[10px] text-text-secondary">
                    مدیر سیستم
                  </p>
                </div>

                {/* فقط یک فلش */}
              </button>
            }
            items={[
              {
                label: "پروفایل",
                onClick: () => navigate("/settings"),
              },
              {
                label: "تنظیمات",
                onClick: () => navigate("/settings"),
              },
              {
                label: "خروج",
                onClick: logout,
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
