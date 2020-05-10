import { Poll } from "../../models/polls";
import { AxiosResponse } from "axios";
import { apiService, PaginatedResponse, unwrap } from "../apiService";

/**
 * Parse the `publicationDate` and `creationDateTime` JSON field.
 *
 * Should be called in a `then` after an `apiService.get("/polls/...")`.
 */
const parseDates = (response: AxiosResponse<PaginatedResponse<Poll[]>>) => {
    response.data.results.forEach(poll => {
        poll.creationDateTime = new Date(poll.creationDateTime);
        poll.publicationDate = poll.publicationDate
            ? new Date(poll.publicationDate)
            : undefined;
    });

    return response;
};

const listGeneric = (parameters: string = "") => (page = 1) =>
    unwrap<PaginatedResponse<Poll[]>>(
        apiService
            .get<PaginatedResponse<Poll[]>>(
                `/polls/?page=${page}${
                    parameters === undefined ? "" : "&"
                }${parameters}`
            )
            .then(parseDates)
    );

export const polls = {
    /**
     * List all the polls.
     */
    listAll: listGeneric("page_size=10"),
    /**
     * List the polls which are still open (to which people can vote).
     */
    listCurrent: listGeneric("is_active=true"),
    /**
     * List the polls which are now closed (but were published before).
     */
    listOld: listGeneric("is_published=true&is_active=false"),
    get: pollId => unwrap<Poll>(apiService.get(`/polls/${pollId}/`)),
    create: ({
        data
    }: {
        data: { question: string; choices: { text: string }[] };
    }) => apiService.post("/polls/", data),
    update: ({
        pollId,
        data
    }: {
        pollId;
        data: {
            publicationDate?: string | Date;
            state?: "REVIEWING" | "REJECTED" | "ACCEPTED";
            admin_comment?: String;
            question?: String;
            choices?: { text: string }[];
        };
    }) => {
        // Format the date.
        if (data.publicationDate && typeof data.publicationDate !== "string") {
            data.publicationDate = `${data.publicationDate.getFullYear()}-${data.publicationDate.getMonth() +
                1}-${data.publicationDate.getDate()}`;
        }

        return apiService.patch(`/polls/${pollId}/`, data);
    },
    remove: ({ pollId }) => apiService.delete(`/polls/${pollId}/`),
    vote: ({ user, pollId, choiceId }) =>
        apiService.post(`/polls/${pollId}/vote/`, {
            user: user.id,
            choice: choiceId
        })
};
