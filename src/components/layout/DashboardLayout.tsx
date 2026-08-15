import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

import { cn } from "../../utils/cn";
import { useUIStore } from "../../store";

function DashboardLayout() {
  const { isSidebarCollapsed } = useUIStore();

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
          rounded-[24px]
          bg-background
          shadow-sm
          tablet:min-h-[calc(100vh-2rem)]
          tablet:rounded-[28px]
          desktop:min-h-[calc(100vh-2.5rem)]
        "
      >
        <Sidebar />

        <div
          className={cn(
            "min-h-screen",
            "transition-all duration-300",

            isSidebarCollapsed
              ? "desktop:mr-20"
              : "desktop:mr-64",

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