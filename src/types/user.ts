/*
  آرایه‌ی کانونیِ نقش‌های معتبر پنل — تنها منبع حقیقت.
  `permissions.ts` (لیست ALL_ROLES) و sanitizer های
  services/api.ts هم از همین‌جا می‌خونن، نه از یه کپی جدا.
*/
export const ROLES = [
  "system_admin",
  "admin",
  "sales_manager",
  "salesperson",
  "analyst",
] as const;

export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["active", "inactive"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  joinedAt: string;
}

/*
  ----------------------------------------------------------
  Update Payload
  ----------------------------------------------------------
  برای api.users.update — همه‌ی فیلدها اختیاری، ولی برخلاف
  `Partial<User>` خامّ، `id` عمداً از بین فیلدهای قابل‌تغییر
  حذف شده؛ شناسه‌ی یه رکورد نباید از طریق بدنه‌ی update عوض
  بشه (خودِ id همین الان به‌عنوان پارامتر جدا به تابع update
  پاس داده میشه).
  ----------------------------------------------------------
*/
export type UpdateUser = Partial<Omit<User, "id">>;
