import React, { useContext } from "react";
import { Poll } from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import { PollEditModalAdminForm } from "./PollEditModalAdminForm";
import { PollEditModalUserForm } from "./PollEditModalUserForm";
import { ToastContext } from "../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../services/apiService";
import { AxiosError } from "axios";

export const PollEditModal = ({
  show,
  onHide,
  poll,
  adminVersion,
}: {
  show: boolean;
  onHide: any;
  poll: Poll | null;
  adminVersion: boolean;
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const [update] = useMutation(api.polls.update, {
    onSuccess: () => {
      queryCache.refetchQueries(["polls.list"]);
      queryCache.refetchQueries(["polls.stats"]);
      sendSuccessToast("Sondage modifié.");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response
            ? "Détails : " +
              (error.response.status === 403
                ? "vous n’avez pas le droit de modifier ce sondage."
                : error.response.data.detail)
            : ""
        }`
      );
    },
  });

  const onUpdate = (poll, data, setSubmitting) => {
    update(
      {
        pollId: poll.id,
        data: data,
      },
      {
        onSettled: () => {
          setSubmitting(false);
          onHide();
        },
      }
    );
  };

  if (poll !== null) {
    return (
      <Modal size="lg" show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Modifier</Modal.Title>
        </Modal.Header>

        {adminVersion ? (
          <PollEditModalAdminForm
            poll={poll}
            handleClose={onHide}
            onUpdate={(data, setSubmitting) =>
              onUpdate(poll, data, setSubmitting)
            }
          />
        ) : (
          <PollEditModalUserForm
            poll={poll}
            handleClose={onHide}
            onUpdate={(data, setSubmitting) =>
              onUpdate(poll, data, setSubmitting)
            }
          />
        )}
      </Modal>
    );
  }

  return null;
};
