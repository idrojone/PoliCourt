import { useSearchParams } from "react-router-dom";
import type { GetClubsParams } from "@/features/types/club/GetClubsParams";
import type { ClubStatus } from "@/features/types/club/Club";

export const useClubsState = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const setPage = (newPage: number) => {
        setSearchParams((prev) => {
            prev.set("page", newPage.toString());
            return prev;
        });
    };

    const filters = {
        name: searchParams.get("name") || "",
        status: (searchParams.get("status") as ClubStatus) || undefined,
        sports: searchParams.getAll("sports") || [],
        isActive: searchParams.get("isActive") === "true" ? true : undefined,
    };

    const setFilters = (newFilters: Partial<typeof filters>) => {
        setSearchParams((prev) => {
            if (newFilters.name !== undefined) {
                if (newFilters.name) prev.set("name", newFilters.name);
                else prev.delete("name");
            }
            if (newFilters.status !== undefined) {
                if (newFilters.status) prev.set("status", newFilters.status);
                else prev.delete("status");
            }
            if (newFilters.sports !== undefined) {
                prev.delete("sports");
                newFilters.sports.forEach((s) => prev.append("sports", s));
            }
            if (newFilters.isActive !== undefined) {
                if (newFilters.isActive) prev.set("isActive", "true");
                else prev.delete("isActive");
            }
            prev.set("page", "1"); // Reset page on filter change
            return prev;
        });
    };

    const apiParams: GetClubsParams = {
        page,
        limit: 9,
        name: filters.name || undefined,
        status: filters.status,
        sports: filters.sports.length > 0 ? filters.sports : undefined,
        isActive: filters.isActive,
    };

    return {
        page,
        setPage,
        filters,
        setFilters,
        apiParams,
    };
};
