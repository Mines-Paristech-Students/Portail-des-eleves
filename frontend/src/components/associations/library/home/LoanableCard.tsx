import React, { useContext } from "react";
import { Loanable } from "../../../../models/associations/library";
import Card from "react-bootstrap/Card";
import { decidePlural, formatNewLines } from "../../../../utils/format";
import { CardStatus } from "../../../utils/CardStatus";
import { TablerColor } from "../../../../utils/colors";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { UserContext } from "../../../../services/authService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const LoanButton = ({
  loanable,
  loan,
  cancel,
}: {
  loanable: Loanable;
  loan: () => void;
  cancel: () => void;
}) => {
  if (loanable.status === "BORROWED") {
    return (
      <Button className="btn-sm" variant="outline-danger" disabled={true}>
        Indisponible
      </Button>
    );
  } else if (
    loanable.status === "REQUESTED" &&
    loanable.userLoan &&
    loanable.userLoan.status === "PENDING" &&
    loanable.userLoan.priority
  ) {
    // The loanable is requested and the user has sent a request.
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={`${loanable.id}-tooltip`}>
            {loanable.userLoan.priority === 1
              ? "Aucune demande avant la vôtre"
              : `${loanable.userLoan.priority - 1} ${decidePlural(
                  loanable.userLoan.priority - 1,
                  "demande envoyée",
                  "demandes envoyées"
                )} avant la vôtre`}
          </Tooltip>
        }
      >
        <Button className="btn-sm" variant="secondary" onClick={cancel}>
          Annuler la demande
        </Button>
      </OverlayTrigger>
    );
  }

  // The loanable is not requested or other users have requested the loan, but not the user.
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={`${loanable.id}-tooltip`}>
          {loanable.numberOfPending === 0
            ? "Aucune demande en attente"
            : `${loanable.numberOfPending} ${decidePlural(
                loanable.numberOfPending - 1,
                "demande",
                "demandes"
              )} en attente`}
        </Tooltip>
      }
    >
      <Button className="btn-sm" variant="primary" onClick={loan}>
        Emprunter
      </Button>
    </OverlayTrigger>
  );
};

export const LoanableCard = ({ loanable }: { loanable: Loanable }) => {
  const user = useContext(UserContext);
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );
  const [loan] = useMutation(api.loans.post, {
    onMutate: () => sendInfoToast("Demande en cours d’envoi..."),
    onSuccess: () => {
      sendSuccessToast("Demande envoyée.");
      queryCache.refetchQueries("loanables.list");
    },
    onError: () => sendErrorToast("La demande a échoué."),
  });

  const [cancel] = useMutation(api.loans.cancel, {
    onMutate: () => sendInfoToast("Annulation en cours..."),
    onSuccess: () => {
      sendSuccessToast("Demande annulée.");
      queryCache.refetchQueries("loanables.list");
    },
    onError: () => sendErrorToast("L’annulation a échoué."),
  });

  return (
    <Card>
      <CardStatus
        color={
          loanable.status !== "BORROWED" ? TablerColor.Blue : TablerColor.Gray
        }
      />

      <Card.Header>
        <Card.Title>{loanable.name}</Card.Title>

        {user && (
          <div className="card-options">
            <LoanButton
              loanable={loanable}
              loan={() =>
                loan({
                  userId: user.id,
                  loanableId: loanable.id,
                })
              }
              cancel={() => {
                if (loanable.userLoan) {
                  return cancel(loanable.userLoan.id);
                }
              }}
            />
          </div>
        )}
      </Card.Header>

      <Card.Body className="pt-3">
        {loanable.status === "BORROWED" && loanable.expectedReturnDate && (
          <p className="text-muted mb-4">
            Retour attendu avant le{" "}
            {dayjs(loanable.expectedReturnDate).format("DD/MM/YYYY")}.
          </p>
        )}

        {loanable.description && <p>{formatNewLines(loanable.description)}</p>}
      </Card.Body>
    </Card>
  );
};
