import { Media } from "../../models/associations/media";
import { apiService, PaginatedResponse, unwrap } from "../apiService";

export const medias = {
    list: (associationId) =>
        unwrap<PaginatedResponse<Media[]>>(
            apiService.get(`/associations/media/?association=${associationId}`)
        ),
    get: (fileId) =>
        unwrap<Media>(apiService.get(`/associations/media/${fileId}`)),
    patch: (file) => {
        return unwrap<Media>(
            apiService.patch(`/associations/media/${file.id}/`, file, {
                headers: { "Content-Type": "multipart/form-data" },
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
            onUploadProgress: onUploadProgress,
        });
    },
    delete: (file) => {
        return apiService.delete(`/associations/media/${file.id}`, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
