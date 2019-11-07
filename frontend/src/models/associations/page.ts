import {Tag} from "../tags/tag";
import {User} from "../authentication/user";
import {Association} from "./association";

export enum PageType {
    News = "NEWS",
    Static = "STATIC"
}

export interface Page {
     id: string,
     authors: User[],
     creationDate: Date,
     lastUpdateDate: Date,
     tags: Tag[],
     association: Association,
     title: string,
     text: string,
     pageType: PageType
}
