import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api, useBetterQuery } from "../../../../services/apiService";
import { PageTitle } from "../../../utils/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Event } from "../../../../models/associations/event";
import { LoadingAssociation } from "../../Loading";
import { Error } from "../../../utils/Error";
import { MutateEventForm } from "../MutateEventForm";
import { ForbiddenError } from "../../../utils/ErrorPage";
import { ArrowLink } from "../../../utils/ArrowLink";
import { genericMutationErrorHandling } from "../../../../utils/genericMutationErrorHandling";

export const AssociationEditEvent = ({
  association,
}: {
  association: Association;
}) => {
  const { eventId } = useParams<{ eventId: string }>();

  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const { data: event, error, status } = useBetterQuery<Event>(
    ["events.get", { eventId }],
    api.events.get,
    { refetchOnWindowFocus: false }
  );

  const [edit] = useMutation(api.events.update, {
    onSuccess: (response) => {
      queryCache.invalidateQueries(["events.get"]);

      if (response.status === 200) {
        sendSuccessToast("Événement modifié.");
      }
    },
    onError: genericMutationErrorHandling(sendErrorToast),
  });

  const [remove] = useMutation(api.events.delete, {
    onSuccess: () => {
      queryCache.invalidateQueries(["events.list"]);
      sendSuccessToast("Événement supprimé.");

      history.push(`/associations/${association.id}/evenements`);
    },
    onError: genericMutationErrorHandling(sendErrorToast),
  });

  if (!association.myRole?.permissions?.includes("event")) {
    return <ForbiddenError />;
  }

  if (status === "loading") {
    return <LoadingAssociation />;
  } else if (status === "error") {
    return <Error detail={error} />;
  } else if (event) {
    return (
      <>
        <PageTitle>
          <ArrowLink to={`/associations/${association.id}/evenements`} />
          Modifier l’événement
        </PageTitle>
        <Card className="text-left">
          <MutateEventForm
            initialValues={event}
            onSubmit={(values, { setSubmitting }) =>
              edit(
                {
                  eventId: eventId,
                  data: {
                    association: association.id,
                    ...values,
                  },
                },
                {
                  onSettled: setSubmitting(false),
                }
              )
            }
            onDelete={() =>
              window.confirm(
                "Êtes-vous sûr(e) de vouloir supprimer cet événement ? Cette opération ne peut pas être annulée."
              ) && remove({ eventId: event.id })
            }
          />
        </Card>
      </>
    );
  }

  return null;
};
