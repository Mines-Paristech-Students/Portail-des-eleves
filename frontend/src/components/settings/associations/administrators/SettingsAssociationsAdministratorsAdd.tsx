import React, { useContext } from "react";
import { Form, Formik } from "formik";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import * as Yup from "yup";
import { useParams } from "react-router";
import { api, useBetterQuery } from "../../../../services/apiService";
import { Association } from "../../../../models/associations/association";
import { Loading } from "../../../utils/Loading";
import { Error } from "../../../utils/Error";
import { SettingsLayout } from "../../SettingsLayout";
import { PageTitle } from "../../../utils/PageTitle";
import { ArrowLink } from "../../../utils/ArrowLink";
import Container from "react-bootstrap/Container";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import { ToastContext } from "../../../utils/Toast";
import { SelectUserFormGroup } from "../../../utils/forms/SelectUserFormGroup";
import { useHistory } from "react-router-dom";

export const SettingsAssociationsAdministratorsAdd = () => {
  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  // Load the relevant association.
  const { associationId } = useParams<{ associationId: string }>();
  const { data: association, status, error } = useBetterQuery<Association>(
    ["associations.get", { associationId }],
    api.associations.get,
    { refetchOnWindowFocus: false }
  );

  // Mutation for creating the role.
  const [create] = useMutation(api.roles.create, {
    onSuccess: () => {
      sendSuccessToast("Administrateur(trice) ajouté(e).");
      queryCache
        .invalidateQueries(["roles.list"])
        .then(() =>
          history.push(
            `/parametres/associations/${associationId}/administrateurs`
          )
        );
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response
            ? "Détails : " +
              (error.response.status === 403
                ? "vous n’avez pas le droit de modifier ce rôle."
                : error.response.data.detail)
            : ""
        }`
      );
    },
  });
  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    return create({
      role: {
        role: "Administrateur(trice)",
        rank: 0,
        startDate: new Date(),
        endDate: null,
        permissions: ["administration"],
        association: associationId,
        user: values.user.value,
      },
    });
  };

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : status === "success" && association ? (
    <SettingsLayout>
      <Container>
        <div className="d-flex align-items-center">
          <PageTitle>
            <ArrowLink
              to={`/parametres/associations/${associationId}/administrateurs`}
            />
            Ajouter un(e) administrateur(trice) à {association.name}
          </PageTitle>
        </div>
        <Card className="text-left">
          <Formik
            initialValues={{ user: undefined }}
            validationSchema={Yup.object({
              user: Yup.object().required("Ce champ est requis."),
            })}
            onSubmit={handleSubmit}
          >
            <Form>
              <Card.Body>
                <SelectUserFormGroup name="user" label="Membre" />
              </Card.Body>

              <Card.Footer className="text-right">
                <Button type="submit" variant="outline-success">
                  Ajouter
                </Button>
              </Card.Footer>
            </Form>
          </Formik>
        </Card>
      </Container>
    </SettingsLayout>
  ) : null;
};
