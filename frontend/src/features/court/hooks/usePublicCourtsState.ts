import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import type { CourtSurfaceType } from "@/features/types/court/Court";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
    const n = Number(v);
    if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
    return Math.floor(n);
}

export function usePublicCourtsState() {
    const { get, set, setMany } = useUrlState();

    const q = get("name", "");
    const surfaceParam = get("surface", "");
    const isIndoorParam = get("isIndoor", "");
    const sportsParam = get("sports", "");
    const page = parsePositiveInt(get("page", "1"), 1);
    const limit = parsePositiveInt(get("limit", "12"), 12);

    // Local state for input to allow typing without constant URL updates
    const [qInput, setQInput] = useState(q);
    const debouncedQ = useDebouncedValue(qInput, 300);

    // Sync URL to local state (e.g. on back button)
    useEffect(() => {
        if (q !== qInput) {
            setQInput(q);
        }
    }, [q]);

    // Sync debounced local state to URL
    useEffect(() => {
        const nextQ = debouncedQ || "";
        const currentQ = q || "";
        if (nextQ !== currentQ) {
            setMany({ name: nextQ, page: 1 }, { replace: true });
        }
    }, [debouncedQ, q, setMany]);

    // Parsed Filters
    const surfaces = surfaceParam
        ? (surfaceParam.split(",").filter(Boolean) as CourtSurfaceType[])
        : [];
    const sports = sportsParam ? sportsParam.split(",").filter(Boolean) : [];

    // Handlers
    const setSurfaces = useCallback(
        (value: CourtSurfaceType, checked: boolean) => {
            const current = surfaceParam
                ? (surfaceParam.split(",").filter(Boolean) as CourtSurfaceType[])
                : [];
            const next = checked
                ? Array.from(new Set([...current, value]))
                : current.filter((s) => s !== value);
            setMany({ surface: next.length ? next.join(",") : "", page: 1 });
        },
        [setMany, surfaceParam]
    );

    const setSports = useCallback(
        (value: string, checked: boolean) => {
            const current = sportsParam ? sportsParam.split(",").filter(Boolean) : [];
            const next = checked
                ? Array.from(new Set([...current, value]))
                : current.filter((s) => s !== value);
            setMany({ sports: next.length ? next.join(",") : "", page: 1 });
        },
        [setMany, sportsParam]
    );

    const setIsIndoor = useCallback(
        (v: string) => setMany({ isIndoor: v === "all" ? "" : v, page: 1 }),
        [setMany]
    );

    const clearFilters = useCallback(
        () =>
            setMany({
                name: "",
                surface: "",
                sports: "",
                isIndoor: "",
                page: 1,
            }),
        [setMany]
    );

    const setPage = useCallback((p: number) => set("page", p), [set]);

    const apiParams: GetCourtsParams = useMemo(
        () => ({
            name: debouncedQ || undefined,
            ...(surfaces.length ? { surfaces } : {}),
            ...(sports.length ? { sports } : {}),
            ...(isIndoorParam !== "" ? { isIndoor: isIndoorParam === "true" } : {}),
            isActive: true,
            statuses: ["PUBLISHED"],
            page: page - 1,
            limit,
        }),
        [debouncedQ, surfaces, sports, isIndoorParam, page, limit]
    );

    return {
        qInput,
        setQInput,
        surfaces,
        setSurfaces,
        sports,
        setSports,
        isIndoorParam, // Raw string for Select value
        setIsIndoor,
        page,
        limit,
        setPage,
        clearFilters,
        apiParams,
    };
}
