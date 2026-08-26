/*
  ==========================================================
  main.tsx
  ----------------------------------------------------------
  Application entry point.
  ==========================================================
*/

import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import router from "./routes/routes";
import { useUIStore } from "./store";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Apply the persisted theme before React paints the app.
// This prevents a light/dark flash during page reload.
try {
  const storedUI = localStorage.getItem("ui-preferences");
  const parsedUI = storedUI ? JSON.parse(storedUI) : null;
  const isDarkMode = parsedUI?.state?.isDarkMode === true;

  document.documentElement.classList.toggle("dark", isDarkMode);
} catch {
  document.documentElement.classList.remove("dark");
}

function AppRoot() {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-left"
        rtl
        autoClose={3000}
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="font-estedad text-sm"
      />
    </>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);
