import { User } from "../user";

export interface Choice {
    id: string;
    election: Election;
}

export interface Ballot {
    id: string;
    election: Election;
    choices: Choice;
}

export interface Election {
    id: string;
    association: string;
    name: string;
    choices: Choice[];
    registered_voters: User[];
    starts_at: Date;
    ends_at: Date;
    max_choices_per_ballot: string;
}
