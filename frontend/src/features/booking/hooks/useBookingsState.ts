import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetBookingsParams } from "@/features/types/booking";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
    const n = Number(v);
    if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
    return Math.floor(n);
}

export function useBookingsState() {
    const { get, set, setMany } = useUrlState();

    const q = get("q", "");
    const courtSlug = get("courtSlug", "");
    const organizerUsername = get("organizerUsername", "");
    const statusParam = get("status", "");
    const isActive = get("isActive", "");
    const startTime = get("startTime", "");
    const endTime = get("endTime", "");
    const minPriceParam = get("minPrice", "");
    const maxPriceParam = get("maxPrice", "");
    const page = parsePositiveInt(get("page", "1"), 1);
    const limit = parsePositiveInt(get("limit", "10"), 10);
    const sort = get("sort", "startTime_desc");

    // Debounced search
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

    const setCourtSlug = useCallback(
        (v: string) => setMany({ courtSlug: v, page: 1 }),
        [setMany],
    );
    const setOrganizerUsername = useCallback(
        (v: string) => setMany({ organizerUsername: v, page: 1 }),
        [setMany],
    );
    const setStatus = useCallback(
        (v: string) => setMany({ status: v, page: 1 }),
        [setMany],
    );
    const setIsActive = useCallback(
        (v: string) => setMany({ isActive: v, page: 1 }),
        [setMany],
    );
    const setStartTime = useCallback(
        (v: string) => setMany({ startTime: v, page: 1 }),
        [setMany],
    );
    const setEndTime = useCallback(
        (v: string) => setMany({ endTime: v, page: 1 }),
        [setMany],
    );
    const setMinPrice = useCallback(
        (v: number | null) =>
            setMany({ minPrice: v != null ? String(v) : "", page: 1 }),
        [setMany],
    );
    const setMaxPrice = useCallback(
        (v: number | null) =>
            setMany({ maxPrice: v != null ? String(v) : "", page: 1 }),
        [setMany],
    );

    const setPage = useCallback((p: number) => set("page", p), [set]);
    const setLimit = useCallback(
        (s: number) => setMany({ limit: s, page: 1 }),
        [setMany],
    );

    const clearFilters = useCallback(
        () =>
            setMany({
                q: "",
                courtSlug: "",
                organizerUsername: "",
                status: "",
                isActive: "",
                startTime: "",
                endTime: "",
                minPrice: "",
                maxPrice: "",
                page: 1,
            }),
        [setMany],
    );

    const apiParams: GetBookingsParams = useMemo(
        () => ({
            q: debouncedQ || undefined,
            ...(courtSlug ? { courtSlug } : {}),
            ...(organizerUsername ? { organizerUsername } : {}),
            ...(statusParam ? { status: statusParam } : {}),
            ...(isActive !== "" ? { isActive: isActive === "true" } : {}),
            ...(startTime ? { startTime } : {}),
            ...(endTime ? { endTime } : {}),
            ...(minPriceParam !== "" ? { minPrice: Number(minPriceParam) } : {}),
            ...(maxPriceParam !== "" ? { maxPrice: Number(maxPriceParam) } : {}),
            page,
            limit,
            sort: sort || undefined,
        }),
        [
            debouncedQ,
            courtSlug,
            organizerUsername,
            statusParam,
            isActive,
            startTime,
            endTime,
            minPriceParam,
            maxPriceParam,
            page,
            limit,
            sort,
        ],
    );

    return {
        qInput,
        setQInput,
        courtSlug,
        setCourtSlug,
        organizerUsername,
        setOrganizerUsername,
        status: statusParam,
        setStatus,
        isActive,
        setIsActive,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        minPrice: minPriceParam !== "" ? Number(minPriceParam) : undefined,
        setMinPrice,
        maxPrice: maxPriceParam !== "" ? Number(maxPriceParam) : undefined,
        setMaxPrice,
        page,
        limit,
        setPage,
        setLimit,
        clearFilters,
        apiParams,
    };
}
