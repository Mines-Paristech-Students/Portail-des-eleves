import { User } from "./user";

export enum PollState {
    Accepted = "ACCEPTED",
    Rejected = "REJECTED",
    Reviewing = "REVIEWING"
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
    choices: Choice[];
}

export interface Poll2 {
    id: string;
    choices: Choice[];
    question: string;
    state: PollState;
    publicationDate: Date;
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
