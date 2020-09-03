import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import dayjs from "dayjs";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { ToastContext } from "../../../utils/Toast";
import { MutateEventForm } from "../MutateEventForm";
import { ForbiddenError } from "../../../utils/ErrorPage";
import { ArrowLink } from "../../../utils/ArrowLink";
import { genericMutationErrorHandling } from "../../../../utils/genericMutationErrorHandling";

export const AssociationCreateEvent = ({
  association,
}: {
  association: Association;
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const [create] = useMutation(api.events.create, {
    onSuccess: (response) => {
      queryCache.invalidateQueries(["events.list"]);
      sendSuccessToast("Événement créé.");
    },
    onError: genericMutationErrorHandling(sendErrorToast),
  });

  if (!association.myRole?.permissions?.includes("event")) {
    return <ForbiddenError />;
  }

  return (
    <Container className="mt-5">
      <PageTitle>
        <ArrowLink to={`/associations/${association.id}/evenements`} />
        Créer un événement
      </PageTitle>
      <Card className="text-left">
        <MutateEventForm
          initialValues={{
            name: "",
            description: "",
            startsAt: dayjs().add(1, "hour").toDate(),
            endsAt: dayjs().add(4, "hour").toDate(),
            place: "",
          }}
          onSubmit={(values, { resetForm, setSubmitting }) =>
            create(
              {
                data: {
                  association: association.id,
                  ...values,
                },
              },
              {
                onSuccess: resetForm,
                onSettled: () => setSubmitting(false),
              }
            )
          }
        />
      </Card>
    </Container>
  );
};
