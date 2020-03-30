import Axios, { AxiosResponse } from "axios";
import applyConverters from "axios-case-converter";
import { Association } from "../models/associations/association";
import { Page } from "../models/associations/page";
import { Media } from "../models/associations/media";
import { useEffect, useState } from "react";

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
        list: (_, associationId) =>
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
        get: (key: string, associationId) => {

            return unwrap<Association>(
                apiService.get(`/associations/associations/${associationId}`)
            )
        }
    },
    medias: {
        list: (associationId) =>
            unwrap<Media[]>(
                apiService.get(
                    `/associations/media/?association=${associationId}`
                )
            ),
        get: ({ fileId }) =>
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
    }
};

export function useDataApi<T>(apiMethod, ...args): {data: T | null, isLoading: boolean, error: Error | null} {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    console.log(args);
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const result = await apiMethod(...args);
                setData(result.data);
            } catch (error) {
                setError(error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);
    return { data, isLoading, error };
};
