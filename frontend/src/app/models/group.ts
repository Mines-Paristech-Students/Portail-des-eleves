import {User} from "./user";

export class Group {

    public id: number;
    public members: [User];
    public role: string;

    public is_admin_group: boolean;
    public static_page: boolean;
    public news: boolean;
    public marketplace: boolean;
    public library: boolean;
    public vote: boolean;
    public events: boolean;

}
