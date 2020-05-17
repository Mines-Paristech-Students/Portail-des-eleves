import { Association } from "./association";
import { User } from "../user/user";

export enum LoanStatus {
    Accepted = "ACCEPTED",
    Rejected = "REJECTED",
    Cancelled = "CANCELLED",
    Borrowed = "BORROWED",
    Returned = "RETURNED",
}

export interface Loan {
    id: string;
    user: User;
    status: LoanStatus;
    loanable: Loanable;
    expectedReturnDate: Date;
    loanDate: Date;
    realReturnDate: Date;
}

export interface Loanable {
    name: string;
    description: string;
    image: string;
    comment: string;
    library: Library;
}

export interface Library {
    id: string;
    enabled: boolean;
    association: Association;
    loanables: Loanable[];
}
