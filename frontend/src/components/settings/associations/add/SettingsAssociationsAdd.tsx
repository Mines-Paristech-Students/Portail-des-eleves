import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../../utils/PageTitle";
import { Link, useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { MutateAssociationForm } from "../edit/MutateAssociationForm";
import { SettingsLayout } from "../../SettingsLayout";
import { ToastContext } from "../../../utils/Toast";
import { api } from "../../../../services/apiService";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import { ArrowLink } from "../../../utils/ArrowLink";

export const SettingsAssociationsAdd = () => {
  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const [create] = useMutation(api.associations.create, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.list"]);
      sendSuccessToast("Association créée.");
      history.push(`/parametres/associations`);
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined
            ? ""
            : "Détails : " + JSON.stringify(error.response.data)
        }`
      );
    },
  });

  return (
    <SettingsLayout>
      <Container>
        <PageTitle>
          <ArrowLink to={`/parametres/associations`} /> Créer une association
        </PageTitle>
        <Card className="text-left">
          <MutateAssociationForm
            initialValues={{
              name: "",
              rank: 0,
              administrators: [],
            }}
            onSubmit={(values, { setSubmitting }) =>
              create(values, {
                onSettled: setSubmitting(false),
              })
            }
          />
        </Card>
      </Container>
    </SettingsLayout>
  );
};
