import React, { useEffect, useState } from "react";
import { useBetterPaginatedQuery } from "../../services/apiService";
import { Pagination as BoostrapPagination } from "react-bootstrap";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { useURLState } from "../../utils/useURLState";

/**
 * Pagination is a component that handles the pagination on the API level + the
 * rendering of the page for you.
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
 * @param apiParameters
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
    const [page, setPage] = useURLState("page", 1);
    const [maxPage, setMaxPage] = useState(1);

    // Before propagating a change of `apiKey`, we reset the page to 1.
    // Indeed, if the `apiKey` induces a change of the maximum available page
    // (e.g. if `apiKey` contains a filter), we don't want the “old” page prop
    // to exceed this maximum.
    // However, changing the page may trigger a rerendering of the component
    // using `Pagination`, which, in turn, may change the `apiKey` prop, losing the
    // initial key. Hence we save this “initial” key in `temporizedApiKey`.
    const [temporizedApiKey, setTemporizedApiKey] = useState<any[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    useEffect(() => {
        setTemporizedApiKey(apiKey);

        // Don't change the page the first time the component is updated
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        setPage(1);
        // Use stringify because an object isn't equal to itself in JS
        // We want to trigger an action only when the apiKey (most of
        // the time additional search  fields) are changed, and don't depend
        // on other variables, hence :
        // eslint-disable-next-line
    }, [JSON.stringify(apiKey)]);

    const { resolvedData: data, status, error } = useBetterPaginatedQuery<any>(
        [...temporizedApiKey, page],
        apiMethod,
        config
    );

    // When we change the query params there may be a different number of
    // results. Thus we need when the key change, to reset the page to 1.
    // However we shouldn't do it before the key is initialized, hence the
    // prevApiKey !== ""
    const [prevApiKey, setPrevApiKey] = useState("");
    useEffect(() => {
        const apiKeyJSON = JSON.stringify(apiKey);
        if (apiKeyJSON !== prevApiKey) {
            if (prevApiKey !== "") {
                setPage(1);
            }
            setPrevApiKey(apiKeyJSON);
        }
    }, [apiKey, prevApiKey, setPrevApiKey, setPage]);

    useEffect(() => {
        if (data && data.totalPages) {
            setMaxPage(data.totalPages);
        }
        // eslint-disable-next-line
    }, [page, data]);

    if (status === "loading")
        return loadingElement === undefined ? (
            <Loading />
        ) : (
            React.createElement(loadingElement as any)
        );
    else if (status === "error") {
        return errorElement === undefined ? (
            <Error detail={error} />
        ) : (
            React.createElement(errorElement as any)
        );
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
