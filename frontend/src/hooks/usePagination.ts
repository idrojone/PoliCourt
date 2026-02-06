import { useState } from "react";

export const usePagination = (initialPage = 1, defaultLimit = 15) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(defaultLimit);
    console.log("Pagination state:", { page, limit });
    return {
        page,
        setPage,
        limit,
        setLimit,
    };
};