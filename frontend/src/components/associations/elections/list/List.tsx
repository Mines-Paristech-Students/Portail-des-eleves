import React from "react";
import { PageTitle } from "../../../utils/PageTitle";
import { Link, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { api } from "../../../../services/apiService";
import { Pagination } from "../../../utils/Pagination";
import { Card } from "react-bootstrap";
import { Election } from "../../../../models/associations/election";
import dayjs from "dayjs";
import { Instructions } from "../../../utils/Instructions";
import "../elections.css";

export const AssociationListElection = ({ association }) => {
  const history = useHistory();

  return (
    <Container>
      <div className="d-flex align-items-center">
        <PageTitle>Votes</PageTitle>
        {association.myRole?.permissions?.includes("election") && (
          <Link
            to={`/associations/${association.id}/votes/nouveau`}
            className={"btn btn-primary btn-sm float-right ml-auto"}
          >
            <span className="fe fe-plus" /> Nouveau
          </Link>
        )}
      </div>

      <Pagination
        apiKey={["elections.list", association.id, { page_size: 30 }]}
        apiMethod={api.elections.list}
        render={(elections, paginationControl) => (
          <>
            {elections.map((election: Election) => (
              <Card
                key={election.id}
                onClick={() =>
                  history.push(
                    `/associations/${association.id}/votes/${election.id}`
                  )
                }
                className={"cursor-pointer"}
              >
                <Card.Header>
                  <Card.Title>{election.name}</Card.Title>
                </Card.Header>
                {election.endsAt < new Date() ? (
                  <p className={"card-alert alert alert-danger mb-0"}>
                    Terminée le{" "}
                    {dayjs(election.endsAt).format("DD/MM/YYYY à HH:mm")}
                  </p>
                ) : election.startsAt > new Date() ? (
                  <p className={"card-alert alert alert-success mb-0"}>
                    Commence le{" "}
                    {dayjs(election.startsAt).format("DD/MM/YYYY à HH:mm")}
                  </p>
                ) : (
                  <p className={"card-alert alert alert-warning mb-0"}>
                    En cours
                  </p>
                )}
              </Card>
            ))}
            {paginationControl}

            {elections.length === 0 && (
              <Instructions
                title={"Votes"}
                emoji={"🗳"}
                emojiAriaLabel="Une urne de vote"
              >
                Aucun vote pour l'instant.{" "}
                {association.myRole.permissions?.includes("election") ? (
                  <Link to={`/associations/${association.id}/votes/nouveau`}>
                    Créez un nouveau vote.
                  </Link>
                ) : (
                  "Revenez quand les responsables de l'association en auront ajouté !"
                )}
              </Instructions>
            )}
          </>
        )}
      />
    </Container>
  );
};
