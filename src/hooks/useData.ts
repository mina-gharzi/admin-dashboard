/*
  ==========================================================
  hooks/useData.ts
  ----------------------------------------------------------
  Custom hook برای fetch کردن داده‌ها
  
  قابلیت‌ها:
  - Loading state
  - Error handling
  - Retry logic
  - Refetch function
  ==========================================================
*/

import { useCallback, useEffect, useRef, useState } from "react";

/*
  ----------------------------------------------------------
  Types
  ----------------------------------------------------------
*/

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

interface UseDataOptions {
  retries?: number;
  retryDelay?: number;
  enabled?: boolean;
}

/*
  ----------------------------------------------------------
  useData Hook
  ----------------------------------------------------------
  
  استفاده:
  
  const { data, loading, error } = useData(
    () => fetch('/api/users').then(r => r.json()),
    []
  );

  نکته (محافظت در برابر Race Condition):
  اگر dependencies قبل از تمام‌شدن یک fetch عوض بشن (مثلاً
  کاربر سریع بین صفحات جابه‌جا بشه)، جواب قدیمی نباید
  state جدید رو overwrite کنه. به همین خاطر هر اجرا یک
  فلگ "active" داره که قبل از هر setState چک میشه.
*/

export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = [],
  options: UseDataOptions = {}
): UseDataState<T> & { refetch: () => Promise<void> } {
  const { retries = 3, retryDelay = 1000, enabled = true } = options;

  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
    isSuccess: false,
  });

  /*
    fetchFn معمولاً هر رندر یه رفرنس جدیده (چون inline
    arrow function پاس داده میشه)، پس بجای گذاشتنش تو
    dependency array (که باعث fetch بی‌نهایت میشه)، تو یه
    ref نگهش می‌داریم و همیشه آخرین نسخه‌ش رو صدا می‌زنیم.

    نکته: مقداردهی ref باید داخل effect باشه، نه مستقیم تو
    بدنه‌ی رندر (وگرنه React همچین دستکاری‌ای رو در حین
    رندر مجاز نمی‌دونه).
  */
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  const load = useCallback(
    async (isActive: () => boolean) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      let attempt = 0;

      while (true) {
        try {
          const result = await fetchFnRef.current();

          if (!isActive()) return;

          setState({
            data: result,
            loading: false,
            error: null,
            isSuccess: true,
          });

          return;
        } catch (err) {
          if (attempt < retries) {
            // اگر کامپوننت unmount شده یا dependencyها عوض شدن، retry بی‌فایده است
            if (!isActive()) return;
            attempt += 1;
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }

          if (!isActive()) return;

          const error = err instanceof Error ? err : new Error(String(err));

          setState({
            data: null,
            loading: false,
            error,
            isSuccess: false,
          });

          return;
        }
      }
    },
    [retries, retryDelay],
  );

  const refetch = useCallback(() => load(() => true), [load]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- الگوی متداول data-fetching: بدون کتابخونه‌ای مثل react-query، فچ کردن روی تغییر dependency همیشه به یه setState ختم میشه
    load(() => active);

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dependencies از بیرون کنترل میشن، عمداً spread شدن
  }, [enabled, load, ...dependencies]);

  return { ...state, refetch };
}

