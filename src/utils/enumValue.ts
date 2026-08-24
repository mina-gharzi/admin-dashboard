/*
  ==========================================================
  utils/enumValue.ts
  ----------------------------------------------------------
  کمکی برای تبدیل امنِ یه string خام (مثلاً `e.target.value`
  از یه <select>) به یه union از string literal ها.

  چرا لازمه؟
  چون `e.target.value` همیشه از نوع `string` هست، نه خودِ
  union (مثل `Order["status"]`). فرم‌ها قبلاً این رو مستقیم
  `as Order["status"]` می‌کردن که فقط یه ادعای type-level بود؛
  اگه یه `<option>` با value اشتباه اضافه می‌شد، TypeScript
  هیچ خطایی نشون نمی‌داد و state با یه مقدار نامعتبر پر می‌شد.

  این تابع قبل از cast، واقعاً چک می‌کنه که مقدار جزو
  validValues هست یا نه؛ اگه نبود (که تو یه <select> عادی
  عملاً نباید پیش بیاد)، fallback رو برمی‌گردونه.
  ==========================================================
*/

export function parseEnumValue<T extends string>(
  value: string,
  validValues: readonly T[],
  fallback: T,
): T {
  return (validValues as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}
