import { User } from "../user";
import {Association} from "./association";

export interface Choice {
    id: string;
    election: Election;
}

export interface Ballot {
    id: string;
    election: Election;
    choices: Choice[];
}

export interface Election {
    id: string;
    association: Association;
    name: string;
    choices: Choice[];
    registeredVoters: User[];
    startsAt: Date;
    endsAt: Date;
    maxChoicesPerBallot: number;
}
