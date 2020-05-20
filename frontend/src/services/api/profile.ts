import { apiService, unwrap } from "../apiService";
import { Profile, ProfileAnswer, ProfileQuestion } from "../../models/profile";
import { parseRoleDates } from "./roles";
import { AxiosResponse } from "axios";

export const profile = {
    get: ({ userId }: { userId: string }) =>
        unwrap<Profile>(apiService.get(`/users/users/${userId}`)).then(
            (profile) => {
                profile.birthday = new Date(profile.birthday);
                profile.roles.forEach((role) => parseRoleDates(role));
                return profile;
            }
        ),
    getQuestions: () =>
        unwrap<ProfileQuestion[]>(apiService.get("/users/profile_question")),
    updateGlobal: ({
        userId,
        data,
    }: {
        userId;
        data: {
            nickname?: string;
            phone?: string;
            room?: string;
            cityOfOrigin?: string;
            option?: string;
            currentAcademicYear?: "1A" | "2A" | "GAP YEAR" | "3A" | "GRADUATE";
            minesparent?: string[];
            roommate?: string[];
            profileAnswers?: {
                question: number;
                text: string;
            }[];
        };
    }) => {
        console.log(data);
        return apiService.patch(`/users/users/${userId}/`, data);
    },
};
