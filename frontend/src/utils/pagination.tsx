import React, { useEffect, useState } from "react";
import { useBetterPaginatedQuery } from "../services/apiService";
import { Pagination as BoostrapPagination } from "react-bootstrap";

export const Pagination = ({ render, apiKey, apiMethod, apiParams }) => {
    let [page, setPage] = useState(1);
    let [maxPage, setMaxPage] = useState(1);
    const { resolvedData: data, status, error } = useBetterPaginatedQuery(
        apiKey,
        apiMethod,
        ...apiParams,
        page
    );

    useEffect(() => {
        if (data && data.totalPages) {
            setMaxPage(data.totalPages);
        }
    }, [page, data]);

    if (status === "loading")
        return <p className={"text-center"}>Chargement en cours...</p>;
    else if (status === "error") {
        return <p>Something went wrong: {error}</p>;
    }

    return render(
        data.results,
        <PaginationControl page={page} maxPage={maxPage} setPage={setPage} />
    );
};

export const PaginationControl = ({ page, maxPage, setPage }) => {
    if (maxPage === 1) {
        return null;
    }

    return (
        <BoostrapPagination>
            <BoostrapPagination.First
                disabled={page === 1}
                onClick={() => setPage(1)}
            />
            <BoostrapPagination.Prev
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            />
            {/*<BoostrapPagination.Ellipsis />*/}
            {Array.from({ length: maxPage }, (_, index) => index + 1).map(i => (
                <BoostrapPagination.Item
                    onClick={() => setPage(i)}
                    key={i}
                    active={i === page}
                >
                    {i}
                </BoostrapPagination.Item>
            ))}
            <BoostrapPagination.Next
                disabled={page === maxPage}
                onClick={() => setPage(page + 1)}
            />
            <BoostrapPagination.Last
                disabled={page === maxPage}
                onClick={() => setPage(maxPage)}
            />
        </BoostrapPagination>
    );
};
