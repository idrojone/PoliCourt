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
  const priceMinParam = get("priceMin", "");
  const priceMaxParam = get("priceMax", "");
  const capacityMinParam = get("capacityMin", "");
  const capacityMaxParam = get("capacityMax", "");
  const isIndoor = get("isIndoor", ""); // "true" | "false" | ""
  const surfaceParam = get("surface", ""); // comma-separated
  const statusParam = get("status", ""); // comma-separated
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
  const setPriceMin = useCallback((v: number | null) => setMany({ priceMin: v != null ? String(v) : "", page: 1 }), [setMany]);
  const setPriceMax = useCallback((v: number | null) => setMany({ priceMax: v != null ? String(v) : "", page: 1 }), [setMany]);
  const setCapacityMin = useCallback((v: number | null) => setMany({ capacityMin: v != null ? String(v) : "", page: 1 }), [setMany]);
  const setCapacityMax = useCallback((v: number | null) => setMany({ capacityMax: v != null ? String(v) : "", page: 1 }), [setMany]);
  const setIsIndoor = useCallback((v: string) => setMany({ isIndoor: v, page: 1 }), [setMany]);

  // Toggle surface in comma-separated param
  const setSurface = useCallback((value: string, checked: boolean) => {
    const current = surfaceParam ? surfaceParam.split(",").filter(Boolean) : [];
    const next = checked ? Array.from(new Set([...current, value])) : current.filter((s) => s !== value);
    setMany({ surface: next.length ? next.join(",") : "", page: 1 });
  }, [setMany, surfaceParam]);

  // Toggle status in comma-separated param
  const setStatus = useCallback((value: string, checked: boolean) => {
    const current = statusParam ? statusParam.split(",").filter(Boolean) : [];
    const next = checked ? Array.from(new Set([...current, value])) : current.filter((s) => s !== value);
    setMany({ status: next.length ? next.join(",") : "", page: 1 });
  }, [setMany, statusParam]);

  const setIsActive = useCallback((v: string) => setMany({ isActive: v, page: 1 }), [setMany]);
  const clearFilters = useCallback(() => setMany({ q: "", name: "", locationDetails: "", priceMin: "", priceMax: "", capacityMin: "", capacityMax: "", isIndoor: "", surface: "", status: "", isActive: "", page: 1 }), [setMany]);

  const setPage = useCallback((p: number) => set("page", p), [set]);
  const setLimit = useCallback((s: number) => setMany({ limit: s, page: 1 }), [setMany]);

  const surface = surfaceParam ? surfaceParam.split(",").filter(Boolean) : [];
  const status = statusParam ? statusParam.split(",").filter(Boolean) : [];

  const apiParams: GetCourtsParams = useMemo(
    () => ({
      q: debouncedQ || undefined,
      ...(name ? { name } : {}),
      ...(locationDetails ? { locationDetails } : {}),
      ...(priceMinParam ? { priceMin: Number(priceMinParam) } : {}),
      ...(priceMaxParam ? { priceMax: Number(priceMaxParam) } : {}),
      ...(capacityMinParam ? { capacityMin: Number(capacityMinParam) } : {}),
      ...(capacityMaxParam ? { capacityMax: Number(capacityMaxParam) } : {}),
      ...(isIndoor !== "" ? { isIndoor: isIndoor === "true" } : {}),
      ...(surface.length ? { surface } : {}),
      ...(status.length ? { status } : {}),
      ...(isActive !== "" ? { isActive: isActive === "true" } : {}),
      page,
      limit,
      sort: sort || undefined,
    }),
    [debouncedQ, name, locationDetails, priceMinParam, priceMaxParam, capacityMinParam, capacityMaxParam, isIndoor, surfaceParam, statusParam, isActive, page, limit, sort],
  );

  return {
    qInput,
    setQInput,
    name,
    setName,
    locationDetails,
    setLocationDetails,
    priceMin: priceMinParam ? Number(priceMinParam) : undefined,
    setPriceMin,
    priceMax: priceMaxParam ? Number(priceMaxParam) : undefined,
    setPriceMax,
    capacityMin: capacityMinParam ? Number(capacityMinParam) : undefined,
    setCapacityMin,
    capacityMax: capacityMaxParam ? Number(capacityMaxParam) : undefined,
    setCapacityMax,
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
