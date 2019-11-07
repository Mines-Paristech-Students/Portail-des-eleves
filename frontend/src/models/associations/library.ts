import { Association } from "./association";
import { User } from "../authentication/user";

export enum LoanStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    BORROWED = "BORROWED",
    RETURNED = "RETURNED"
}

export interface Loan {
    id: string;
    user: User;
    status: LoanStatus;
    loanable: Loanable;
    expected_return_date: Date;
    loan_date: Date;
    real_return_date: Date;
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
