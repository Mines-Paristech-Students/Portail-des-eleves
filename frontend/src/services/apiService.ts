import Axios, { AxiosResponse } from "axios";
import applyConverters from "axios-case-converter";
import { Association } from "../models/associations/association";
import { Page } from "../models/associations/page";
import { Marketplace, Transaction } from "../models/associations/marketplace";
import { Media } from "../models/associations/media";
import { QueryResult, useQuery } from "react-query";
import { Choice, Poll } from "../models/polls";

const baseApi = "http://localhost:8000/api/v1";

export const apiService = applyConverters(
    Axios.create({
        withCredentials: true,
        baseURL: baseApi
    })
);

function unwrap<T>(promise) {
    return promise.then((response: AxiosResponse<T>) => {
        return response.data;
    });
}

export const api = {
    pages: {
        list: associationId =>
            unwrap<Page[]>(
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
            unwrap<Page[]>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=NEWS`
                )
            ),
        get: newsId =>
            unwrap<Page>(apiService.get(`/associations/pages/${newsId}`))
    },
    associations: {
        list: () =>
            unwrap<Association[]>(
                apiService.get(`/associations/associations/`)
            ),
        get: associationId =>
            unwrap<Association>(
                apiService.get(`/associations/associations/${associationId}`)
            )
    },
    medias: {
        list: associationId =>
            unwrap<Media[]>(
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
        list: associationId =>
            unwrap<Page[]>(
                apiService.get(
                    `/associations/products/?association=${associationId}`
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

        get: (marketplaceId, user) =>
            unwrap<Transaction[]>(
                apiService.get(
                    `associations/transactions/?marketplace=${marketplaceId}&buyer=${user.id}`
                )
            )
    },

    polls: {
        list: () => unwrap<Poll[]>(apiService.get("/polls/")),
        get: pollId => unwrap<Poll>(apiService.get(`/polls/${pollId}/`)),
        create: (question: string, choices: Choice[]) =>
            unwrap<Poll>(
                apiService.post("/polls/", {
                    question: question,
                    choices: choices.map(choice => ({
                        text: choice.text
                    }))
                })
            )
    }
};

/**
 * Return the result of `fetchFunction` or a cached result if available.
 * @param key
 * @param fetchFunction
 * @param params
 */
export function useBetterQuery<T>(
    key: string,
    fetchFunction: any,
    ...params: any[]
): QueryResult<T> {
    return useQuery<T, string, any>(key, params, (key, ...params) =>
        fetchFunction(...params)
    );
}
