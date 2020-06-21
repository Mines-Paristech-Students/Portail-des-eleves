export type LoanStatus =
  | "ACCEPTED"
  | "BORROWED"
  | "CANCELLED"
  | "PENDING"
  | "REJECTED"
  | "RETURNED";

export interface Loan {
  id: number;
  priority: number | null;
  requestDate: Date;
  user: string;
  status: LoanStatus;
  loanable: Pick<Loanable, "name" | "description" | "image" | "comment">;
  expectedReturnDate: Date | null;
  loanDate: Date | null;
  realReturnDate: Date | null;
}

export interface Loanable {
  id: number;
  userLoan: null | (Omit<Loan, "loanable"> & { loanable: number });
  numberOfPending: number;
  name: string;
  description?: string;
  image?: string;
  comment?: string;
  library: string;
  status: "AVAILABLE" | "BORROWED" | "REQUESTED";
  expectedReturnDate: Date | null;
}

export interface Library {
  id: string;
  enabled: boolean;
  association: string;
  loanables: Loanable[];
}
