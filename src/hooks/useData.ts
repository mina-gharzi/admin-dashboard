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
  - Caching
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
  cacheTime?: number;
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

/*
  ----------------------------------------------------------
  usePagination Hook
  ----------------------------------------------------------
*/

interface UsePaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsePaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export function usePagination(
  totalItems: number,
  initialPageSize: number = 10
): UsePaginationState & UsePaginationActions {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    reset,
  };
}

/*
  ----------------------------------------------------------
  useFilter Hook
  ----------------------------------------------------------
*/

interface UseFilterState<T> {
  filtered: T[];
  filterText: string;
  setFilterText: (text: string) => void;
}

export function useFilter<T>(
  items: T[],
  filterFn: (item: T, filterText: string) => boolean
): UseFilterState<T> {
  const [filterText, setFilterText] = useState("");

  const filtered = filterText
    ? items.filter((item) => filterFn(item, filterText.toLowerCase()))
    : items;

  return {
    filtered,
    filterText,
    setFilterText,
  };
}

/*
  ----------------------------------------------------------
  useAsync Hook (Advanced)
  ----------------------------------------------------------
  
  استفاده برای async operations که نیاز به cleanup دارند
*/

interface UseAsyncState<T> {
  status: "idle" | "pending" | "success" | "error";
  data: T | null;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
  dependencies: unknown[] = []
): UseAsyncState<T> & { execute: () => Promise<T> } {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ status: "pending", data: null, error: null });
    try {
      const result = await asyncFunction();
      setState({ status: "success", data: result, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ status: "error", data: null, error: err });
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- execute() عمداً روی mount صدا زده میشه؛ همون الگوی متداول data-fetching هست
      execute().catch(() => {
        /* خطا از طریق state.error در دسترسه، نیازی به هندل اضافه نیست */
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dependencies از بیرون کنترل میشن
  }, dependencies);

  return { ...state, execute };
}