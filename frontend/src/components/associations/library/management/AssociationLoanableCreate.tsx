import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { useHistory } from "react-router";
import { ToastContext } from "../../../utils/Toast";
import { api } from "../../../../services/apiService";
import { queryCache, useMutation } from "react-query";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { MutateLoanableForm } from "./MutateLoanableForm";
import { ArrowLink } from "../../../utils/ArrowLink";

export const AssociationLoanableCreate = ({
  association,
}: {
  association: Association;
}) => {
  const history = useHistory();
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const [create] = useMutation(api.loanables.create, {
    onMutate: () => sendInfoToast("Création en cours…"),
    onSuccess: () => {
      sendSuccessToast("Objet créé !");
      queryCache.invalidateQueries("loanables.get");
      queryCache.invalidateQueries("loanables.list");
      history.push(`/associations/${association.id}/bibliotheque/gestion`);
    },
    onError: () => sendErrorToast("Une erreur est survenue"),
  });

  return (
    <>
      <PageTitle>
        <ArrowLink
          to={`/associations/${association.id}/bibliotheque/gestion`}
        />
        Créer un objet
      </PageTitle>

      <Card>
        <MutateLoanableForm
          initialValues={{
            name: "",
            description: "",
            comment: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            return create({ data: { ...values, library: association.id } });
          }}
        />
      </Card>
    </>
  );
};
