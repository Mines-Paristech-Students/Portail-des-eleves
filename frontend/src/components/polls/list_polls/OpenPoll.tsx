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

type Props = {
    poll: Poll;
    refetch: any;
};

export function OpenPoll(props: Props) {
    const newToast = useContext(ToastContext);
    const user = useContext(UserContext);

    return (
        <Card>
            <Card.Header>
                <Card.Title as="h3">{props.poll.question}</Card.Title>
            </Card.Header>

            <Card.Body>
                <Card.Subtitle className="poll-date">
                    <em>
                        {props.poll.publicationDate &&
                        dateFormatter(props.poll.publicationDate)}
                    </em>
                </Card.Subtitle>

                <Formik
                    initialValues={{
                        choice: undefined
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        api.polls
                            .vote(user, props.poll.id, values.choice)
                            .then(response => {
                                if (response.status == 201) {
                                    newToast({
                                        message: "Vous avez voté.",
                                        level: ToastLevel.Success
                                    });
                                    props.refetch({ force: true });
                                }
                            })
                            .catch(error => {
                                let message = "Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste.";

                                switch (error.response.data.detail) {
                                    case "Invalid choice provided.":
                                        message = "Ce choix est invalide.";
                                        break;
                                    case "This poll is not active.":
                                        message = "Ce sondage n’est plus actif.";
                                        break;
                                    case "You have already voted.":
                                        message = "Vous avez déjà voté.";
                                        break;
                                    default:
                                        break;
                                }

                                newToast({
                                    message: message,
                                    level: ToastLevel.Error
                                });
                            })
                            .then(() => {
                                setSubmitting(false);
                            });
                    }}
                >
                    <Form>
                        <ChoiceFields choices={props.poll.choices}/>

                        <div className="text-center ml-auto">
                            {
                                props.poll.userHasVoted ? (
                                    <p>Vous avez déjà voté.</p>
                                ) : (
                                    <Button disabled={props.poll.userHasVoted} variant="outline-success" type="submit">
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
}

type ChoiceFieldsProps = {
    choices: Choice[]
};

function ChoiceFields(props: ChoiceFieldsProps) {
    let items: Map<string, ReactElement> = new Map();

    props.choices.forEach(choice => {
        items.set(
            choice.id.toString(),
            <span className="selectgroup-button">{choice.text}</span>
        );
    });

    return (
        <SelectGroup type="vertical" label="" items={items} name="choice"/>
    );
}