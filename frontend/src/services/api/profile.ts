import { apiService, unwrap } from "../apiService";
import { Profile } from "../../models/profile";
import { AxiosResponse } from "axios";

/**
 * Parse the `birthday` JSON field.
 *
 * Should be called in a `then` after an `apiService.get("/users/users/...")`.
 */
const parseUser = (response: AxiosResponse<Profile>) => {
    response.data.birthday = new Date(response.data.birthday);

    return response;
};

export const profile = {
    get: ({ userId }: { userId: string }) =>
        unwrap<Profile>(apiService.get(`/users/users/${userId}`).then(parseUser)),
};
