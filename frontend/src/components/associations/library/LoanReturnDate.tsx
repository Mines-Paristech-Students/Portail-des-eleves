import React from "react";
import { Loan } from "../../../models/associations/library";
import dayjs from "dayjs";

/**
 * Display the expected return date if the loan status is `BORROWED`, the real
 * return date if the loan status is `RETURNED`, `-` otherwise.
 * Add a `help` cursor over the date and a `title` indicating the displayed
 * date.
 * If the status is `BORROWED` and the expected return date is over, the date
 * is displayed in red.
 *
 * @param loan
 */
export const LoanReturnDate = ({ loan }: { loan: Loan }) =>
  loan.status === "BORROWED" && loan.expectedReturnDate ? (
    <span
      title={`Date de retour prévue${
        dayjs() > dayjs(loan.expectedReturnDate) ? " (en retard)" : ""
      }`}
      style={{ cursor: "help" }}
      className={dayjs() > dayjs(loan.expectedReturnDate) ? "text-danger" : ""}
    >
      {dayjs(loan.expectedReturnDate).format("DD/MM/YYYY HH:mm")}
    </span>
  ) : loan.status === "RETURNED" && loan.realReturnDate ? (
    <span title="Date de retour effective" style={{ cursor: "help" }}>
      {dayjs(loan.realReturnDate).format("DD/MM/YYYY HH:mm")}
    </span>
  ) : (
    <>-</>
  );
