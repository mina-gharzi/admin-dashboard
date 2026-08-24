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

  نکته‌ی مهم درباره‌ی Validation:
  خروجی JSON.parse نوعش `any` هست، پس `JSON.parse(raw) as T`
  فقط یه ادعای type-level بود که هیچ تضمینی نمی‌داد — چیزی
  که تو localStorage (یا حتی دستی توسط کاربر تو DevTools)
  ذخیره شده لزوماً با شکل T یکی نیست. برای همین loadFromStorage
  دیگه خودش cast نمی‌کنه؛ به‌جاش یه تابع validate می‌گیره که
  خروجی JSON.parse رو (به‌عنوان unknown) بررسی و به T واقعی
  تبدیل می‌کنه. اگه فرمت داده خراب/ناسازگار بود، validate
  خودش مسئولیت برگردوندن fallback رو داره.
  ==========================================================
*/

const STORAGE_PREFIX = "admin-dashboard:";

/*
  ----------------------------------------------------------
  Load
  ----------------------------------------------------------
*/

export function loadFromStorage<T>(
  key: string,
  fallback: T,
  validate: (raw: unknown) => T,
): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return validate(JSON.parse(raw));
  } catch {
    /*
      یا localStorage در دسترس نیست، یا JSON.parse رو محتوای
      خراب throw کرده. تو هر دو حالت امن‌ترین کار برگشتن به
      fallback (دیتای نمونه) هست.
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
