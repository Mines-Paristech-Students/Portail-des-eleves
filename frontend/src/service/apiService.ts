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
    association: associationId => ({
        pages: () => ({
            list: () =>
                unwrap<Page[]>(
                    apiService.get(
                        `associations/pages/?association=${associationId}&page_type=STATIC`
                    )
                ),
            get: (pageId: string) =>
                unwrap<Page>(apiService.get(`associations/pages/${pageId}`))
        }),
        news: () => ({
            list: () =>
                unwrap<Page[]>(
                    apiService.get(
                        `associations/pages/?association=${associationId}&page_type=NEWS`
                    )
                ),
            get: (newsId: string) =>
                unwrap<Page>(apiService.get(`associations/pages/${newsId}`))
        })
    }),
    associations: {
        list: () =>
            unwrap<Association>(apiService.get(`associations/associations/`)),
        get: (associationId) =>
            unwrap<Association[]>(
                apiService.get(`associations/associations/${associationId}`)
            )
    }
};
