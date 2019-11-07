import {Marketplace} from "./marketplace";
import {Library} from "./library";
import {Page} from "./page";

export class Association {
    constructor(public id: string,
                public name: string,
                public logo: string,
                public rank: string,
                public pages: Page[],
                public marketplace: Marketplace,
                public library: Library,
                public myRole: string) {

    }
}
