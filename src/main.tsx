/*
  ==========================================================
  main.tsx
  ----------------------------------------------------------
  Application entry point.
  ==========================================================
*/
console.log("MAIN.TSX IS RUNNING");
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import router from "./routes/routes";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />

    {/*
      نکته: rtl و rtl:true چون پروژه فارسی/راست‌به‌چپ است.
      از این پس نتیجه‌ی عملیات‌ها (ساخت/ویرایش/حذف/خروج) از
      طریق toast() به کاربر نمایش داده می‌شود.
    */}
    <ToastContainer
      position="top-left"
      rtl
      autoClose={3000}
      theme="light"
      toastClassName="font-estedad text-sm"
    />
  </StrictMode>,
);
