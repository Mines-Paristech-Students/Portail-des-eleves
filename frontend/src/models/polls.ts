import { User } from "./user";

export enum PollState {
    Accepted = "ACCEPTED",
    Rejected = "REJECTED",
    Reviewing = "REVIEWING"
}

export interface Poll {
    // TODO: a field `author` is missing for the administrative part (but not public!).
    id: string;
    choices: Choice[];
    question: string;
    state: PollState;
    creationDateTime: Date;
    publicationDate: Date;
    adminComment: string;
    isActive: boolean;
}

export interface Choice {
    id: string;
    text: string;
    numberOfVotes?: number;
}

export interface Vote {
    user: User;
    choice: Choice;
    poll: Poll;
}
