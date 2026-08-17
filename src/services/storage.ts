/*
  ==========================================================
  services/storage.ts
  ----------------------------------------------------------
  لایه‌ی کمکی برای ذخیره‌ی داده تو localStorage
  ----------------------------------------------------------
  چرا این فایل جداست؟
  چون هم authStore (با zustand/persist) و هم api.ts (که
  Zustand نیست، آرایه‌های ساده‌ست) به یه منطق مشابه نیاز
  دارن. این کمک می‌کنه هردو یکسان رفتار کنن.

  نکته: چون localStorage توی حالت خصوصی (Private/Incognito)
  بعضی مرورگرها یا وقتی پر باشه ممکنه throw کنه، همه‌ی
  عملیات‌ها تو try/catch هستن — اگه ذخیره نشه، برنامه crash
  نمی‌کنه، فقط اون تغییر بین رفرش‌ها نگه داشته نمیشه.
  ==========================================================
*/

const STORAGE_PREFIX = "admin-dashboard:";

/*
  ----------------------------------------------------------
  Load
  ----------------------------------------------------------
*/

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    /*
      یا localStorage در دسترس نیست، یا داده‌ی ذخیره‌شده خراب/
      ناسازگار با فرمت فعلیه. تو هر دو حالت امن‌ترین کار
      برگشتن به fallback (دیتای نمونه) هست.
    */
    return fallback;
  }
}

/*
  ----------------------------------------------------------
  Save
  ----------------------------------------------------------
*/

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* بی‌صدا رد میشیم؛ داده فقط تو همین session می‌مونه */
  }
}

/*
  ----------------------------------------------------------
  Clear
  ----------------------------------------------------------
*/

export function clearStorage(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}
