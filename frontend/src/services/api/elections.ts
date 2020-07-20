import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";
import { Election } from "../../models/associations/election";

export const elections = {
  list: (associationId, params = {}, page = 1) =>
    unwrap<PaginatedResponse<Election[]>>(
      apiService.get(
        `/associations/elections/${toUrlParams({
          ...params,
          association: associationId,
          page: page,
        })}`
      )
    ).then((response) => ({
      ...response,
      results: response.results.map((election) => ({
        ...election,
        startsAt: election.startsAt && new Date(election.startsAt),
        endsAt: election.endsAt && new Date(election.endsAt),
      })),
    })),

  get: (electionId) =>
    unwrap<Election>(
      apiService.get(`/associations/elections/${electionId}`)
    ).then((election) => ({
      ...election,
      startsAt: election.startsAt && new Date(election.startsAt),
      endsAt: election.endsAt && new Date(election.endsAt),
    })),

  vote: (electionId, choices) =>
    unwrap<{ choices: string }[]>(
      apiService.put(`/associations/elections/${electionId}/vote/`, {
        choices: choices.map((choice) => choice.id),
      })
    ),

  create: (election) =>
    unwrap<Election>(apiService.post(`/associations/elections/`, election)),

  update: (election) =>
    unwrap<Election>(
      apiService.patch(`/associations/elections/${election.id}/`, election)
    ),

  delete: (election) =>
    unwrap<Election>(
      apiService.delete(`/associations/elections/${election.id}/`)
    ),
};
