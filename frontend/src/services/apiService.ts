import Axios, { AxiosResponse } from "axios";
import applyConverters from "axios-case-converter";
import { Association } from "../models/associations/association";
import { Page } from "../models/associations/page";

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
        list: ({ associationId }) =>
            unwrap<Page[]>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=STATIC`
                )
            ),
        get: ({ pageId }) =>
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
        list: ({ associationId }) =>
            unwrap<Page[]>(
                apiService.get(
                    `/associations/pages/?association=${associationId}&page_type=NEWS`
                )
            ),
        get: ({ newsId }) =>
            unwrap<Page>(apiService.get(`/associations/pages/${newsId}`))
    },
    associations: {
        list: () =>
            unwrap<Association[]>(
                apiService.get(`/associations/associations/`)
            ),
        get: ({ associationId }) =>
            unwrap<Association>(
                apiService.get(`/associations/associations/${associationId}`)
            )
    }
};
