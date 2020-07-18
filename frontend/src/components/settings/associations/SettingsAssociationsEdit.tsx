import React, { useContext } from "react";
import { useHistory, useParams } from "react-router";
import { ToastContext } from "../../utils/Toast";
import { api, useBetterQuery } from "../../../services/apiService";
import { Association } from "../../../models/associations/association";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import { LoadingAssociation } from "../../associations/Loading";
import { Error } from "../../utils/Error";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { SettingsLayout } from "../SettingsLayout";
import { MutateAssociationForm } from "./MutateAssociationForm";

export const SettingsAssociationsEdit = () => {
  const { associationId } = useParams<{ associationId: string }>();

  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const { data: association, error, status } = useBetterQuery<Association>(
    ["associations.get", { associationId }],
    api.associations.get,
    { refetchOnWindowFocus: false }
  );

  const [edit] = useMutation(api.associations.update, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.get"]);
      sendSuccessToast("Association modifiée.");
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

  const [remove] = useMutation(api.associations.delete, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.list"]);
      sendSuccessToast("Association supprimée.");
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

  return status === "loading" ? (
    <LoadingAssociation />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : association ? (
    <SettingsLayout>
      <Container>
        <PageTitle>
          <Link
            className="text-decoration-none"
            to={`/parametres/associations`}
            style={{ verticalAlign: "middle" }}
          >
            <i className="fe fe-arrow-left" />
          </Link>{" "}
          Modifier l’association
        </PageTitle>
        <Card className="text-left">
          <MutateAssociationForm
            initialValues={association}
            onSubmit={(values, { setSubmitting }) =>
              edit(
                {
                  associationId: associationId,
                  data: values,
                },
                {
                  onSettled: setSubmitting(false),
                }
              )
            }
            onDelete={() =>
              window.confirm(
                "Êtes-vous sûr(e) de vouloir supprimer cette association ? Cette opération ne peut pas être annulée."
              ) && remove({ associationId: associationId })
            }
          />
        </Card>
      </Container>
    </SettingsLayout>
  ) : null;
};
