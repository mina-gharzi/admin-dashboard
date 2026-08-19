/*
  ==========================================================
  demoAccounts.ts
  ----------------------------------------------------------
  حساب‌های نمونه‌ی از پیش ثبت‌شده، مخصوص صفحه‌ی ورود.
  ----------------------------------------------------------
  چون این پروژه بک‌اند واقعی نداره، این لیست جای «دیتابیس
  کاربران» رو برای فرآیند لاگین می‌گیره. کاربر فقط ایمیل و
  رمز عبور رو وارد می‌کنه (نقش رو خودش انتخاب نمی‌کنه)؛ سیستم
  با پیدا کردن ایمیل داخل همین لیست، خودش تشخیص می‌ده که
  کاربر چه نقشی داره — دقیقاً مثل یه سیستم واقعی که نقش از
  رکورد کاربر تو دیتابیس میاد.

  اگه ایمیلی این‌جا ثبت نشده باشه، ورود رد میشه (چون یعنی
  «تو سیستم ثبت‌نام نشده»).

  رمز عبور بررسی نمیشه (چون بک‌اند واقعی نیست)، فقط باید
  خالی نباشه — این یه محدودیت شناخته‌شده‌ی نسخه‌ی دموئه.
  ==========================================================
*/

import type { Role } from "../utils/permissions";

export interface DemoAccount {
  email: string;
  name: string;
  role: Role;
}

/*
  ----------------------------------------------------------
  یک حساب نمونه برای هر نقش، تا بشه همه‌ی سطوح دسترسی رو
  تو دمو تست کرد.
  ----------------------------------------------------------
*/

export const demoAccounts: DemoAccount[] = [
  {
    email: "admin@shopino.ir",
    name: "مینا احمدی",
    role: "system_admin",
  },
  {
    email: "ali.rezaei@shopino.ir",
    name: "علی رضایی",
    role: "admin",
  },
  {
    email: "negar.karimi@shopino.ir",
    name: "نگار کریمی",
    role: "sales_manager",
  },
  {
    email: "reza.kazemi@shopino.ir",
    name: "رضا کاظمی",
    role: "salesperson",
  },
  {
    email: "sara.mohammadi@shopino.ir",
    name: "سارا محمدی",
    role: "analyst",
  },
];

/**
 * ایمیل واردشده رو (بدون حساسیت به بزرگی/کوچکی حروف و
 * فاصله‌های اضافه) داخل لیست حساب‌های نمونه پیدا می‌کنه.
 */
export function findDemoAccountByEmail(
  email: string,
): DemoAccount | undefined {
  const normalized = email.trim().toLowerCase();

  return demoAccounts.find(
    (account) => account.email.toLowerCase() === normalized,
  );
}
