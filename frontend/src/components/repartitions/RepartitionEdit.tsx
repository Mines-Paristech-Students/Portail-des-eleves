import { useParams } from "react-router";
import { api } from "../../services/apiService";
import React, { useContext } from "react";
import { ToastContext } from "../utils/Toast";
import { Campaign } from "../../models/repartitions";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import Container from "react-bootstrap/Container";
import { MutateRepartitionForm } from "./MutateRepartitionForm";
import { RepartitionsHome } from "./Home";

export const RepartitionEdit = ({ campaign }: { campaign: Campaign }) => {
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const { repartitionId } = useParams<{ repartitionId: string }>();

  const [edit] = useMutation(api.campaigns.edit, {
    onMutate: () => sendInfoToast("Sauvegarde en cours…"),
    onSuccess: () => {
      sendSuccessToast("Répartition sauvegardée.");
      return queryCache
        .refetchQueries("campaigns.list")
        .then(() => queryCache.refetchQueries("campaigns.get"));
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response
            ? "Détails : " +
              (error.response.status === 403
                ? "vous n’avez pas le droit de modifier cette répartition."
                : error.response.data.detail)
            : ""
        }`
      );
    },
  });

  return (
    <RepartitionsHome>
      <MutateRepartitionForm
        name="Modifier le nom"
        initialValues={{
          name: campaign.name,
        }}
        onSubmit={(values, { setSubmitting }) =>
          edit(
            { id: repartitionId, ...values },
            { onSettled: () => setSubmitting(false) }
          )
        }
      />
    </RepartitionsHome>
  );
};
