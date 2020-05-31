import { Poll } from "../../models/polls";
import { AxiosResponse } from "axios";
import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";

/**
 * Parse the `publicationDate` and `creationDateTime` JSON field.
 *
 * Should be called in a `then` after an `unwrap<PaginatedResponse<Poll[]>>`.
 */
const parseDates = (response: AxiosResponse<PaginatedResponse<Poll[]>>) => {
    response.data.results.forEach((poll) => {
        poll.creationDateTime = new Date(poll.creationDateTime);
        poll.publicationDate = poll.publicationDate
            ? new Date(poll.publicationDate)
            : undefined;
    });

    return response;
};

export type ListPollsApiParameters = {
    user?: string;
    state?: "ACCEPTED" | "REJECTED" | "REVIEWING"[];
    ordering?: string;
    is_active?: boolean;
    is_published?: boolean;
    page?: number;
    page_size?: number;
};

const list = (parameters: ListPollsApiParameters, page = 1) =>
    unwrap<PaginatedResponse<Poll[]>>(
        apiService
            .get<PaginatedResponse<Poll[]>>(
                `/polls/${toUrlParams({ ...parameters, page: page })}`
            )
            .then(parseDates)
    );

export const polls = {
    list: list,
    /**
     * List the polls which are still open (to which people can vote).
     */
    listCurrent: (page = 1) =>
        list({
            is_active: true,
            page: page,
        }),
    /**
     * List the polls which are now closed (but were published before).
     */
    listOld: (page = 1) =>
        list({
            is_active: false,
            is_published: true,
            page: page,
        }),
    get: (pollId) => unwrap<Poll>(apiService.get(`/polls/${pollId}/`)),
    create: ({
        data,
    }: {
        data: { question: string; choices: { text: string }[] };
    }) => apiService.post("/polls/", data),
    update: ({
        pollId,
        data,
    }: {
        pollId;
        data: {
            publicationDate?: string | Date;
            state?: "REVIEWING" | "REJECTED" | "ACCEPTED";
            admin_comment?: string;
            question?: string;
            choices?: { text: string }[];
        };
    }) => {
        // Format the date.
        if (data.publicationDate && typeof data.publicationDate !== "string") {
            data.publicationDate = `${data.publicationDate.getFullYear()}-${
                data.publicationDate.getMonth() + 1
            }-${data.publicationDate.getDate()}`;
        }

        return apiService.patch(`/polls/${pollId}/`, data);
    },
    remove: ({ pollId }) => apiService.delete(`/polls/${pollId}/`),
    vote: ({ user, pollId, choiceId }) =>
        apiService.post(`/polls/${pollId}/vote/`, {
            user: user.id,
            choice: choiceId,
        }),
};
