import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

import { cn } from "../../utils/cn";
import { useUIStore } from "../../store";

function DashboardLayout() {
  const { isSidebarCollapsed, isDarkMode } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-primary-900
        p-3
        tablet:p-4
        desktop:p-5
      "
    >
      <div
        className="
          relative
          min-h-[calc(100vh-1.5rem)]
          overflow-hidden
          rounded-[var(--radius-page)]
          bg-background
          shadow-sm
          tablet:min-h-[calc(100vh-2rem)]
          tablet:rounded-[calc(var(--radius-page)+0.25rem)]
          desktop:min-h-[calc(100vh-2.5rem)]
        "
      >
        <Sidebar />

        <div
          className={cn(
            "min-h-screen",
            "ds-transition-slow",

            isSidebarCollapsed ? "desktop:mr-20" : "desktop:mr-64",

            "mr-0",
          )}
        >
          <Header />

          <main
            className="
              min-h-[calc(100vh-4rem)]
              p-4
              tablet:p-6
              desktop:p-7
            "
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
