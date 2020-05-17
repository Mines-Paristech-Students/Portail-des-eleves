import { apiService, unwrap } from "../apiService";
import { Profile } from "../../models/profile";

export const profile = {
    get: ({ userId }: { userId: string }) =>
        unwrap<Profile>(apiService.get(`/users/users/${userId}`)).then(
            (profile) => {
                profile.birthday = new Date(profile.birthday);
                return profile;
            }
        ),
};
