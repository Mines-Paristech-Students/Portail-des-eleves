import React, { ReactElement, useContext } from "react";
import { Choice, Poll } from "../../../models/polls";
import { formatDate } from "../../../utils/format";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { SelectGroup } from "../../utils/forms/SelectGroup";
import { Form, Formik } from "formik";
import { UserContext } from "../../../services/authService";
import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";

export const PollVotingForm = ({ poll }: { poll: Poll }) => {
    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);
    const [vote] = useMutation(api.polls.vote, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["polls.list"]);

            if (response.status === 201) {
                newToast({
                    message: "Vous avez voté.",
                    level: ToastLevel.Success,
                });
            }
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

            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    detail === "" ? "" : "Détails : " + detail
                }`,
                level: ToastLevel.Error,
            });
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
                <Card.Subtitle className="poll-date">
                    <em>
                        {poll.publicationDate &&
                            formatDate(poll.publicationDate)}
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

const ChoiceFields = ({ choices }: { choices: Choice[] }) => {
    let items: Map<string, ReactElement> = new Map();

    choices.forEach((choice) => {
        items.set(
            choice.id.toString(),
            <span className="selectgroup-button">{choice.text}</span>
        );
    });

    return <SelectGroup type="vertical" label="" items={items} name="choice" />;
};
