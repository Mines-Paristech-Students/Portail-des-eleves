import {Tag} from "../tags/tag";
import {User} from "../authentication/user";
import {Association} from "./association";

export enum PageType {
    News = "NEWS",
    Static = "STATIC"
}

export class Page {
    constructor(public id: string,
                public authors: User[],
                public creationDate: Date,
                public lastUpdateDate: Date,
                public tags: Tag[],
                public association: Association,
                public title: string,
                public text: string,
                public pageType: PageType) {

    }
}
