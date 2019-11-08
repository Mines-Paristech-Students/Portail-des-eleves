import { Association } from "./association";
import { User } from "../user";

export interface Event {
    association: Association;
    name: string;
    description: string;
    participants: User[];
    starts_at: Date;
    ends_at: Date;
    place: string;
}
