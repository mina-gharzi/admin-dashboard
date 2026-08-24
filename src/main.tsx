/*
  ==========================================================
  main.tsx
  ----------------------------------------------------------
  Application entry point.
  ==========================================================
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

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

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
