import { Election } from "../../../../models/associations/election";
import React, { useContext, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { queryCache, useMutation } from "react-query";
import { api, useBetterPaginatedQuery } from "../../../../services/apiService";
import { AxiosError } from "axios";
import { ToastContext } from "../../../utils/Toast";
import { ErrorMessage } from "../../../utils/ErrorPage";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "../../../utils/forms/TextField";

export const EditChoices = ({ election }: { election: Election }) => {
  const { sendErrorToast } = useContext(ToastContext);

  const {
    resolvedData: choices,
    error,
    status,
  } = useBetterPaginatedQuery<any>(
    ["election.choices.list", { page_size: 1000, election: election.id }],
    api.elections.choices.list
  );

  const [create] = useMutation(api.elections.choices.create, {
    onSuccess: () => {
      queryCache.invalidateQueries(["election.choices.list"]);
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

  return (
    <Card>
      <Card.Header>
        <Card.Title>Choix de vote</Card.Title>
        <div className={"card-options"}>
          <Button
            variant={"success"}
            size={"sm"}
            onClick={() =>
              create({
                name: `Choix #${choices.count}`,
                election: election.id,
              })
            }
          >
            Ajouter
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {status === "error" ? (
          <ErrorMessage>{error?.toString()}</ErrorMessage>
        ) : status === "success" && choices ? (
          <>
            {choices.results.map((choice) => (
              <ChoiceEditForm choice={choice} key={choice.id} />
            ))}
            {choices.count === 0 && (
              <p className="lead text-center text-muted">
                Aucun choix pour l'instant
              </p>
            )}
          </>
        ) : null}
      </Card.Body>
    </Card>
  );
};

const ChoiceEditForm = ({ choice }) => {
  const { sendErrorToast } = useContext(ToastContext);
  const [state, setState] = useState<"neutral" | "saving" | "error" | "saved">(
    "neutral"
  );

  const [update] = useMutation(api.elections.choices.update, {
    onSuccess: () => {
      queryCache.invalidateQueries(["election.choices.list"]);
      setState("saved");
      setTimeout(() => {
        setState("neutral");
      }, 1000);
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
      setState("error");
    },
  });

  const [remove] = useMutation(api.elections.choices.delete, {
    onSuccess: () => {
      queryCache.invalidateQueries(["election.choices.list"]);
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

  const [timeoutId, setTimeoutId] = useState<any>(null);
  const submitWithDelay = (handleSubmit) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(setTimeout(handleSubmit, 500));
  };

  return (
    <Formik
      initialValues={choice}
      validationSchema={Yup.object({
        name: Yup.string().required("Champs requis"),
      })}
      onSubmit={(values) => {
        setState("saving");
        update(values);
      }}
    >
      {({ handleSubmit, values, setValues }) => (
        <Form className={"mb-3"}>
          <div className="input-group">
            <TextField
              name="name"
              type="text"
              placeholder={"Nom du choix"}
              onChange={(e) => {
                setValues({ ...values, name: e.target.value });
                submitWithDelay(handleSubmit);
              }}
            />
            <div className="input-group-append">
              {state !== "neutral" && (
                <Button disabled variant={"secondary"}>
                  {state === "saved" ? (
                    <i className="fe fe-check-circle" />
                  ) : state === "saving" ? (
                    <i className="fe fe-upload" />
                  ) : state === "error" ? (
                    <i className="fe fe-x" />
                  ) : null}
                </Button>
              )}
              <Button variant={"outline-danger"} onClick={() => remove(choice)}>
                <i className="fe fe-x" />
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
