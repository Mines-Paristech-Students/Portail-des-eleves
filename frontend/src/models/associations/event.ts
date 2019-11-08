import { Association } from "./association";
import { User } from "../user";

export interface Event {
    association: Association;
    name: string;
    description: string;
    participants: User[];
    startsAt: Date;
    endsAt: Date;
    place: string;
}
