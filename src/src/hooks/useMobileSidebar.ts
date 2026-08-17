/*
  ==========================================================
  useMobileSidebar.ts
  ----------------------------------------------------------
  Handles mobile sidebar behavior.

  Responsibilities:
  - Close sidebar with Escape key
  - Prevent background scrolling when sidebar is open
  ==========================================================
*/

import { useEffect } from "react";

import { useUIStore } from "../store";

/*
  ----------------------------------------------------------
  useMobileSidebar Hook
  ----------------------------------------------------------
*/

export function useMobileSidebar() {
  const {
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useUIStore();

  useEffect(() => {
    /*
      ------------------------------------------------------
      Escape Key
      ------------------------------------------------------
    */

    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        isMobileSidebarOpen
      ) {
        closeMobileSidebar();
      }
    };

    /*
      ------------------------------------------------------
      Prevent Background Scroll
      ------------------------------------------------------
    */

    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    /*
      ------------------------------------------------------
      Event Listener
      ------------------------------------------------------
    */

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    /*
      ------------------------------------------------------
      Cleanup
      ------------------------------------------------------
    */

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow = "";
    };
  }, [
    isMobileSidebarOpen,
    closeMobileSidebar,
  ]);
}