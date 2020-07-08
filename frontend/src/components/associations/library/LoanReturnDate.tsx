import React from "react";
import { Loan } from "../../../models/associations/library";
import dayjs from "dayjs";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="loan-expected-return-date-tooltip">{`Retour prévu${
          dayjs() > dayjs(loan.expectedReturnDate) ? " (en retard)" : ""
        }`}</Tooltip>
      }
    >
      <div
        className={
          dayjs() > dayjs(loan.expectedReturnDate) ? "text-danger" : ""
        }
      >
        {dayjs(loan.expectedReturnDate).format("DD/MM/YYYY HH:mm")}
      </div>
    </OverlayTrigger>
  ) : loan.status === "RETURNED" && loan.realReturnDate ? (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="loan-real-return-date-tooltip">Retour réel</Tooltip>
      }
    >
      <div>{dayjs(loan.realReturnDate).format("DD/MM/YYYY HH:mm")}</div>
    </OverlayTrigger>
  ) : (
    <>-</>
  );
