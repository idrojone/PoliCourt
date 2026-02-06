import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";


function parsePositiveInt(v: string | number | undefined, fallback: number) {
  const n = Number(v);
  if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
  return Math.floor(n);
}

export function useSportsState() {
  const { get, set, setMany } = useUrlState();

  const q = get("q", "");
  const status = get("status", "");
  const isActive = get("isActive", ""); // "true" | "false" | ""
  const page = parsePositiveInt(get("page", "1"), 1);
  const limit = parsePositiveInt(get("limit", "10"), 10);
  const sort = get("sort", "id_asc");

  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput, 300);

  useEffect(() => {
    if (q !== qInput) {
      setQInput(q);
    }
  }, [q]);

  useEffect(() => {
    const nextQ = debouncedQ || "";
    const currentQ = q || "";
    if (nextQ !== currentQ) {
      setMany({ q: nextQ, page: 1 }, { replace: true });
    }
  }, [debouncedQ, q, setMany]);

  const setStatus = useCallback((v: string) => setMany({ status: v, page: 1 }), [setMany]);
  const setIsActive = useCallback((v: string) => setMany({ isActive: v, page: 1 }), [setMany]);
  const clearFilters = useCallback(() => setMany({ q: "", status: "", isActive: "", page: 1 }), [setMany]);

  const setPage = useCallback((p: number) => set("page", p), [set]);
  const setLimit = useCallback((s: number) => setMany({ limit: s, page: 1 }), [setMany]);

  const apiParams: GetSportsParams = useMemo(
    () => ({
      q: debouncedQ || undefined,
      ...(status ? { status } : {}),
      ...(isActive !== "" ? { isActive: isActive === "true" } : {}),
      page,
      limit,
      sort: sort || undefined,
    }),
    [debouncedQ, status, isActive, page, limit, sort],
  );

  return {
    qInput,
    setQInput,
    status,
    setStatus,
    isActive,
    setIsActive,
    page,
    limit,
    setPage,
    setLimit,
    clearFilters,
    apiParams,
  };
}
