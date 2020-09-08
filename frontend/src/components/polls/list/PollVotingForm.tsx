import React, { useContext } from "react";
import { Poll } from "../../../models/polls";
import Button from "react-bootstrap/Button";
import { UserContext } from "../../../services/authService";
import { api } from "../../../services/apiService";
import { ToastContext } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";

/**
 * Display a form allowing to vote for a Poll in a Card.
 */
export const PollVotingForm = ({
  poll,
  children,
}: {
  poll: Poll;
  children?: JSX.Element;
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const user = useContext(UserContext);
  const [vote] = useMutation(api.polls.vote, {
    onSuccess: () => {
      queryCache.invalidateQueries(["polls.list"]);
      queryCache.invalidateQueries(["polls.stats"]);
      queryCache.invalidateQueries(["subsriptions.polls.get"]);
      sendSuccessToast("Vous avez voté.");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      let detail = error.response ? error.response.data.detail : "";

      switch (detail) {
        case "Invalid choice provided.":
          detail = "Ce choix est invalide.";
          break;
        case "This poll is not active.":
          detail = "Ce sondage n’est plus actif.";
          break;
        case "You have already voted.":
          detail = "Vous avez déjà voté.";
          break;
        default:
          break;
      }

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          detail === "" ? "" : "Détails : " + detail
        }`
      );
    },
  });

  const onSubmit = (choiceId) => {
    vote({
      user: user,
      pollId: poll.id,
      choiceId: choiceId,
    });
  };

  return (
    <>
      <h3>{poll.question}</h3>
      {poll.choices.map((choice) => (
        <Button
          key={choice.id}
          size={"lg"}
          variant={"secondary"}
          className={"d-block w-100 mb-2 btn-square"}
          onClick={() => onSubmit(choice.id)}
        >
          {choice.text}
        </Button>
      ))}
      {children}
      <p className="text-center text-muted">
        <em>
          {poll.publicationDate &&
            dayjs(poll.publicationDate).format("DD/MM/YYYY")}
        </em>
      </p>
    </>
  );
};
