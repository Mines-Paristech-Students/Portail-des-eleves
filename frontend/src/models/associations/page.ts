import {Tag} from "../tags/tag";
import {User} from "../authentication/user";
import {Association} from "./association";

enum PageType {
    News = "NEWS",
    Static = "STATIC"
}

export class Page {
    id: string;
    authors: [User];
    creation_date: Date;
    last_update_date: Date;
    tags: [Tag];
    association: Association;
    title: string;
    text: string;
    pageType: PageType;
}