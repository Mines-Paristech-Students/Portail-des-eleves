import Axios, { AxiosResponse } from "axios";
import applyConverters from "axios-case-converter";
import { Association } from "../models/associations/association";
import { Page } from "../models/associations/page";
import { Marketplace, Transaction } from "../models/associations/marketplace";
import { Media } from "../models/associations/media";
import { Poll } from "../models/polls";
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

export function unwrap<T>(promise): Promise<T> {
    return promise.then((response: AxiosResponse<T>) => {
        return response.data;
    });
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

export function useBetterPaginatedQuery(
    key: string,
    fetchFunction: any,
    params?: any[],
    useQueryConfig?: object
): PaginatedQueryResult<any> {
    return usePaginatedQuery<any, [string, any]>(
        [key, params],
        (_, ...rest) => {
            return fetchFunction(...rest[0]);
        },
        useQueryConfig
    );
}
