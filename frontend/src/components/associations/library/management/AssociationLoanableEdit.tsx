import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { useParams } from "react-router";
import { api, useBetterQuery } from "../../../../services/apiService";
import { Loading } from "../../../utils/Loading";
import { Error } from "../../../utils/Error";
import { Loanable } from "../../../../models/associations/library";
import { PageTitle } from "../../../utils/PageTitle";
import { MutateLoanableForm } from "./MutateLoanableForm";
import Card from "react-bootstrap/Card";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../utils/Toast";
import { useHistory } from "react-router-dom";
import { ArrowLink } from "../../../utils/ArrowLink";

export const AssociationLoanableEdit = ({
  association,
}: {
  association: Association;
}) => {
  const history = useHistory();
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );
  const { loanableId } = useParams<{ loanableId: string }>();

  const { data: loanable, error, status } = useBetterQuery<Loanable>(
    ["loanables.get", { loanableId: loanableId }],
    api.loanables.get
  );

  const [edit] = useMutation(api.loanables.patch, {
    onMutate: () => sendInfoToast("Modifications envoyées…"),
    onSuccess: () => {
      sendSuccessToast("Modifications enregistrées");
      queryCache.invalidateQueries("loanables.get");
      queryCache.invalidateQueries("loanables.list");
    },
    onError: () => sendErrorToast("Une erreur est survenue"),
  });

  const [remove] = useMutation(api.loanables.remove, {
    onMutate: () => sendInfoToast("Suppression en cours…"),
    onSuccess: () => {
      sendSuccessToast("Objet supprimé");
      queryCache.invalidateQueries("loanables.list");
    },
    onError: () => sendErrorToast("Une erreur est survenue"),
  });

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : status === "success" && loanable ? (
    <>
      <PageTitle>
        <ArrowLink
          to={`/associations/${association.id}/bibliotheque/gestion`}
        />
        Modifier un objet
      </PageTitle>

      <Card>
        <MutateLoanableForm
          initialValues={{
            name: loanable.name || "",
            description: loanable.description || "",
            comment: loanable.comment || "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            return edit({ id: loanableId, data: values });
          }}
          onDelete={() =>
            window.confirm(
              "Êtes-vous sûr(e) de supprimer cet objet ? Cette opération ne peut pas être annulée."
            ) &&
            remove(
              { id: loanableId },
              {
                onSuccess: () =>
                  history.push(
                    `/associations/${association.id}/bibliotheque/gestion`
                  ),
              }
            )
          }
        />
      </Card>
    </>
  ) : null;
};
