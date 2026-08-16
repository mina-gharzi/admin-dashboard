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

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, User, ChevronDown, X, Loader2 } from "lucide-react";

import { Dropdown } from "../ui/Dropdown";
import NotificationsPanel from "./NotificationsPanel";

import { cn } from "../../utils/cn";
import { useUIStore, useAuthStore } from "../../store";
import { useLogout } from "../../hooks/useLogout";
import { api, type Order, type Product, type User as UserType } from "../../services/api";

/*
  ----------------------------------------------------------
  Search Results Type
  ----------------------------------------------------------
*/

interface SearchResults {
  users: UserType[];
  products: Product[];
  orders: Order[];
}

const emptyResults: SearchResults = { users: [], products: [], orders: [] };

/*
  ----------------------------------------------------------
  Header Component
  ----------------------------------------------------------
*/

function Header() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const { isMobileSidebarOpen, toggleMobileSidebar } = useUIStore();
  const user = useAuthStore((state) => state.user);

  const roleLabels = {
    admin: "مدیر سیستم",
    manager: "مدیر فروش",
    customer: "مشتری",
  };

  /*
    --------------------------------------------------------
    Global Search
    --------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- برخلاف فرم‌ها، اینجا effect داره با یه سیستم خارجی (جستجوی async debounce‌شده) sync میشه؛ دقیقاً همون caseـی که مستندات React برای استفاده از effect توصیه می‌کنه
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
    results.users.length > 0 ||
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
          <div ref={searchBoxRef} className="relative hidden w-72 tablet:block">
            <Search
              size={17}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              type="search"
              placeholder="جستجوی کاربر، محصول، سفارش ..."
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

            {searching && (
              <Loader2
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin text-text-secondary"
              />
            )}

            {/* Search Results Dropdown */}
            {showResults && search.trim().length >= 2 && (
              <div
                className={cn(
                  "absolute right-0 top-full z-40 mt-2",
                  "w-80",
                  "overflow-hidden rounded-2xl",
                  "border border-primary-300/70",
                  "bg-surface",
                  "shadow-lg",
                )}
              >
                {!searching && !hasResults && (
                  <p className="p-4 text-center font-vazirmatn text-xs text-text-secondary">
                    نتیجه‌ای پیدا نشد.
                  </p>
                )}

                {results.users.length > 0 && (
                  <div className="border-b border-border p-2">
                    <p className="px-2 py-1 font-vazirmatn text-[11px] font-medium text-text-secondary">
                      کاربران
                    </p>
                    {results.users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => goTo("/users")}
                        className="block w-full rounded-lg px-2 py-1.5 text-right font-vazirmatn text-xs text-text-primary hover:bg-background"
                      >
                        {u.name}
                        <span className="mr-1.5 text-text-secondary">
                          — {u.email}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {results.products.length > 0 && (
                  <div className="border-b border-border p-2">
                    <p className="px-2 py-1 font-vazirmatn text-[11px] font-medium text-text-secondary">
                      محصولات
                    </p>
                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(`/products/${p.id}`)}
                        className="block w-full rounded-lg px-2 py-1.5 text-right font-vazirmatn text-xs text-text-primary hover:bg-background"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {results.orders.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 font-vazirmatn text-[11px] font-medium text-text-secondary">
                      سفارش‌ها
                    </p>
                    {results.orders.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => goTo(`/orders/${o.id}`)}
                        className="block w-full rounded-lg px-2 py-1.5 text-right font-vazirmatn text-xs text-text-primary hover:bg-background"
                      >
                        #{o.id}
                        <span className="mr-1.5 text-text-secondary">
                          — {o.customer}
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
            Right Section — Notifications + User
            ================================================== */}
        <div className="flex items-center gap-1.5 desktop:ml-14">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
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

            {notificationsOpen && (
              <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
            )}
          </div>

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

                <div className="hidden text-right tablet:block">
                  <p className="font-vazirmatn text-[13px] font-semibold leading-tight text-text-primary">
                    {user?.name ?? "کاربر"}
                  </p>
                  <p className="mt-0.5 font-vazirmatn text-[11px] text-text-secondary">
                    {roleLabels[user?.role ?? "admin"]}
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
