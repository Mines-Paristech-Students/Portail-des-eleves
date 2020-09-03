import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import { Link, useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { MutateAssociationForm } from "./MutateAssociationForm";
import { SettingsLayout } from "../SettingsLayout";
import { ToastContext } from "../../utils/Toast";
import { api } from "../../../services/apiService";
import { queryCache, useMutation } from "react-query";
import { genericMutationErrorHandling } from "../../../utils/genericMutationErrorHandling";

export const SettingsAssociationsAdd = () => {
  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const [create] = useMutation(api.associations.create, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.list"]);
      sendSuccessToast("Association créée.");
      history.push(`/parametres/associations`);
    },
    onError: genericMutationErrorHandling(sendErrorToast)
  });

  return (
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
          Créer une association
        </PageTitle>
        <Card className="text-left">
          <MutateAssociationForm
            initialValues={{
              name: "",
              rank: 0,
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
