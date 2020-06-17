import { Association } from "./association";
import { User } from "../user";

export enum LoanStatus {
  Accepted = "ACCEPTED",
  Borrowed = "BORROWED",
  Cancelled = "CANCELLED",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Returned = "RETURNED",
}

export interface Loan {
  id: string;
  user: User;
  status: LoanStatus;
  loanable: Loanable;
  expectedReturnDate?: Date;
  loanDate?: Date;
  realReturnDate?: Date;
}

export interface Loanable {
  name: string;
  description?: string;
  image?: string;
  comment?: string;
  library: Library;
  status: "AVAILABLE" | "BORROWED";
  expectedReturnDate?: Date;
}

export interface Library {
  id: string;
  enabled: boolean;
  association: string;
  loanables: Loanable[];
}
