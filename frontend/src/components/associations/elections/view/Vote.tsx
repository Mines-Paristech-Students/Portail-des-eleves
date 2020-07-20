import React, { useContext, useEffect, useState } from "react";
import { Choice, Election } from "../../../../models/associations/election";
import { Card, Button, Row, Col } from "react-bootstrap";
import { api } from "../../../../services/apiService";
import { ToastContext } from "../../../utils/Toast";
import { queryCache } from "react-query";

export const VoteCard = ({ election }: { election: Election }) => {
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const [checks, setChecks] = useState<{ choice: Choice; state: boolean }[]>(
    []
  );

  useEffect(() => {
    setChecks(
      election.choices.map((choice) => ({ choice: choice, state: false }))
    );
  }, [election.choices]);

  const submitVote = () => {
    if (
      checks.filter(({ choice, state }) => state).length >
      election.maxChoicesPerBallot
    ) {
      sendErrorToast(
        `Sélctionnez ${election.maxChoicesPerBallot} choix maximum`
      );
      return;
    }

    api.elections
      .vote(
        election.id,
        checks
          .filter(({ choice, state }) => state)
          .map(({ choice, state }) => choice)
      )
      .then(() => {
        sendSuccessToast("Votre vote a bien été enregistré");
        queryCache.invalidateQueries("election.get");
      })
      .catch((err) => {
        sendErrorToast(`Une erreur est survenue ${err}`);
      });
  };

  return election && election.userVoter ? (
    <Card>
      <Card.Header>
        <Card.Title>Voter</Card.Title>
      </Card.Header>
      <Card.Body>
        {election.userVoter.status === "PENDING" ? (
          <>
            <p>
              Vous pouvez sélectionner jusqu'à {election.maxChoicesPerBallot}{" "}
              choix
            </p>
            <Row className={""}>
              {checks.map(({ choice, state }) => (
                <Col md={6} className={"d-flex"}>
                  <label className="selectgroup-item" key={choice.id}>
                    <input
                      type="checkbox"
                      value={choice.name}
                      className="selectgroup-input"
                      checked={state}
                      onChange={() =>
                        setChecks((prevState) =>
                          prevState.map(({ choice: c, state: s }) => ({
                            choice: c as Choice,
                            state: choice.id === c.id ? !s : s,
                          }))
                        )
                      }
                    />
                    <span className="selectgroup-button">{choice.name}</span>
                  </label>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-3">
              <Button
                size={"lg"}
                variant={"success"}
                className={"ml-auto"}
                onClick={submitVote}
              >
                Valider mon vote !
              </Button>
            </div>
          </>
        ) : election.userVoter.status === "OFFLINE_VOTE" ? (
          <p className={"text-center lead"}>
            Vous avez déjà voté en bureau de vote.
          </p>
        ) : election.userVoter.status === "ONLINE_VOTE" ? (
          <p className={"text-center lead"}>Vous avez déjà voté en ligne.</p>
        ) : null}
      </Card.Body>
    </Card>
  ) : null;
};
