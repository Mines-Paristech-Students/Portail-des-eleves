import { Marketplace } from "./marketplace";
import { Library } from "./library";
import { Page } from "./page";
import { RolePermission } from "./role";

export interface Association {
    id: string;
    name: string;
    logo: string;
    rank: string;
    pages: Page[];
    marketplace: Marketplace;
    library: Library;
    myRole?: {
        id: string;
        role: string;
        rank: number;
        startDate: Date;
        endDate?: Date;
        permissions: RolePermission[];
    };
}
