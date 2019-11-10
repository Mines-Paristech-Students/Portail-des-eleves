import {User} from "./user";

export enum PollState {
    Accepted = "ACCEPTED",
    Rejected = "REJECTED",
    Reviewing = "REVIEWING"
}

export interface Poll {
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
