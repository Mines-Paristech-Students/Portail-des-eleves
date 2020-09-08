import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { useHistory } from "react-router";
import { api } from "../../../../services/apiService";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import Container from "react-bootstrap/Container";
import { MutatePageForm } from "../MutatePageForm";
import { Association } from "../../../../models/associations/association";
import { PageTitle } from "../../../utils/PageTitle";

export const AssociationCreatePage = ({
  association,
}: {
  association: Association;
}) => {
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const history = useHistory();

  const [create] = useMutation(api.pages.create, {
    onMutate: () => sendInfoToast("Sauvegarde en cours…"),
    onSuccess: () => {
      sendSuccessToast("Page créée.");
      history.push(`/associations/${association.id}/pages`);
      return queryCache.invalidateQueries(["pages.list"]);
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response
            ? "Détails : " +
              (error.response.status === 403
                ? "vous n’avez pas le droit de créer de page."
                : error.response.status === 400 &&
                  error.response.data.nonFieldErrors
                ? "une page avec ce nom existe déjà."
                : JSON.stringify(error.response.data))
            : ""
        }`
      );
    },
  });

  return (
    <Container>
      <PageTitle>Créer une page</PageTitle>

      <MutatePageForm
        initialValues={{ title: "", text: "", pageType: "NEWS" }}
        onSubmit={(values, { setSubmitting }) =>
          create(
            { association: association.id, ...values },
            { onSettled: () => setSubmitting(false) }
          )
        }
      />
    </Container>
  );
};
