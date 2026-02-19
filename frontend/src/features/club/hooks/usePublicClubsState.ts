import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetClubsParams } from "@/features/types/club/GetClubsParams";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
    const n = Number(v);
    if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
    return Math.floor(n);
}

export function usePublicClubsState() {
    const { get, set, setMany } = useUrlState();

    const q = get("name", "");
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
    const sports = sportsParam ? sportsParam.split(",").filter(Boolean) : [];

    // Handlers
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

    const clearFilters = useCallback(
        () =>
            setMany({
                name: "",
                sports: "",
                page: 1,
            }),
        [setMany]
    );

    const setPage = useCallback((p: number) => set("page", p), [set]);

    const apiParams: GetClubsParams = useMemo(
        () => ({
            name: debouncedQ || undefined,
            ...(sports.length ? { sportSlugs: sports } : {}),
            isActive: true,
            status: "PUBLISHED",
            page: page - 1, // API is 0-indexed
            limit,
        }),
        [debouncedQ, sports, page, limit]
    );

    return {
        qInput,
        setQInput,
        sports,
        setSports,
        page,
        limit,
        setPage,
        clearFilters,
        apiParams,
    };
}
