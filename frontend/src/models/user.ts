export enum StudentType {
    Ast = "AST",
    Isupfere = "ISUPFERE",
    Ev = "EV",
    Ic = "IC"
}

export interface User {
    firstName: string;
    lastName: string;
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
