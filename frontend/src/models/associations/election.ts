import { User } from "../user";
import { Association } from "./association";

export interface Choice {
    id: number;
    name: string;
    election: Election | number;
}

export interface Result {
    id: string;
    result: string;
    numberOfVoters: string;
    numberOfRegistered: string;
}

export interface Ballot {
    id?: string;
    election: Election;
    choices: Choice[] | number[];
}

export interface Election {
    id?: string;
    association: Association;
    name: string;
    choices: Choice[] | Object[];
    registeredVoters: User[] | string[];
    startsAt: Date;
    endsAt: Date;
    maxChoicesPerBallot: number;
    hasVoted?: boolean;
    isRegistered?: boolean;
}
