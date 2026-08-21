/*
  ==========================================================
  Header.tsx (Redesigned & UI/UX Enhanced)
  ----------------------------------------------------------
  Header اصلی سیستم - کاملاً هم‌راستا با دیزاین سیستم Dashboard
  ==========================================================
*/

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User as UserIcon,
  X,
  Loader2,
  Package,
  ShoppingCart,
  Users,
  ArrowUpLeft,
  Moon,
  Sun,
} from "lucide-react";

import { Dropdown } from "../ui/Dropdown";
import NotificationsPanel from "./NotificationsPanel";

import { cn } from "../../utils/cn";
import { roleLabels } from "../../utils/permissions";
import { useUIStore, useAuthStore } from "../../store";
import { useLogout } from "../../hooks/useLogout";
import { useData } from "../../hooks/useData";
import {
  api,
  type Customer,
  type Order,
  type Product,
} from "../../services/api";

/*
  ----------------------------------------------------------
  Search Results Type
  ----------------------------------------------------------
*/
interface SearchResults {
  customers: Customer[];
  products: Product[];
  orders: Order[];
}

const emptyResults: SearchResults = { customers: [], products: [], orders: [] };

/*
  ----------------------------------------------------------
  Header Component
  ----------------------------------------------------------
*/
function Header() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const {
    isMobileSidebarOpen,
    toggleMobileSidebar,
    isDarkMode,
    toggleDarkMode,
  } = useUIStore();
  const user = useAuthStore((state) => state.user);

  /*
    --------------------------------------------------------
    Global Search & Keyboard Shortcut (Ctrl+K)
    --------------------------------------------------------
  */
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Shortcut برای سریع فوکوس کردن روی جستجو با Ctrl+K یا Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setResults(emptyResults);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);

    const timeoutId = setTimeout(async () => {
      const [customers, products, orders] = await Promise.all([
        api.customers.search(query),
        api.products.search(query),
        api.orders.search(query),
      ]);

      if (cancelled) return;

      setResults({
        customers: customers.slice(0, 3),
        products: products.slice(0, 3),
        orders: orders.slice(0, 3),
      });
      setSearching(false);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [search]);
  /*
    بستن نتایج جستجو با کلیک بیرون
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    results.customers.length > 0 ||
    results.products.length > 0 ||
    results.orders.length > 0;

  const goTo = (path: string) => {
    navigate(path);
    setShowResults(false);
    setSearch("");
  };

  /*
    --------------------------------------------------------
    Notifications Panel
    --------------------------------------------------------
  */
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // خلاصه‌ی داده‌ها برای تشخیص وجود اعلان جدید (موجودی کم / سفارش در انتظار)
  // این نتیجه بین دکمه‌ی زنگ (برای نقطه‌ی قرمز) و خود پنل به اشتراک گذاشته میشه
  const { data: summary, loading: summaryLoading } = useData(
    () => api.analytics.getSummary(),
    [],
  );
  const hasNotifications =
    (summary?.lowStockProducts.length ?? 0) > 0 ||
    (summary?.ordersByStatus.pending ?? 0) > 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "h-17.5",
        "border-b border-primary-300/60",
        "bg-surface/80",
        "backdrop-blur-xl transition-all",
      )}
    >
      <div
        className={cn(
          "flex h-full items-center justify-between",
          "px-4 tablet:px-6 desktop:px-8",
        )}
      >
        {/* ==================================================
            Left Section — Mobile Menu + Search
            ================================================== */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className={cn(
              "flex desktop:hidden",
              "h-10 w-10",
              "items-center justify-center",
              "rounded-xl border border-primary-300/60",
              "bg-background/80 text-text-secondary",
              "transition-all ds-transition",
              "hover:bg-primary-100 hover:text-primary-900 hover:shadow-sm",
              "active:scale-95",
            )}
            aria-label={isMobileSidebarOpen ? "بستن منو" : "باز کردن منو"}
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Search Box */}
          <div
            ref={searchBoxRef}
            className="relative hidden tablet:block tablet:w-80 desktop:w-96"
          >
            <Search
              size={17}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary-900"
            />

            <input
              ref={searchInputRef}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              type="search"
              aria-label="جستجوی کاربر، محصول یا سفارش"
              placeholder="جستجوی کاربر، محصول، سفارش..."
              className={cn(
                "h-10 w-full",
                "rounded-xl",
                "border border-primary-300/70",
                "bg-background/60",
                "pr-10 pl-16",
                "font-estedad text-xs text-text-primary",
                "placeholder:text-text-secondary/70",
                "outline-none",
                "transition-all ds-transition",
                "focus:border-primary-900 focus:bg-surface focus:shadow-sm",
                "focus:ring-2 focus:ring-primary-100",
              )}
            />

            {searching && (
              <Loader2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin text-primary-900"
              />
            )}

            {/* Search Results Dropdown */}
            {showResults && search.trim().length >= 2 && (
              <div
                className={cn(
                  "absolute right-0 top-full z-50 mt-2",
                  "w-full",
                  "overflow-hidden rounded-2xl",
                  "border border-primary-300/80",
                  "bg-surface/95 backdrop-blur-md",
                  "shadow-xl shadow-primary-900/5",
                  "animate-in fade-in-50 zoom-in-95 ds-animation-fast",
                )}
              >
                {!searching && !hasResults && (
                  <div className="p-6 text-center font-estedad text-xs text-text-secondary">
                    نتیجه‌ای برای{" "}
                    <span className="font-bold text-text-primary">
                      "{search}"
                    </span>{" "}
                    یافت نشد.
                  </div>
                )}

                {/* Customers Section */}
                {results.customers.length > 0 && (
                  <div className="border-b border-primary-100/80 p-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-primary-900">
                      <Users size={13} />
                      <span className="font-estedad text-[11px] font-bold">
                        مشتریان
                      </span>
                    </div>
                    {results.customers.map((c) => (
                      <button
                        key={c.email}
                        type="button"
                        onClick={() => goTo("/dashboard/customers")}
                        className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-right transition-colors hover:bg-primary-100/40"
                      >
                        <span className="font-estedad text-xs font-medium text-text-primary">
                          {c.name}
                        </span>
                        <span className="font-inter text-[11px] text-text-secondary">
                          {c.email}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Products Section */}
                {results.products.length > 0 && (
                  <div className="border-b border-primary-100/80 p-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-primary-900">
                      <Package size={13} />
                      <span className="font-estedad text-[11px] font-bold">
                        محصولات
                      </span>
                    </div>
                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(`/dashboard/products/${p.id}`)}
                        className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-right transition-colors hover:bg-primary-100/40"
                      >
                        <span className="font-estedad text-xs font-medium text-text-primary">
                          {p.name}
                        </span>
                        <ArrowUpLeft
                          size={13}
                          className="text-text-secondary"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Orders Section */}
                {results.orders.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-primary-900">
                      <ShoppingCart size={13} />
                      <span className="font-estedad text-[11px] font-bold">
                        سفارش‌ها
                      </span>
                    </div>
                    {results.orders.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => goTo(`/dashboard/orders/${o.id}`)}
                        className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-right transition-colors hover:bg-primary-100/40"
                      >
                        <span className="font-inter text-xs font-bold text-text-primary">
                          #{o.id}
                        </span>
                        <span className="font-estedad text-xs text-text-secondary">
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
            Right Section — Notifications + User Dropdown
            ================================================== */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={cn(
              "flex h-10 w-10 items-center justify-center",
              "rounded-xl border border-primary-300/60",
              "bg-background/80 text-text-secondary",
              "transition-all ds-transition",
              "hover:bg-primary-100 hover:text-primary-900 hover:shadow-sm",
              "active:scale-95",
            )}
            aria-label="تغییر حالت روشن/تاریک"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {/* Notifications Panel Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
              className={cn(
                "relative",
                "flex h-10 w-10 items-center justify-center",
                "rounded-xl border border-primary-300/60",
                "bg-background/80 text-text-secondary",
                "transition-all ds-transition",
                "hover:bg-primary-100 hover:text-primary-900 hover:shadow-sm",
                "active:scale-95",
                notificationsOpen &&
                  "bg-primary-100 text-primary-900 border-primary-700/40",
              )}
              aria-label="اعلان‌ها"
              aria-expanded={notificationsOpen}
              aria-controls="notifications-panel"
            >
              <Bell size={18} strokeWidth={2} />

              {/* Notification Pulse Indicator — فقط وقتی واقعاً اعلان جدید هست نشون داده میشه */}
              {hasNotifications && (
                <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-surface" />
                </span>
              )}
            </button>

            {notificationsOpen && (
              <NotificationsPanel
                summary={summary}
                loading={summaryLoading}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </div>

          {/* Divider */}
          <div className="mx-1 hidden h-6 w-px bg-primary-300/60 tablet:block" />

          {/* User Profile Dropdown */}
          <Dropdown
            trigger={
              <div
                className={cn(
                  "flex items-center gap-3",
                  "cursor-pointer",
                  "rounded-2xl py-1.5 pr-2 pl-2.5",
                  "border border-transparent",
                  "transition-all ds-transition",
                  "hover:border-primary-300/60 hover:bg-background/80 hover:shadow-xs",
                )}
              >
                {/* User Avatar with Online Indicator */}
                <div className="relative">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center",
                      "rounded-xl",
                      "bg-linear-to-tr from-primary-900 to-primary-700",
                      "text-white shadow-sm",
                    )}
                  >
                    <UserIcon size={18} strokeWidth={2} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface" />
                </div>

                <span className="sr-only">منوی کاربری {user?.name ?? "کاربر سیستم"}</span>

                {/* User Info */}
                <div className="hidden text-right tablet:block">
                  <p className="font-estedad text-xs font-bold leading-tight text-text-primary">
                    {user?.name ?? "کاربر سیستم"}
                  </p>
                  <p className="mt-0.5 font-estedad text-[10px] font-medium text-text-secondary">
                    {roleLabels[user?.role ?? "admin"]}
                  </p>
                </div>
              </div>
            }
            items={[
              {
                label: "پروفایل کاربری",
                onClick: () => navigate("/dashboard/settings"),
              },
              {
                label: "تنظیمات پنل",
                onClick: () => navigate("/dashboard/settings"),
              },
              {
                label: "خروج از حساب",
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
