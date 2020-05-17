import { ProfileAnswer } from "./profile";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    birthday: Date;
    email: string;
    yearOfEntry: number;
    studentType: "AST" | "ISUPFERE" | "EV" | "IC";
    currentAcademicYear: "1A" | "2A" | "GAP YEAR" | "3A" | "GRADUATE";
    isActive: boolean;
    isStaff: boolean;
    promotion: number;
    nickname: string;
    phone: string;
    room: string;
    address: string;
    cityOfOrigin: string;
    option: string;
    roommate: { id: string; firstName: string; lastName: string }[];
    minesparent: { id: string; firstName: string; lastName: string }[];
    fillots: { id: string; firstName: string; lastName: string }[];
    profileAnswers: ProfileAnswer[];
}
