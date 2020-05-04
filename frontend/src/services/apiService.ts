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
    useQuery
} from "react-query";

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
        baseURL: baseApi
    })
);

function unwrap<T>(promise): Promise<T> {
    return promise.then((response: AxiosResponse<T>) => {
        return response.data;
    });
}

export const api = {
    pages: {
        list: associationId =>
            unwrap<PaginatedResponse<Page[]>>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=STATIC`
                )
            ),
        get: pageId =>
            unwrap<Page>(apiService.get(`/associations/pages/${pageId}`)),
        save: page => {
            if (!page.id) {
                return unwrap<Page>(
                    apiService.post(`/associations/pages/`, page)
                );
            }

            return unwrap<Page>(
                apiService.patch(`/associations/pages/${page.id}/`, page)
            );
        },
        delete: page => {
            return unwrap<Page>(
                apiService.delete(`/associations/pages/${page.id}/`)
            );
        }
    },
    news: {
        list: associationId =>
            unwrap<PaginatedResponse<Page[]>>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=NEWS`
                )
            ),
        get: newsId =>
            unwrap<Page>(apiService.get(`/associations/pages/${newsId}`))
    },
    associations: {
        list: () =>
            unwrap<PaginatedResponse<Association[]>>(
                apiService.get(`/associations/associations/`)
            ),
        get: associationId =>
            unwrap<Association>(
                apiService.get(`/associations/associations/${associationId}`)
            )
    },
    medias: {
        list: associationId =>
            unwrap<PaginatedResponse<Media[]>>(
                apiService.get(
                    `/associations/media/?association=${associationId}`
                )
            ),
        get: fileId =>
            unwrap<Media>(apiService.get(`/associations/media/${fileId}`)),
        patch: file => {
            return unwrap<Media>(
                apiService.patch(`/associations/media/${file.id}/`, file, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            );
        },
        upload: (file, association, onUploadProgress) => {
            let formData = new FormData();
            formData.append("name", file.name);
            formData.append("file", file);
            formData.append("association", association.id);

            // We don't unwrap here because be need to access all of the axios
            // object in the render logic to display progress
            return apiService.post(`/associations/media/`, formData, {
                onUploadProgress: onUploadProgress
            });
        },
        delete: file => {
            return apiService.delete(`/associations/media/${file.id}`, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        }
    },

    marketplace: {
        get: marketplaceId =>
            unwrap<Marketplace>(
                apiService.get(`/associations/marketplace/${marketplaceId}`)
            )
    },

    products: {
        list: (associationId, page = 1) =>
            unwrap<PaginatedResponse<Page[]>>(
                apiService.get(
                    `/associations/products/?association=${associationId}&page=${page}`
                )
            )
    },

    transactions: {
        create: (product, quantity, buyer) =>
            apiService.post("/associations/transactions/", {
                product: product.id,
                quantity: quantity,
                buyer: buyer.id
            }),

        list: (marketplaceId, user) =>
            unwrap<Transaction[]>(
                apiService.get(
                    `associations/transactions/?marketplace=${marketplaceId}&buyer=${user.id}`
                )
            )
    },

    polls: {
        list: () =>
            unwrap<Poll[]>(
                apiService
                    .get<Poll[]>("/polls/")
                    .then((response: AxiosResponse<Poll[]>) => {
                        // Parse the date (because it's not a datetime).
                        response.data.forEach(
                            poll =>
                                (poll.publicationDate = poll.publicationDate
                                    ? new Date(poll.publicationDate)
                                    : undefined)
                        );

                        return response;
                    })
            ),
        get: pollId => unwrap<Poll>(apiService.get(`/polls/${pollId}/`)),
        create: (data: {
            question: string;
            choice0: string;
            choice1: string;
        }) =>
            apiService.post("/polls/", {
                question: data.question,
                choices: [{ text: data.choice0 }, { text: data.choice1 }]
            }),
        update: (
            pollId,
            data: {
                publicationDate?: string | Date;
                state?: "REVIEWING" | "REJECTED" | "ACCEPTED";
                admin_comment?: String;
                question?: String;
                choices?: { text: string }[];
            }
        ) => {
            // Format the date.
            if (
                data.publicationDate &&
                typeof data.publicationDate !== "string"
            ) {
                data.publicationDate = `${data.publicationDate.getFullYear()}-${data.publicationDate.getMonth() +
                    1}-${data.publicationDate.getDate()}`;
            }

            return apiService.patch(`/polls/${pollId}/`, data);
        },
        delete: pollId => apiService.delete(`/polls/${pollId}/`),
        vote: (user, pollId, choiceId) =>
            apiService.post(`/polls/${pollId}/vote/`, {
                user: user.id,
                choice: choiceId
            })
    }
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
    ...params: any[]
): PaginatedQueryResult<any> {
    return usePaginatedQuery<any, [string, any]>(
        [key, params],
        (_, ...rest) => {
            return fetchFunction(...rest[0]);
        }
    );
}
