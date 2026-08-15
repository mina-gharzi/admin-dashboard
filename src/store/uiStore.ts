/*
  ==========================================================
  uiStore.ts
  ----------------------------------------------------------
  Global UI State
  ----------------------------------------------------------
  این فایل Stateهای عمومی رابط کاربری را مدیریت می‌کند.

  موارد فعلی:

  - باز / بسته بودن Sidebar
  - باز / بسته بودن Sidebar در موبایل
  - Dark Mode

  برای مدیریت این Stateها از Zustand استفاده می‌کنیم.
  ==========================================================
*/

import { create } from "zustand";

/*
  ----------------------------------------------------------
  UI Store Type
  ----------------------------------------------------------
*/

interface UIStore {
  /*
    Sidebar
  */

  isSidebarCollapsed: boolean;

  toggleSidebar: () => void;

  /*
    Mobile Sidebar
  */

  isMobileSidebarOpen: boolean;

  toggleMobileSidebar: () => void;

  closeMobileSidebar: () => void;

  /*
    Theme
  */

  isDarkMode: boolean;

  toggleDarkMode: () => void;
}

/*
  ----------------------------------------------------------
  UI Store
  ----------------------------------------------------------
*/

export const useUIStore =
  create<UIStore>((set) => ({
    /*
      ------------------------------------------------------
      Sidebar
      ------------------------------------------------------
    */

    isSidebarCollapsed: false,

    toggleSidebar: () =>
      set((state) => ({
        isSidebarCollapsed:
          !state.isSidebarCollapsed,
      })),

    /*
      ------------------------------------------------------
      Mobile Sidebar
      ------------------------------------------------------
    */

    isMobileSidebarOpen: false,

    toggleMobileSidebar: () =>
      set((state) => ({
        isMobileSidebarOpen:
          !state.isMobileSidebarOpen,
      })),

    closeMobileSidebar: () =>
      set({
        isMobileSidebarOpen: false,
      }),

    /*
      ------------------------------------------------------
      Dark Mode
      ------------------------------------------------------
    */

    isDarkMode: false,

    toggleDarkMode: () =>
      set((state) => ({
        isDarkMode:
          !state.isDarkMode,
      })),
  }));