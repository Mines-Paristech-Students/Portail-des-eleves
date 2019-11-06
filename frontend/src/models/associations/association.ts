import {Marketplace} from "./marketplace";
import {Library} from "./library";
import {Page} from "./page";

export class Association {
    id: string;
    name: string;
    logo: string;
    rank: string;

    pages: [Page];
    marketplace: Marketplace;
    library: Library;
    my_role: string;
}