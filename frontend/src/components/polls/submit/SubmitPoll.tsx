import React, { useContext } from "react";
import { PollsBase } from "../PollsBase";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getRandom } from "../../../utils/random";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import { PageTitle } from "../../utils/PageTitle";
import { api } from "../../../services/apiService";
import { ToastContext } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";

const [questionPlaceholder, choice0Placeholder, choice1Placeholder] = getRandom(
  [
    ["Le portail…", "C’était pas mieux avant.", "C’est bien mieux maintenant."],
    ["La piche…", "C’était mieux avant.", "C’est moins bien maintenant."],
    ["Le BDE…", "C’était mieux avant.", "C’est moins bien maintenant."],
    ["Ton premier choix ?", "L’X", "Ulm"],
    ["Le plus claqué ?", "L’Octo", "La biéro"],
    ["Les plus sharks ?", "(La) JuMP", "Le Trium"],
  ]
);

export const SubmitPoll = () => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const [create] = useMutation(api.polls.create, {
    onSuccess: () => {
      queryCache.refetchQueries(["polls.list"]);
      queryCache.refetchQueries(["polls.stats"]);sendSuccessToast("Sondage envoyé.");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined
            ? ""
            : "Détails :" + error.response.data.detail
        }`
      );
    },
  });

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    let data = {
      question: values.question,
      choices: [{ text: values.choice0 }, { text: values.choice1 }],
    };

    create(
      { data },
      {
        onSuccess: resetForm,
        onSettled: () => setSubmitting(false),
      }
    );
  };

  return (
    <PollsBase>
      <PageTitle>Proposer un sondage</PageTitle>
      <Card className="text-left">
        <Formik
          initialValues={{
            question: "",
            choice0: "",
            choice1: "",
          }}
          validationSchema={Yup.object({
            question: Yup.string().required("Ce champ est requis."),
            choice0: Yup.string().required("Ce champ est requis."),
            choice1: Yup.string().required("Ce champ est requis."),
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
