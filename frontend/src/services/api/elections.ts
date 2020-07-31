import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";
import { Choice, Election, Voter } from "../../models/associations/election";

const voters = {
  add: (election, userId) =>
    apiService.post(`/associations/voters/`, {
      election: election.id,
      user: userId,
    }),

  remove: (election, userId) =>
    apiService.delete(
      `/associations/voters/destroy_from_user_and_election/${toUrlParams({
        election: election.id,
        user: userId,
      })}`
    ),

  list: (params = {}) =>
    unwrap(apiService.get(`/associations/voters/${toUrlParams(params)}`)),

  update: (voter) =>
    unwrap<Voter>(apiService.patch(`/associations/voters/${voter.id}/`, voter)),
};

const choices = {
  update: (choice) =>
    unwrap<Choice>(
      apiService.patch(`/associations/choices/${choice.id}/`, choice)
    ),
};

export const elections = {
  voters: voters,
  choices: choices,

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
