import { Poll } from "../../models/polls";
import { AxiosResponse } from "axios";
import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";

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
  ordering?:
        | "question"
        | "user__pk"
        | "state"
        | "publication_date"
        | "-question"
        | "-user__pk"
        | "-state"
        | "-publication_date";
  is_active?: boolean;
  is_published?: boolean;
  page?: number;
  page_size?: number;
};

export const polls = {
  list: (parameters: ListPollsApiParameters, page = 1) =>
    unwrap<PaginatedResponse<Poll[]>>(
      apiService
        .get<PaginatedResponse<Poll[]>>(
          `/polls/${toUrlParams({ ...parameters, page: page })}`
        )
        .then(parseDates)
    ),
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
