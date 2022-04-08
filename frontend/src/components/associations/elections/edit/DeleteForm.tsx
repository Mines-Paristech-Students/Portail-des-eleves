import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";
import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export const DeleteForm = ({ election }) => {
  const { sendErrorToast } = useContext(ToastContext);
  const history = useHistory();

  const [remove] = useMutation(api.elections.delete, {
    onSuccess: () => {
      queryCache.invalidateQueries(["election.choices.list"]);
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined ? "" : "Détails :" + error.response.data
        }`
      );
    },
  });

  return (
    <Card className={"text-danger mt-5"}>
      <div className="card-status bg-red" />
      <Card.Header>
        <Card.Title>Zone de danger</Card.Title>
      </Card.Header>
      <Card.Body>
        <Button
          size={"lg"}
          variant={"outline-danger"}
          onClick={() => {
            window.confirm(
              "Supprimer l'élection ? Cette action est irréversible"
            ) &&
              remove(election).then(() => {
                history.push(`/associations/${election.association}/votes/`);
              });
          }}
        >
          Supprimer l'élection
        </Button>{" "}
        cette action sera irréversible
      </Card.Body>
    </Card>
  );
};
