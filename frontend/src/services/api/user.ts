import { apiService, unwrap } from "../apiService";
import { User } from "../../models/user/user";
import { AxiosResponse } from "axios";

/**
 * Parse the `birthday` JSON field.
 *
 * Should be called in a `then` after an `apiService.get("/users/users/...")`.
 */
const parseUser = (response: AxiosResponse<User>) => {
    response.data.birthday = new Date(response.data.birthday);

    return response;
};

export const user = {
    get: ({ userId }: { userId: string }) =>
        unwrap<User>(apiService.get(`/users/users/${userId}`).then(parseUser)),
};
