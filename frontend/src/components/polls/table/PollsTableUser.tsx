import React, { useContext } from "react";
import { PollStateIcon } from "./PollStateIcon";
import Button from "react-bootstrap/Button";
import { PollsTable } from "./PollsTable";
import { PollState } from "../../../models/polls";
import { ToastContext } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../services/apiService";
import { AxiosError } from "axios";
import { Column } from "../../utils/table/TableHeader";

export const PollsTableUser = () => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const [remove] = useMutation(api.polls.remove, {
    onSuccess: (response) => {
      queryCache.invalidateQueries(["polls.list"]);
      queryCache.invalidateQueries(["polls.stats"]);

      if (response.status === 204) {
        sendSuccessToast("Sondage supprimé.");
      }
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response
            ? "Détails : " +
              (error.response.status === 403
                ? "vous n’avez pas le droit de supprimer ce sondage."
                : error.response.data.detail)
            : ""
        }`
      );
    },
  });

  return <PollsTable adminVersion={false} columnData={columnData(remove)} />;
};

const columnData: (remove) => (setEditPoll) => Column[] = (remove) => (
  setEditPoll
) => [
  {
    key: "question",
    header: "Contenu",
    render: (poll) => (
      <>
        {poll.question}
        {poll.choices
          .sort((a, b) => a.text.localeCompare(b.text))
          .map((choice) => (
            <div className="small pollChoice" key={choice.id}>
              {choice.text}
            </div>
          ))}
      </>
    ),
    canSort: true,
    headerClassName: "w-50",
  },
  {
    key: "state",
    render: (poll) => (
      <div className="text-center">
        <PollStateIcon state={poll.state} />
      </div>
    ),
    header: "Statut",
    canSort: true,
  },
  {
    key: "adminComment",
    header: "Commentaire",
    cellClassName: "text-break",
  },
  {
    key: "action",
    render: (poll) => (
      <>
        {poll.state === PollState.Reviewing ? (
          <Button
            className="btn-icon m-1"
            variant="outline-primary"
            size="sm"
            onClick={() => setEditPoll(poll)}
          >
            <i className="fe fe-edit" />
          </Button>
        ) : null}
        {poll.state === PollState.Reviewing ||
        poll.state === PollState.Rejected ? (
          <Button
            className="btn-icon m-1"
            variant="outline-danger"
            size="sm"
            onClick={() => remove({ pollId: poll.id })}
          >
            <i className="fe fe-trash-2" />
          </Button>
        ) : null}
      </>
    ),
    header: "Actions",
  },
];
