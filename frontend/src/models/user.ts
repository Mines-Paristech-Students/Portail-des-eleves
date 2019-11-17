export enum StudentType {
    Ast = "AST",
    Isupfere = "ISUPFERE",
    Ev = "EV",
    Ic = "IC"
}

export interface Role {
    id: number;
    association: string;
    role: string;
    rank: number;

    is_archived: boolean;

    administrationPermission: boolean;
    electionPermission: boolean;
    eventPermission: boolean;
    mediaPermission: boolean;
    libraryPermission: boolean;
    marketplacePermission: boolean;
    pagePermission: boolean;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    birthday?: string;
    email?: string;
    yearOfEntry?: number;
    studentType?: StudentType;
    isActive?: boolean;
    isAdmin?: boolean;
    nickname?: string;
    phone?: string;
    room?: string;
    address?: string;
    cityOfOrigin?: string;
    option?: string;
    sports?: string;
    roommate?: User;
    minesparent?: User[];
    myRole?: Role;
}
