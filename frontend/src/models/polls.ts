import {User} from "./user";

export enum PollState {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    REVIEWING = "REVIEWING"
}

export interface Poll {
    id: string;
    choices: Choice[];
    question: string;
    state: PollState;
    creation_date_time: Date;
    publication_date: Date;
    admin_comment: string;
}

export interface Choice {
    id: string;
    text: string;
}

export interface Vote {
    user: User;
    choice: Choice;
    poll: Poll;
}
