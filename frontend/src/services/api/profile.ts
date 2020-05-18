import { apiService, unwrap } from "../apiService";
import { Profile } from "../../models/profile";
import { parseRoleDates } from "./roles";

export const profile = {
    get: ({ userId }: { userId: string }) =>
        unwrap<Profile>(apiService.get(`/users/users/${userId}`)).then(
            (profile) => {
                profile.birthday = new Date(profile.birthday);
                profile.roles.forEach((role) => parseRoleDates(role));
                return profile;
            }
        ),
};
