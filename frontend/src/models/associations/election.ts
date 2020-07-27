import { User } from "../user";
import { Association } from "./association";

export interface Choice {
  id: number;
  name: string;
  numberOfOfflineVotes: number;
  numberOfOnlineVotes: number;
  numberOfVotes: number;
}

type VoteStatus = "PENDING" | "OFFLINE_VOTE" | "ONLINE_VOTE";
export interface UserVoter {
  id: number;
  user: User;
  status: VoteStatus;
  election: 5;
}

export interface Election {
  id: string;
  association: Association;
  name: string;
  startsAt: Date;
  endsAt: Date;
  maxChoicesPerBallot: number;
  resultsArePublished: boolean;
  showResults: boolean;
  choices: Choice[];
  voters?: { user: User; status: VoteStatus }[];
  userVoter?: UserVoter;
}
