import React, { useContext } from "react";
import { Choice, Poll } from "../../../models/polls";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { SelectFormGroup } from "../../utils/forms/SelectFormGroup";
import { Form, Formik } from "formik";
import { UserContext } from "../../../services/authService";
import { api } from "../../../services/apiService";
import { ToastContext } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";

/**
 * Display a form allowing to vote for a Poll in a Card.
 */
export const PollVotingForm = ({ poll }: { poll: Poll }) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const user = useContext(UserContext);
  const [vote] = useMutation(api.polls.vote, {
    onSuccess: () => {
      queryCache.refetchQueries(["polls.list"]);
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

  const onSubmit = (values, { setSubmitting }) => {
    vote(
      {
        user: user,
        pollId: poll.id,
        choiceId: values.choice,
      },
      { onSettled: setSubmitting(false) }
    );
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h3">{poll.question}</Card.Title>
      </Card.Header>

      <Card.Body>
        <Card.Subtitle className="text-left">
          <em>
            {poll.publicationDate &&
              dayjs(poll.publicationDate).format("DD/MM/YYYY")}
          </em>
        </Card.Subtitle>

        <Formik
          initialValues={{
            choice: undefined,
          }}
          onSubmit={onSubmit}
        >
          <Form>
            <ChoiceFields choices={poll.choices} />

            <div className="text-center ml-auto">
              {poll.userHasVoted ? (
                <p>Vous avez déjà voté.</p>
              ) : (
                <Button
                  disabled={poll.userHasVoted}
                  variant="outline-success"
                  type="submit"
                >
                  Voter
                </Button>
              )}
            </div>
          </Form>
        </Formik>
      </Card.Body>
    </Card>
  );
};

const ChoiceFields = ({ choices }: { choices: Choice[] }) => (
  <SelectFormGroup
    selectType="vertical"
    type="radio"
    label=""
    items={choices
      .sort((a, b) => a.text.localeCompare(b.text))
      .map((choice) => ({
        value: choice.id.toString(),
        text: choice.text,
      }))}
    name="choice"
  />
);
