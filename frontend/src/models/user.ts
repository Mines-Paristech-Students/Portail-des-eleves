export enum StudentType {
    AST = "AST",
    ISUPFERE = "ISUPFERE",
    EV = "EV",
    IC = "IC"
}

export interface User {
    first_name: string;
    last_name: string;
    birthday: string;
    email: string;
    yearOfEntry: number;
    studentType: StudentType;
    isActive: boolean;
    isAdmin: boolean;
    nickname: string;
    phone: string;
    room: string;
    address: string;
    cityOfOrigin: string;
    option: string;
    sports: string;
    roommate: User;
    minesparent: User[];
}
