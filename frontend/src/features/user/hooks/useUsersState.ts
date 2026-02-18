import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetUsersParams } from "@/features/types/user/GetUsersParams";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
    const n = Number(v);
    if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
    return Math.floor(n);
}

export function useUsersState() {
    const { get, set, setMany } = useUrlState();

    const q = get("q", "");
    const statusParam = get("status", "");
    const isActive = get("isActive", "");
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
            setMany({ q: nextQ, page: 1 }, { replace: true });
        }
    }, [debouncedQ, q, setMany]);

    const status = statusParam ? statusParam.split(",").filter(Boolean) : [];

    const setStatus = useCallback(
        (value: string, checked: boolean) => {
            const current = statusParam ? statusParam.split(",").filter(Boolean) : [];
            const next = checked
                ? Array.from(new Set([...current, value]))
                : current.filter((s) => s !== value);
            setMany({ status: next.length ? next.join(",") : "", page: 1 });
        },
        [setMany, statusParam]
    );

    const setIsActive = useCallback(
        (v: string) => setMany({ isActive: v, page: 1 }),
        [setMany]
    );
    const clearFilters = useCallback(
        () => setMany({ q: "", status: "", isActive: "", page: 1 }),
        [setMany]
    );

    const setPage = useCallback((p: number) => set("page", p), [set]);
    const setLimit = useCallback(
        (s: number) => setMany({ limit: s, page: 1 }),
        [setMany]
    );

    const setSort = useCallback((s: string) => set("sort", s), [set]);

    const apiParams: GetUsersParams = useMemo(
        () => ({
            q: debouncedQ || undefined,
            ...(status.length ? { status } : {}),
            ...(isActive !== "" ? { isActive: isActive === "true" } : {}),
            page,
            limit,
            sort: sort || undefined,
        }),
        [debouncedQ, status, isActive, page, limit, sort]
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
        sort,
        setSort, // Needed for the list sorting
        setPage,
        setLimit,
        clearFilters,
        apiParams,
    };
}
