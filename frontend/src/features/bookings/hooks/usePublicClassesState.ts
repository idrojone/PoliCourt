import { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { BookingSearchParams } from "@/features/types/bookings/BookingRecord";

function parsePositiveInt(v: string | number | undefined, fallback: number) {
    const n = Number(v);
    if (!Number.isFinite(n) || Number.isNaN(n) || n < 1) return fallback;
    return Math.floor(n);
}

export function usePublicClassesState() {
    const { get, set, setMany } = useUrlState();

    const q = get("q", "");
    const sportSlug = get("sportSlug", "");
    const courtSlug = get("courtSlug", "");
    const organizerUsername = get("organizerUsername", "");
    const page = parsePositiveInt(get("page", "1"), 1);
    const limit = parsePositiveInt(get("limit", "12"), 12);

    const [qInput, setQInput] = useState(q);
    const debouncedQ = useDebouncedValue(qInput, 300);

    useEffect(() => {
        if (q !== qInput) setQInput(q);
    }, [q]);

    useEffect(() => {
        const nextQ = debouncedQ || "";
        const currentQ = q || "";
        if (nextQ !== currentQ) {
            setMany({ q: nextQ, page: 1 }, { replace: true });
        }
    }, [debouncedQ, q, setMany]);

    const setSportSlug = useCallback((v: string | null) => {
        setMany({ sportSlug: v || "", page: 1 });
    }, [setMany]);

    const setCourtSlug = useCallback((v: string | null) => {
        setMany({ courtSlug: v || "", page: 1 });
    }, [setMany]);

    const [organizerInput, setOrganizerInput] = useState(organizerUsername);
    const debouncedOrganizer = useDebouncedValue(organizerInput, 300);

    useEffect(() => {
        if (organizerUsername !== organizerInput) setOrganizerInput(organizerUsername);
    }, [organizerUsername]);

    useEffect(() => {
        const next = debouncedOrganizer || "";
        const current = organizerUsername || "";
        if (next !== current) setMany({ organizerUsername: next, page: 1 }, { replace: true });
    }, [debouncedOrganizer, organizerUsername, setMany]);

    const clearFilters = useCallback(() => {
        setMany({ q: "", sportSlug: "", courtSlug: "", organizerUsername: "", page: 1 });
    }, [setMany]);

    const setPage = useCallback((p: number) => set("page", p), [set]);

    const apiParams: BookingSearchParams = useMemo(() => ({
        q: debouncedQ || undefined,
        sportSlug: sportSlug || undefined,
        courtSlug: courtSlug || undefined,
        organizerUsername: debouncedOrganizer || undefined,
        // Backend expects 1-indexed pages (page >= 1)
        page: page,
        limit,
    }), [debouncedQ, sportSlug, courtSlug, debouncedOrganizer, page, limit]);

    return {
        qInput,
        setQInput,
        sportSlug,
        setSportSlug,
        courtSlug,
        setCourtSlug,
        organizerInput,
        setOrganizerInput,
        page,
        limit,
        setPage,
        clearFilters,
        apiParams,
    };
}

export default usePublicClassesState;
