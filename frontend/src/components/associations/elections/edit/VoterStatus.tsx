import React, { useContext, useState } from "react";
import { UserSelector } from "../../../utils/UserSelector";
import { User } from "../../../../models/user";
import { api } from "../../../../services/apiService";
import { Modal, Button } from "react-bootstrap";
import { Voter } from "../../../../models/associations/election";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../utils/Toast";

export const VoterStatus = ({ election }) => {
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);

  return (
    <>
      <ChangeStateModal voter={selectedVoter} setVoter={setSelectedVoter} />
      <UserSelector
        setUser={setSelectedVoter}
        title={"Votants inscrits"}
        helper={"Cliquez sur un utilisateur pour le marquer comme ayant voté"}
        inCard={true}
        apiKey={"election.voters.search"}
        apiMethod={api.elections.voters.list}
        queryParams={{ election: election.id }}
        getUser={(voter) => voter.user}
      />
    </>
  );
};

export const ChangeStateModal = ({ voter, setVoter }) => {
  const handleClose = () => setVoter(null);
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const [save] = useMutation(api.elections.voters.update, {
    onMutate: () => sendInfoToast("Demande en cours d’envoi..."),
    onSuccess: () => {
      sendSuccessToast("Demande envoyée.");
      queryCache.invalidateQueries("election.voters.search");
    },
    onError: () => sendErrorToast("La demande a échoué."),
  });

  return (
    voter && (
      <Modal show={voter.user !== undefined} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {voter.user?.firstName} {voter.user?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <Button
              size={"lg"}
              variant={
                voter.status === "ONLINE_VOTE" ? "primary" : "outline-primary"
              }
              disabled={voter.status !== "ONLINE_VOTE"}
            >
              A voté en ligne
            </Button>
            <Button
              className={"my-4"}
              size={"lg"}
              variant={
                voter.status === "OFFLINE_VOTE" ? "success" : "outline-success"
              }
              disabled={voter.status === "ONLINE_VOTE"}
              onClick={() =>
                voter.status === "PENDING" &&
                save({ id: voter.id, status: "OFFLINE_VOTE" })
              }
            >
              A voté en bureau de vote
            </Button>
            <Button
              size={"lg"}
              variant={voter.status === "PENDING" ? "danger" : "outline-danger"}
              disabled={voter.status !== "PENDING"}
            >
              N'a pas voté
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );
};
