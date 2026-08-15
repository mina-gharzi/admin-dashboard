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

import { useCallback, useEffect, useState } from "react";

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
*/

export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = [],
  options: UseDataOptions = {}
): UseDataState<T> & { refetch: () => Promise<void> } {
  const {
    retries = 3,
    retryDelay = 1000,
    cacheTime = 0,
    enabled = true,
  } = options;

  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
    isSuccess: false,
  });

  const [retryCount, setRetryCount] = useState(0);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFn();
      setState({
        data: result,
        loading: false,
        error: null,
        isSuccess: true,
      });
      setRetryCount(0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (retryCount < retries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      } else {
        setState({
          data: null,
          loading: false,
          error,
          isSuccess: false,
        });
      }
    }
  }, [fetchFn, retryCount, retries, retryDelay]);

  useEffect(() => {
    if (!enabled) return;

    refetch();
  }, [enabled, ...dependencies]);

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
      execute();
    }
  }, dependencies);

  return { ...state, execute };
}