import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import type { CourtSurfaceType } from "@/features/types/court/Court";
import type { GeneralStatusType } from "@/types";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
    const n = Number(v);
    if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
    return Math.floor(n);
}

export function useCourtsState() {
    const { get, set, setMany } = useUrlState();

    const q = get("name", "");
    const statusParam = get("status", "");
    const surfaceParam = get("surface", "");
    const isIndoorParam = get("isIndoor", "");
    const isActiveParam = get("isActive", "");
    const sportsParam = get("sports", "");
    const page = parsePositiveInt(get("page", "1"), 1);
    const limit = parsePositiveInt(get("limit", "10"), 10);
    const sort = get("sort", "name_asc");

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
            setMany({ name: nextQ, page: 1 }, { replace: true });
        }
    }, [debouncedQ, q, setMany]);

    // Specific Filters
    const status = statusParam
        ? (statusParam.split(",").filter(Boolean) as GeneralStatusType[])
        : [];
    const surfaces = surfaceParam
        ? (surfaceParam.split(",").filter(Boolean) as CourtSurfaceType[])
        : [];
    const sports = sportsParam ? sportsParam.split(",").filter(Boolean) : [];

    // Handlers
    const setStatus = useCallback(
        (value: GeneralStatusType, checked: boolean) => {
            const current = statusParam
                ? (statusParam.split(",").filter(Boolean) as GeneralStatusType[])
                : [];
            const next = checked
                ? Array.from(new Set([...current, value]))
                : current.filter((s) => s !== value);
            setMany({ status: next.length ? next.join(",") : "", page: 1 });
        },
        [setMany, statusParam]
    );

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

    const setIsActive = useCallback(
        (v: string) => setMany({ isActive: v === "all" ? "" : v, page: 1 }),
        [setMany]
    );

    const clearFilters = useCallback(
        () =>
            setMany({
                name: "",
                status: "",
                surface: "",
                sports: "",
                isIndoor: "",
                isActive: "",
                page: 1,
            }),
        [setMany]
    );

    const setPage = useCallback((p: number) => set("page", p), [set]);
    const setLimit = useCallback(
        (s: number) => setMany({ limit: s, page: 1 }),
        [setMany]
    );

    const apiParams: GetCourtsParams = useMemo(
        () => ({
            name: debouncedQ || undefined,
            ...(status.length ? { statuses: status } : {}),
            ...(surfaces.length ? { surfaces } : {}),
            ...(sports.length ? { sports } : {}),
            ...(isIndoorParam !== "" ? { isIndoor: isIndoorParam === "true" } : {}),
            ...(isActiveParam !== "" ? { isActive: isActiveParam === "true" } : {}),
            page,
            limit,
            sort: sort || undefined,
        }),
        [debouncedQ, status, surfaces, isIndoorParam, isActiveParam, page, limit, sort]
    );

    return {
        qInput,
        setQInput,
        status,
        setStatus,
        surfaces,
        setSurfaces,
        sports,
        setSports,
        isIndoorParam, // Raw string for Select value
        setIsIndoor,
        isActiveParam,
        setIsActive,
        page,
        limit,
        setPage,
        setLimit,
        clearFilters,
        apiParams,
    };
}
