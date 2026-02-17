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
    const isIndoor = get("isIndoor", "");
    const surfaceParam = get("surface", "");
    const statusParam = get("status", "");
    const sportsParam = get("sports", "");
    const isActive = get("isActive", "");
    const page = parsePositiveInt(get("page", "1"), 1);
    const limit = parsePositiveInt(get("limit", "10"), 10);
    const sort = get("sort", "id_asc");

    const [qInput, setQInput] = useState(q);
    const debouncedQ = useDebouncedValue(qInput, 300);

    // Sync internal state with URL state when URL changes externally
    useEffect(() => {
        if (q !== qInput) {
            setQInput(q);
        }
    }, [q]);

    // Sync URL state with debounced internal state
    useEffect(() => {
        const nextQ = debouncedQ || "";
        const currentQ = q || "";
        if (nextQ !== currentQ) {
            setMany({ q: nextQ, page: 1 }, { replace: true });
        }
    }, [debouncedQ, q, setMany]);

    const setName = useCallback((v: string) => setMany({ name: v, page: 1 }), [setMany]);
    const setLocationDetails = useCallback((v: string) => setMany({ locationDetails: v, page: 1 }), [setMany]);

    const setPriceRange = useCallback((min: number | null, max: number | null) =>
        setMany({ priceMin: min != null ? String(min) : "", priceMax: max != null ? String(max) : "", page: 1 }),
        [setMany]
    );

    const setCapacityRange = useCallback((min: number | null, max: number | null) =>
        setMany({ capacityMin: min != null ? String(min) : "", capacityMax: max != null ? String(max) : "", page: 1 }),
        [setMany]
    );

    const setIsIndoor = useCallback((v: string) => setMany({ isIndoor: v, page: 1 }), [setMany]);

    // Helper for comma-separated params
    const toggleParam = useCallback((param: string, value: string, checked: boolean) => {
        const current = param ? param.split(",").filter(Boolean) : [];
        const next = checked ? Array.from(new Set([...current, value])) : current.filter((s) => s !== value);
        return next.length ? next.join(",") : "";
    }, []);

    const setSurface = useCallback((value: string, checked: boolean) => {
        setMany({ surface: toggleParam(surfaceParam, value, checked), page: 1 });
    }, [setMany, surfaceParam, toggleParam]);

    const setStatus = useCallback((value: string, checked: boolean) => {
        setMany({ status: toggleParam(statusParam, value, checked), page: 1 });
    }, [setMany, statusParam, toggleParam]);

    const setIsActive = useCallback((v: string) => setMany({ isActive: v, page: 1 }), [setMany]);

    const setSports = useCallback((value: string, checked: boolean) => {
        setMany({ sports: toggleParam(sportsParam, value, checked), page: 1 });
    }, [setMany, sportsParam, toggleParam]);

    const clearFilters = useCallback(() => setMany({ q: "", name: "", locationDetails: "", priceMin: "", priceMax: "", capacityMin: "", capacityMax: "", isIndoor: "", surface: "", status: "", isActive: "", sports: "", page: 1 }), [setMany]);

    const setPage = useCallback((p: number) => set("page", p), [set]);
    const setLimit = useCallback((s: number) => setMany({ limit: s, page: 1 }), [setMany]);

    const surface = surfaceParam ? surfaceParam.split(",").filter(Boolean) : [];
    const status = statusParam ? statusParam.split(",").filter(Boolean) : [];
    const sports = sportsParam ? sportsParam.split(",").filter(Boolean) : [];

    const apiParams: GetCourtsParams = useMemo(
        () => ({
            q: debouncedQ || undefined,
            ...(name ? { name } : {}),
            ...(locationDetails ? { locationDetails } : {}),
            ...(priceMinParam !== "" ? { priceMin: Number(priceMinParam) } : {}),
            ...(priceMaxParam !== "" ? { priceMax: Number(priceMaxParam) } : {}),
            ...(capacityMinParam !== "" ? { capacityMin: Number(capacityMinParam) } : {}),
            ...(capacityMaxParam !== "" ? { capacityMax: Number(capacityMaxParam) } : {}),
            ...(isIndoor !== "" ? { isIndoor: isIndoor === "true" } : {}),
            ...(surface.length ? { surface } : {}),
            ...(status.length ? { status } : {}),
            ...(sports.length ? { sports } : {}),
            ...(isActive !== "" ? { isActive: isActive === "true" } : {}),
            page,
            limit,
            sort: sort || undefined,
        }),
        [debouncedQ, name, locationDetails, priceMinParam, priceMaxParam, capacityMinParam, capacityMaxParam, isIndoor, surfaceParam, statusParam, sportsParam, isActive, page, limit, sort],
    );

    return {
        qInput,
        setQInput,
        name,
        setName,
        locationDetails,
        setLocationDetails,
        priceMin: priceMinParam !== "" ? Number(priceMinParam) : undefined,
        priceMax: priceMaxParam !== "" ? Number(priceMaxParam) : undefined,
        setPriceRange,
        capacityMin: capacityMinParam !== "" ? Number(capacityMinParam) : undefined,
        capacityMax: capacityMaxParam !== "" ? Number(capacityMaxParam) : undefined,
        setCapacityRange,
        isIndoor,
        setIsIndoor,
        surface,
        setSurface,
        status,
        setStatus,
        sports,
        setSports,
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
