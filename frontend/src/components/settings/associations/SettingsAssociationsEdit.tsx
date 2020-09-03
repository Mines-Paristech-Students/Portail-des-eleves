import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ToastContext } from "../../utils/Toast";
import { api, useBetterQuery } from "../../../services/apiService";
import { Association } from "../../../models/associations/association";
import { queryCache, useMutation } from "react-query";
import { LoadingAssociation } from "../../associations/Loading";
import { Error } from "../../utils/Error";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { SettingsLayout } from "../SettingsLayout";
import { MutateAssociationForm } from "./MutateAssociationForm";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { genericMutationErrorHandling } from "../../../utils/genericMutationErrorHandling";

export const SettingsAssociationsEdit = () => {
  const { associationId } = useParams<{ associationId: string }>();

  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const { data: association, error, status } = useBetterQuery<Association>(
    ["association.get", { associationId }],
    api.associations.get,
    { refetchOnWindowFocus: false }
  );

  const [edit] = useMutation(api.associations.update, {
    onSuccess: () => {
      queryCache.invalidateQueries(["association.get"]);
      sendSuccessToast("Association modifiée.");
    },
    onError: genericMutationErrorHandling(sendErrorToast)
  });

  const [remove] = useMutation(api.associations.delete, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.list"]);
      sendSuccessToast("Association supprimée.");
      history.push(`/parametres/associations`);
    },
    onError: genericMutationErrorHandling(sendErrorToast)
  });

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  return status === "loading" ? (
    <LoadingAssociation />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : association ? (
    <SettingsLayout>
      <Container>
        <ConfirmDeleteModal
          association={association}
          onDelete={() => remove({ associationId: associationId })}
          show={showConfirmDeleteModal}
          onHide={() => setShowConfirmDeleteModal(false)}
        />
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
            onDelete={() => setShowConfirmDeleteModal(true)}
          />
        </Card>
      </Container>
    </SettingsLayout>
  ) : null;
};
