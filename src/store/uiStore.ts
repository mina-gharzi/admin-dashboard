/*
  ==========================================================
  uiStore.ts
  ----------------------------------------------------------
  Global UI state + persisted user preferences.
  Theme is persisted so the selected appearance survives reloads.
  ==========================================================
*/

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,

      toggleSidebar: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),

      isMobileSidebarOpen: false,

      toggleMobileSidebar: () =>
        set((state) => ({
          isMobileSidebarOpen: !state.isMobileSidebarOpen,
        })),

      closeMobileSidebar: () =>
        set({ isMobileSidebarOpen: false }),

      isDarkMode: false,

      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),
    }),
    {
      name: "ui-preferences",
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
);
