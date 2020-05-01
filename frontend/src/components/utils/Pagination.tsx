import React, { useEffect, useState } from "react";
import { useBetterPaginatedQuery } from "../../services/apiService";
import { Pagination as BoostrapPagination } from "react-bootstrap";

/**
 * Pagination is a component that handles the pagination on the API level + the
 * rendering of the page bar for you.
 *
 * To use it, simply do
 * <Pagination
        apiKey={"associations.list"}
        apiMethod={api.associations.list}
        apiParams={[]}
        render={(associations, paginationControl) => (
            <>
                // your JSX ...
                {paginationControl} // the pagination control
            </>
        )}
   />
 *
 * @param render a closure that takes the a list of instances and the pagination
 * control bar as parameters
 * @param apiKey same api key as in `useBetterPaginatedQuery`
 * @param apiMethod same method as in `useBetterPaginatedQuery`
 * @param apiParams parameters given to the apiMethod on query.
 */
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

/**
 * PaginationControl  is a JSX component that will render the `pagination`
 * Bootstrap component. It'll display a list of the reachable pages and will
 * update the page in the parent when clicked.
 *
 * This component is only used internally by the `Pagination` component.
 */
const PaginationControl = ({ page, maxPage, setPage }) => {
    if (maxPage === 1) {
        return null;
    }

    let minProposedPage = Math.max(1, page - 2);
    let maxProposedPage = Math.min(maxPage + 1, minProposedPage + 5);
    minProposedPage = Math.max(1, maxProposedPage - 5);

    minProposedPage = Math.max(2, minProposedPage);
    maxProposedPage = Math.min(maxPage, maxProposedPage);

    return (
        <BoostrapPagination>
            <BoostrapPagination.Prev
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            />
            <BoostrapPagination.Item
                onClick={() => setPage(1)}
                key={1}
                active={1 === page}
            >
                1
            </BoostrapPagination.Item>
            {minProposedPage > 2 ? (
                <BoostrapPagination.Ellipsis disabled />
            ) : null}
            {Array.from(
                { length: maxProposedPage - minProposedPage },
                (_, index) => index + minProposedPage
            ).map(i => (
                <BoostrapPagination.Item
                    onClick={() => setPage(i)}
                    key={i}
                    active={i === page}
                >
                    {i}
                </BoostrapPagination.Item>
            ))}
            {maxProposedPage < maxPage ? (
                <BoostrapPagination.Ellipsis disabled />
            ) : null}
            <BoostrapPagination.Item
                onClick={() => setPage(maxPage)}
                key={maxPage}
                active={maxPage === page}
            >
                {maxPage}
            </BoostrapPagination.Item>
            <BoostrapPagination.Next
                disabled={page === maxPage}
                onClick={() => setPage(page + 1)}
            />
        </BoostrapPagination>
    );
};
