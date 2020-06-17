export enum PollState {
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
  Reviewing = "REVIEWING",
}

export interface Poll {
  id: string;
  question: string;
  user?: string;
  creationDateTime: Date;
  state: PollState;
  publicationDate?: Date;
  adminComment?: string;
  hasBeenPublished: boolean;
  isActive: boolean;
  userHasVoted?: boolean;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  numberOfVotes?: number;
}
