import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
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
 * @param paginationProps Optional props to be passed to `PaginationControl`.
 * @param loadingElement An optional element to display when loading.
 * @param errorElement An optional element to display if the request encounters an error. The error `detail` is passed to this component.
 */
export const Pagination = ({
    render,
    apiKey,
    apiMethod,
    config,
    paginationProps,
    loadingElement,
    errorElement
}: {
    render: any;
    apiKey: any[];
    apiMethod: (...params: any) => any;
    config?: any;
    paginationProps?: object;
    loadingElement?: ReactElement;
    errorElement?: any;
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
        return loadingElement === undefined ? <Loading /> : loadingElement;
    else if (status === "error") {
        return errorElement === undefined ? (
            <Error detail={error} />
        ) : (
            errorElement({ detail: error })
        );
    }

    console.log(paginationProps);

    return render(
        data.results,
        <PaginationControl
            page={page}
            maxPage={maxPage}
            setPage={setPage}
            {...paginationProps}
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
