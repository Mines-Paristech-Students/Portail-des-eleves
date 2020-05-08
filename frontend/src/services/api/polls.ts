import { Poll } from "../../models/polls";
import { AxiosResponse } from "axios";
import { apiService, unwrap } from "../apiService";

export const polls = {
    list: () =>
        unwrap<Poll[]>(
            apiService
                .get<Poll[]>("/polls/")
                .then((response: AxiosResponse<Poll[]>) => {
                    // Parse the date (because it's not a datetime).
                    response.data.forEach(
                        (poll) =>
                            (poll.publicationDate = poll.publicationDate
                                ? new Date(poll.publicationDate)
                                : undefined)
                    );

                    return response;
                })
        ),
    get: (pollId) => unwrap<Poll>(apiService.get(`/polls/${pollId}/`)),
    create: (data: { question: string; choice0: string; choice1: string }) =>
        apiService.post("/polls/", {
            question: data.question,
            choices: [{ text: data.choice0 }, { text: data.choice1 }],
        }),
    update: (
        pollId,
        data: {
            publicationDate?: string | Date;
            state?: "REVIEWING" | "REJECTED" | "ACCEPTED";
            admin_comment?: String;
            question?: String;
            choices?: { text: string }[];
        }
    ) => {
        // Format the date.
        if (data.publicationDate && typeof data.publicationDate !== "string") {
            data.publicationDate = `${data.publicationDate.getFullYear()}-${
                data.publicationDate.getMonth() + 1
            }-${data.publicationDate.getDate()}`;
        }

        return apiService.patch(`/polls/${pollId}/`, data);
    },

    delete: (pollId) => apiService.delete(`/polls/${pollId}/`),
    vote: (user, pollId, choiceId) =>
        apiService.post(`/polls/${pollId}/vote/`, {
            user: user.id,
            choice: choiceId,
        }),
};
