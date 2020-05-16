import Axios, { AxiosResponse } from "axios";
import applyConverters from "axios-case-converter";
import {
    PaginatedQueryResult,
    QueryResult,
    usePaginatedQuery,
    useQuery,
} from "react-query";
import { pages } from "./api/pages";
import { news } from "./api/news";
import { medias } from "./api/medias";
import { transactions } from "./api/transactions";
import { marketplace } from "./api/marketplace";
import { products } from "./api/products";
import { polls } from "./api/polls";
import { associations } from "./api/associations";
import { jwt } from "./api/jwt";

const baseApi = "http://localhost:8000/api/v1";

export type PaginatedResponse<T> = {
    count: number;
    next: string;
    previous: string;
    results: T;
};

export const apiService = applyConverters(
    Axios.create({
        withCredentials: true,
        baseURL: baseApi,
    })
);

/**
 * Add a callback function to the promise, called on success, which returns the `data` of the `AxiosResponse`.
 */
export function unwrap<T>(promise): Promise<T> {
    return promise.then((response: AxiosResponse<T>) => {
        return response.data;
    });
}

export const api = {
    associations: associations,
    marketplace: marketplace,
    medias: medias,
    news: news,
    pages: pages,
    products: products,
    transactions: transactions,
    polls: polls,
    jwt: jwt
};

/**
 * The same as [`useQuery`](https://github.com/tannerlinsley/react-query), but remove the first element of `key` before passing it to `fetchFunction`.
 *
 * This function should be used for non-mutating queries (such as `GET`). Otherwise, use `useMutation`.
 *
 * Example:
 *
 * ```
 * // Somewhere in `components/`.
 *
 * const { status, data, error } = useBetterQuery(
 *     ["polls", 1],
 *     api.polls.get,
 *     { refetchOnWindowFocus: false }
 * )
 *
 * if (status === "loading") {
 *     ...
 * } else if (status === "error") {
 *     ...
 * } else if (status === "success" && data) {
 *     ...
 * }
 *
 * // Somewhere in `services/api/`.
 *
 * api.polls = {
 *     get: id => apiService.get(...)
 * }
 * ```
 *
 * @param key The request key. Should be a non-empty array which first element is a string. Because of the behaviour of `useQuery`, if any element of this array is falsy, then `fetchFunction` will never be called.
 * @param fetchFunction The function to call. It will be given the elements of `key` (except its first) as arguments.
 * @param config An optional object to configure `useQuery`.
 * @return an object `{ status, data, error }`.
 */
export function useBetterQuery<T>(
    key: any[],
    fetchFunction: (...params: any) => any,
    config?: any
): QueryResult<T> {
    return useQuery<T, any, any>(
        key,
        (_, ...params) => fetchFunction(...params),
        config
    );
}

/**
 * The same as [`usePaginatedQuery`](https://github.com/tannerlinsley/react-query), but remove the first element of `key` before passing it to `fetchFunction`.
 *
 * This function should be used for non-mutating queries (such as `GET`). Otherwise, use `useBetterMutation`.
 * Also, it should not be used directly but in a `Pagination` component.
 *
 * @param key The request key. Should be a non-empty array which first element is a string. Because of the behaviour of `usePaginatedQuery`, if any element of this array is falsy, then `fetchFunction` will never be called.
 * @param fetchFunction The function to call. It will be given the elements of `key` (except its first) as arguments.
 * @param config An optional object to configure `usePaginatedQuery`.
 * @return an object `{ status, data, error }`.
 */
export function useBetterPaginatedQuery<T>(
    key: any[],
    fetchFunction: (...params: any) => any,
    config?: any
): PaginatedQueryResult<T> {
    return usePaginatedQuery<T, any, any>(
        key,
        (_, ...params) => fetchFunction(...params),
        config
    );
}
