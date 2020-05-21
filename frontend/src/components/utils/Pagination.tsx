import React, { useEffect, useState } from "react";
import { useBetterPaginatedQuery } from "../../services/apiService";
import { Pagination as BoostrapPagination } from "react-bootstrap";
import { Loading } from "./Loading";
import { Error } from "./Error";

/**
 * Pagination is a component that handles the pagination on the API level + the
 * rendering of the page bar for you.
 *
 * To use it, simply do:
 * ```
 * <Pagination
 *     apiKey={["api.products.list", marketplaceId]}
 *     apiMethod={api.products.list}
 *     render={
 *         (products, paginationControl) => (
 *         <>
 *             // your JSX...
 *             {paginationControl}
 *         </>
 *     )}
 * />
 * ```
 *
 * @param render a closure that takes the fetched data and the pagination
 * control bar as parameters.
 * @param apiKey The request key. Should be a non-empty array which first element is a string. The `page` last element required by `usePaginatedQuery` is added by the component and should not be included. Because of the behaviour of `usePaginatedQuery`, if any element of this array is falsy, then `apiMethod` will never be called.
 * @param apiMethod The function to call. It will be given the elements of `apiKey` (except its first) as arguments.
 * @param config An optional object to configure `usePaginatedQuery`.
 * @param paginationControlProps Optional props to be passed to `PaginationControl`.
 * @param loadingElement The element to display when loading.
 * @param errorElement The element to display if the request encounters an error. The error `detail` is passed to this component.
 */
export const Pagination = ({
    render,
    apiKey,
    apiMethod,
    config,
    paginationControlProps,
    loadingElement,
    errorElement,
}: {
    render: any;
    apiKey: any[];
    apiMethod: (...params: any) => any;
    config?: any;
    paginationControlProps?: object;
    loadingElement?: React.ComponentType<{}> | React.ReactNode;
    errorElement?: React.ComponentType<{ detail: any }> | React.ReactNode;
}) => {
    let [page, setPage] = useState(1);
    let [maxPage, setMaxPage] = useState(1);

    const { resolvedData: data, status, error } = useBetterPaginatedQuery<any>(
        [...apiKey, page],
        apiMethod,
        config
    );

    useEffect(() => {
        if (data && data.totalPages) {
            setMaxPage(data.totalPages);
        }
    }, [page, data]);

    if (status === "loading")
        return loadingElement === undefined ? (
            <Loading />
        ) : (
            React.createElement(loadingElement as any)
        );
    else if (status === "error") {
        if (errorElement === undefined) {
            return <Error detail={error} />;
        } else {
            return React.createElement(errorElement as any);
        }
    }

    return render(
        data.results,
        <PaginationControl
            page={page}
            maxPage={maxPage}
            setPage={setPage}
            {...paginationControlProps}
        />
    );
};

/**
 * PaginationControl  is a JSX component that will render the `pagination`
 * Bootstrap component. It'll display a list of the reachable pages and will
 * update the page in the parent when clicked.
 *
 * This component is only used internally by the `Pagination` component.
 */
const PaginationControl = ({ page, maxPage, setPage, ...props }) => {
    if (maxPage === 1) {
        return null;
    }

    let minProposedPage = Math.max(1, page - 2);
    let maxProposedPage = Math.min(maxPage + 1, minProposedPage + 5);
    minProposedPage = Math.max(1, maxProposedPage - 5);

    minProposedPage = Math.max(2, minProposedPage);
    maxProposedPage = Math.min(maxPage, maxProposedPage);

    return (
        <BoostrapPagination {...props}>
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
            ).map((i) => (
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
