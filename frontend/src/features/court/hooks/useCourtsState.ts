import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
  const n = Number(v);
  if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
  return Math.floor(n);
}

export function useCourtsState() {
  const { get, set, setMany } = useUrlState();

  const q = get("q", "");
  const name = get("name", "");
  const locationDetails = get("locationDetails", "");
  const price_h = get("price_h", "");
  const capacity = parsePositiveInt(get("capacity", ""), undefined as any);
  const isIndoor = get("isIndoor", ""); // "true" | "false" | ""
  const surface = get("surface", "");
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

  const setName = useCallback((v: string) => setMany({ name: v, page: 1 }), [setMany]);
  const setLocationDetails = useCallback((v: string) => setMany({ locationDetails: v, page: 1 }), [setMany]);
  const setPriceH = useCallback((v: number | null) => setMany({ price_h: v ?? "", page: 1 }), [setMany]);
  const setCapacity = useCallback((v: number) => setMany({ capacity: v, page: 1 }), [setMany]);
  const setIsIndoor = useCallback((v: string) => setMany({ isIndoor: v, page: 1 }), [setMany]);
  const setSurface = useCallback((v: string) => setMany({ surface: v, page: 1 }), [setMany]);
  const setStatus = useCallback((v: string) => setMany({ status: v, page: 1 }), [setMany]);
  const setIsActive = useCallback((v: string) => setMany({ isActive: v, page: 1 }), [setMany]);
  const clearFilters = useCallback(() => setMany({ q: "", name: "", locationDetails: "", price_h: "", capacity: "", isIndoor: "", surface: "", status: "", isActive: "", page: 1 }), [setMany]);

  const setPage = useCallback((p: number) => set("page", p), [set]);
  const setLimit = useCallback((s: number) => setMany({ limit: s, page: 1 }), [setMany]);

  const apiParams: GetCourtsParams = useMemo(
    () => ({
      q: debouncedQ || undefined,
      ...(name ? { name } : {}),
      ...(locationDetails ? { locationDetails } : {}),
      ...(price_h ? { price_h: Number(price_h) } : {}),
      ...(capacity ? { capacity } : {}),
      ...(isIndoor !== "" ? { isIndoor: isIndoor === "true" } : {}),
      ...(surface ? { surface } : {}),
      ...(status ? { status } : {}),
      ...(isActive !== "" ? { isActive: isActive === "true" } : {}),
      page,
      limit,
      sort: sort || undefined,
    }),
    [debouncedQ, name, locationDetails, price_h, capacity, isIndoor, surface, status, isActive, page, limit, sort],
  );

  return {
    qInput,
    setQInput,
    name,
    setName,
    locationDetails,
    setLocationDetails,
    price_h: price_h ? Number(price_h) : undefined,
    setPriceH,
    capacity,
    setCapacity,
    isIndoor,
    setIsIndoor,
    surface,
    setSurface,
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
