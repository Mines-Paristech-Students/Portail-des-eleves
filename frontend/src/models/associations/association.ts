import { Marketplace } from "./marketplace";
import { Library } from "./library";
import { Page } from "./page";
import { Role } from "./role";

export interface Association {
    id: string;
    name: string;
    logo: string;
    rank: string;
    pages: Page[];
    marketplace: Marketplace;
    library: Library;
    myRole: Role;
}
