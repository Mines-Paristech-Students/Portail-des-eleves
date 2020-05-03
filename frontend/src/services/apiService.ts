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
import { tags } from "./api/tags";
import { namespaces } from "./api/namespaces";

const baseApi = "http://localhost:8000/api/v1";

export const apiService = applyConverters(
    Axios.create({
        withCredentials: true,
        baseURL: baseApi,
    })
);

export function unwrap<T>(promise): Promise<T> {
    return promise.then((response: AxiosResponse<T>) => {
        return response.data;
    });
}

export function toUrlParams(obj: object): string {
    let params = "?";
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (params.length !== 1) {
                params += "&";
            }
            params += `${key}=${obj[key]}`;
        }
    }

    return params;
}

export const api = {
    associations: associations,
    pages: pages,
    news: news,
    medias: medias,
    marketplace: marketplace,
    products: products,
    transactions: transactions,

    polls: polls,

    tags: tags,
    namespaces: namespaces,
};

/**
 * Return the result of `fetchFunction` or a cached result if available.
 * @param key
 * @param fetchFunction
 * @param useQueryConfig the parameters passed to `useQuery`.
 * @param params the parameters passed to `fetchFunction`.
 */
export function useBetterQuery<T>(
    key: string,
    fetchFunction: any,
    params?: any[],
    useQueryConfig?: object
): QueryResult<T> {
    return useQuery<T, string, any>(
        key,
        params,
        (_, ...rest) => fetchFunction(...rest),
        useQueryConfig
    );
}

export type PaginatedResponse<T> = {
    count: number;
    next: string;
    previous: string;
    results: T;
};

/**
 * Same as useBetterQuery but deals with  paginated responses
 */
export function useBetterPaginatedQuery(
    key: string,
    fetchFunction: any,
    params?: any[],
    useQueryConfig?: object
): PaginatedQueryResult<any> {
    return usePaginatedQuery<any, [string, any]>(
        [key, params],
        (_, rest) => {
            return fetchFunction(...rest);
        },
        useQueryConfig
    );
}
