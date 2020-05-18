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
        };
    }) => {
        return apiService.patch(`/users/users/${userId}/`, data);
    },
    /**
     * Update the profile answers.
     * @param userId the user ID.
     * @param initialAnswers the initial profile answers.
     * @param data the profile answers which should be saved.
     */
    updateAnswers: ({
        userId,
        initialAnswers,
        data,
    }: {
        userId;
        initialAnswers: ProfileAnswer[];
        data: {
            [property: string]: any;
        };
    }) => {
        let processedQuestionIds = new Set<number>();
        let promises: Promise<AxiosResponse<any>>[] = [];

        // Treat the initial answers.
        initialAnswers.forEach(({ id, questionId, text: initialAnswer }) => {
            const propertyName = `question-${questionId}`;

            if (
                !data.hasOwnProperty(propertyName) ||
                data[propertyName] === ""
            ) {
                // Delete the questions which were not provided or are empty.
                promises.push(
                    apiService.delete(`/users/profile_answer/${id}/`)
                );
            } else {
                // Update the initialAnswers which have changed.
                if (initialAnswer !== data[propertyName]) {
                    promises.push(
                        apiService.patch(`/users/profile_answer/${id}/`, {
                            text: data[propertyName],
                        })
                    );
                }
            }

            processedQuestionIds.add(questionId);
        });

        console.log(processedQuestionIds);

        // The remaining answers in `data` should be posted.
        Object.getOwnPropertyNames(data).forEach((propertyName) => {
            // Get the question ID.
            const questionId = Number(
                propertyName.slice(propertyName.lastIndexOf("-") + 1)
            );

            // Only treat the question if it was not treated before.
            if (
                !Number.isNaN(questionId) &&
                !processedQuestionIds.has(questionId)
            ) {
                console.log(questionId);
                promises.push(
                    apiService.post(`/users/profile_answer/`, {
                        question: questionId,
                        user: userId,
                        text: data[propertyName],
                    })
                );
            }
        });

        return Promise.all(promises);
    },
};
