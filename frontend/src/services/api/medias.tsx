import { Media } from "../../models/associations/media";
import {
    apiService,
    PaginatedResponse,
    unwrap,
} from "../apiService";
import { toUrlParams } from "../urlParam";

export const medias = {
    list: (associationId, params = {}, page = 1) =>
        unwrap<PaginatedResponse<Media[]>>(
            apiService.get(
                `/associations/media/${toUrlParams({
                    ...params,
                    association: associationId,
                    page: page,
                })}`
            )
        ),
    get: (fileId) =>
        unwrap<Media>(apiService.get(`/associations/media/${fileId}`)).then(
            (media) => ({
                ...media,
                uploadedOn: new Date(media.uploadedOn),
            })
        ),
    patch: (file) =>
        unwrap<Media>(
            apiService.patch(`/associations/media/${file.id}/`, file)
        ),
    upload: (file, association, onUploadProgress) => {
        let formData = new FormData();
        formData.append("name", file.name);
        formData.append("file", file);
        formData.append("association", association.id);

        // We don't unwrap here because be need to access all of the axios
        // object in the render logic to display progress
        return apiService.post(`/associations/media/`, formData, {
            onUploadProgress: onUploadProgress,
        });
    },
    delete: (file) =>
        apiService.delete(`/associations/media/${file.id}`, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};
