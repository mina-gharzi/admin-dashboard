/*
  ==========================================================
  hooks/useDocumentTitle.ts
  ----------------------------------------------------------
  چرا لازمه؟
  چون این یه SPA هست، جابه‌جایی بین صفحات (React Router) هرگز
  یه full page reload انجام نمی‌ده — یعنی `document.title`
  خودش‌به‌خود عوض نمیشه. این برای دسترس‌پذیری مهمه: تغییر
  عنوان تب مرورگر معمولاً همون سیگنالیه که screen readerها
  برای اعلام «صفحه عوض شد» بهش تکیه می‌کنن؛ بدون این، کاربر
  screen reader هیچ‌وقت نمی‌فهمه از سفارش‌ها رفته تو محصولات.

  استفاده:
  useDocumentTitle("سفارش‌ها");
  ==========================================================
*/

import { useEffect } from "react";

const BASE_TITLE = "پنل مدیریت فروشگاه";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
