import React, { ReactElement, useContext } from "react";
import { Choice, Poll } from "../../../models/polls";
import { dateFormatter } from "../../../utils/format";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { SelectGroup } from "../../utils/forms/SelectGroup";
import { Form, Formik } from "formik";
import { UserContext } from "../../../services/authService";
import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { CardStatus } from "../../CardStatus";

export const PollVotingForm = ({ poll, refetch }: { poll: Poll, refetch: any }) => {
    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);

    return (
        <Card>
            <CardStatus color="random" position="left"/>

            <Card.Header>
                <Card.Title as="h3">{poll.question}</Card.Title>
            </Card.Header>

            <Card.Body>
                <Card.Subtitle className="poll-date">
                    <em>
                        {poll.publicationDate &&
                        dateFormatter(poll.publicationDate)}
                    </em>
                </Card.Subtitle>

                <Formik
                    initialValues={{
                        choice: undefined
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        api.polls
                            .vote(user, poll.id, values.choice)
                            .then(response => {
                                if (response.status === 201) {
                                    newToast({
                                        message: "Vous avez voté.",
                                        level: ToastLevel.Success
                                    });
                                    refetch({ force: true });
                                }
                            })
                            .catch(error => {
                                let message = "Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste.";
                                let detail = error.response.data.detail;

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
                                    message: `${message} Détails : ${detail}`,
                                    level: ToastLevel.Error
                                });
                            })
                            .then(() => {
                                setSubmitting(false);
                            });
                    }}
                >
                    <Form>
                        <ChoiceFields choices={poll.choices}/>

                        <div className="text-center ml-auto">
                            {
                                poll.userHasVoted ? (
                                    <p>Vous avez déjà voté.</p>
                                ) : (
                                    <Button disabled={poll.userHasVoted} variant="outline-success" type="submit">
                                        Voter
                                    </Button>
                                )
                            }
                        </div>
                    </Form>
                </Formik>
            </Card.Body>
        </Card>
    );
};

const ChoiceFields = ({ choices }: { choices: Choice[] }) => {
    let items: Map<string, ReactElement> = new Map();

    choices.forEach(choice => {
        items.set(
            choice.id.toString(),
            <span className="selectgroup-button">{choice.text}</span>
        );
    });

    return (
        <SelectGroup type="vertical" label="" items={items} name="choice"/>
    );
};
