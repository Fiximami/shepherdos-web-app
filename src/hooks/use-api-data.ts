"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api/errors";
import { getAccessToken, isDemoModeEnabled } from "@/lib/api/token-storage";

type ApiDataState<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
  isLive: boolean;
  refetch: () => void;
};

export function useApiData<T>(
  fetchKey: string,
  loader: () => Promise<T>,
  fallback: Readonly<T>,
): ApiDataState<T> {
  const [data, setData] = useState<T>(fallback as T);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!getAccessToken() || isDemoModeEnabled()) {
        setIsLoading(false);
        setIsLive(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await loader();
        if (cancelled) return;
        setData(result);
        setIsLive(true);
      } catch (cause) {
        if (cancelled) return;
        setError(getApiErrorMessage(cause));
        setIsLive(false);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
    // fetchKey identifies the request; loader is intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey, refreshKey]);

  return { data, isLoading, error, isLive, refetch: () => setRefreshKey((value) => value + 1) };
}
