export interface Role {
    id: number;
    association: string;
    role: string;
    rank: number;

    isArchived: boolean;

    administrationPermission: boolean;
    electionPermission: boolean;
    eventPermission: boolean;
    mediaPermission: boolean;
    libraryPermission: boolean;
    marketplacePermission: boolean;
    pagePermission: boolean;
}
