import React, { useContext } from "react";
import { PollsBase } from "../PollsBase";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getRandom } from "../../../utils/random";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import { PageTitle } from "../../../utils/common";
import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";

export const SubmitPoll = () => {
    const newToast = useContext(ToastContext);

    const [
        questionPlaceholder,
        choice0Placeholder,
        choice1Placeholder
    ] = getRandom([
        ["Le portail…", "C’était mieux avant.", "C’est moins bien maintenant."],
        ["La piche…", "C’était mieux avant.", "C’est moins bien maintenant."],
        ["Le BDE…", "C’était mieux avant.", "C’est moins bien maintenant."],
        ["Le plus beau ?", "17bocquet", "17cantelobre"]
    ]);

    const onSubmit = (values, { resetForm, setSubmitting }) => {
        let data = {
            question: values.question,
            choice0: values.choice0,
            choice1: values.choice1
        };

        api.polls
            .create(data)
            .then(response => {
                if (response.status === 201) {
                    newToast({
                        message: "Sondage envoyé.",
                        level: ToastLevel.Success
                    });
                    resetForm();
                }
            })
            .catch(error => {
                let message =
                    "Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste.";
                newToast({
                    message: `${message} Détails : ${error.response.data.detail}`,
                    level: ToastLevel.Error
                });
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    return (
        <PollsBase>
            <PageTitle>Proposer un sondage</PageTitle>
            <Card className="text-left">
                <Formik
                    initialValues={{
                        question: "",
                        choice0: "",
                        choice1: ""
                    }}
                    validationSchema={Yup.object({
                        question: Yup.string().required("Ce champ est requis."),
                        choice0: Yup.string().required("Ce champ est requis."),
                        choice1: Yup.string().required("Ce champ est requis.")
                    })}
                    onSubmit={onSubmit}
                >
                    <Form>
                        <Card.Body>
                            <TextFormGroup
                                label="Question"
                                name="question"
                                type="text"
                                placeholder={questionPlaceholder}
                            />
                            <TextFormGroup
                                label="Choix 1"
                                name="choice0"
                                type="text"
                                placeholder={choice0Placeholder}
                            />
                            <TextFormGroup
                                label="Choix 2"
                                name="choice1"
                                type="text"
                                placeholder={choice1Placeholder}
                            />
                        </Card.Body>

                        <Card.Footer className="text-right">
                            <Button type="submit" variant="outline-success">
                                Envoyer
                            </Button>
                        </Card.Footer>
                    </Form>
                </Formik>
            </Card>
        </PollsBase>
    );
};
